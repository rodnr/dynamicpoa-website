---
title: "Power BI: large semantic models e particoes XMLA em escala"
description: "Modelos grandes travando no Premium? Veja como ligar large storage format, orquestrar refresh por particao via XMLA e controlar memoria para datasets corporativos."
date: '2026-10-25 17:00:57'
---
Quando um modelo semantico do Power BI cresce para dezenas de gigabytes, o comportamento padrao da plataforma deixa de ser suficiente. Refresh completo estoura a janela, o commit de memoria dobra durante a atualizacao e o dataset simplesmente para de abrir no Service. A resposta nao e "comprar mais capacidade" — e mudar o formato de armazenamento e orquestrar o refresh no nivel de particao via XMLA. Este post trata do que muda na pratica para quem opera modelos grandes em Premium/Fabric.

**O que o Large semantic model storage format realmente faz**

Por padrao, um dataset usa o formato small, que carrega o modelo inteiro na memoria como um unico bloco e tem limite rigido de tamanho. O **Large semantic model storage format** (ligado por dataset nas Settings, ou via API/Capacity settings) muda a representacao interna para um formato paginavel, apoiado em armazenamento premium, com estas consequencias concretas:

* O limite de tamanho do dataset passa a ser o da capacidade (ate centenas de GB em SKUs grandes), nao o teto fixo do formato small.
* Habilita o **XMLA endpoint read/write**, que e o pre-requisito para gerenciar particoes, fazer refresh seletivo e conectar Tabular Editor/SSMS/DAX Studio como se fosse um Analysis Services.
* Muda o perfil de memoria: o modelo nao precisa estar 100% residente o tempo todo, mas o pico de refresh ainda exige espaco para a versao antiga + a nova simultaneamente.

Nao e um botao gratuito: ligar large format em datasets pequenos pode ate piorar performance de carga inicial. O ganho aparece em modelos grandes, com refresh particionado e muitos usuarios concorrentes.

**Por que o refresh completo nao escala e onde entram as particoes**

Um refresh completo reprocessa todas as tabelas do zero. Numa fato de 400 milhoes de linhas, isso significa reler a fonte inteira toda noite, reconstruir todos os dicionarios VertiPaq e dobrar o commit de memoria no processo. O incremental refresh (RangeStart/RangeEnd) resolve parte disso criando particoes automaticas por periodo — mas ele e uma caixa fechada: voce nao controla quando cada particao e processada, nao reprocessa uma particao historica pontualmente e nao combina facilmente janelas de granularidade diferentes.

Com XMLA read/write, voce assume o controle das particoes manualmente (via TMSL no SSMS, Tabular Editor ou a API de refresh enhanced). Isso abre cenarios que o incremental sozinho nao cobre:

* **Refresh so do periodo quente** (ex.: ultimos 2 dias) de hora em hora, deixando o historico intocado.
* **Reprocessamento cirurgico** de uma unica particao quando a fonte corrigiu dados de um mes especifico, sem reprocessar o resto.
* **Particionamento por outra dimensao** (regiao, unidade de negocio) alem de data, quando o padrao de atualizacao nao e cronologico.

**Os tipos de operacao de refresh que importam**

O modelo tabular nao tem so "refresh" — e aqui mora a diferenca entre estourar ou nao a memoria. Ao disparar via XMLA/TMSL ou enhanced refresh API, voce escolhe o processing type:

1. **Full** — recarrega dados e recalcula tudo (colunas calculadas, hierarquias, relacionamentos). Caro, dobra memoria.
2. **Data** — so recarrega os dados da particao; deixa o modelo em estado "nao processado" para calculos ate rodar um recalc.
3. **Calculate** — recalcula colunas calculadas, hierarquias e relacionamentos sem reler dados.
4. **ClearValues** — esvazia a particao (util para liberar memoria de historico que sera reconstruido).

O padrao escalavel e um **Data em paralelo por particao** seguido de um unico **Calculate no modelo** no final. Processar Data nas particoes quentes e um Calculate global custa muito menos memoria e tempo do que N refreshes Full. O parametro de **maxParallelism** na enhanced refresh API controla quantas particoes processam juntas — mais paralelismo acelera, mas aumenta o pico de commit.

**Controle de memoria: o que derruba o dataset em producao**

Tres limites da capacidade decidem se o refresh conclui:

* **Max memory per dataset** — o teto de RAM que aquele dataset pode ocupar. No pico de refresh Full voce precisa de espaco para o modelo antigo (servindo queries) + a nova versao sendo construida. Se nao couber, o refresh falha com erro de memoria.
* **Eviction sob pressao** — em large format, datasets inativos podem ser removidos da memoria e recarregados sob demanda. A primeira query apos eviction e lenta (cold load). Em capacidade subdimensionada isso vira um ping-pong de carga/descarga que degrada a experiencia.
* **Commit vs working set** — o commit (memoria reservada) pode exceder a RAM fisica e cair em paginacao, o que mata a performance antes de estourar o limite nominal.

Medir isso nao e opcional: a Metrics App da capacidade (Fabric/Premium) e as DMVs via XMLA (como `$System.discover_memoryusage`) mostram onde a memoria esta indo. Em producao, o diagnostico comeca por olhar o pico de commit durante a janela de refresh, nao a media.

**Um padrao de referencia para modelo corporativo grande**

Para um dataset de dezenas de GB servindo centenas de usuarios:

1. Ligue **Large semantic model storage format** e confirme XMLA read/write na capacidade.
2. Modele a fato com **particoes por mes** (via incremental refresh para o esqueleto, ou TMSL manual se precisar de controle total).
3. Faca **refresh Data** so das particoes do periodo quente em alta frequencia, com paralelismo calibrado para nao estourar o commit.
4. Rode um **Calculate** global unico apos os Data para fechar o estado do modelo.
5. Reserve o **Full** para mudancas estruturais (nova coluna calculada, mudanca de relacionamento), fora do horario de pico.
6. Monitore pico de commit e eviction pela Metrics App; se houver cold loads frequentes, o problema e dimensionamento de capacidade, nao o modelo.

**Quando isso ainda e exagero**

Se o modelo cabe confortavelmente no formato small, tem refresh que termina dentro da janela e nao sofre com memoria, ligar large format e orquestrar XMLA so adiciona complexidade operacional sem retorno. O gatilho e concreto: modelo grande + janela de refresh apertada + necessidade de reprocessar particoes seletivamente + muitos usuarios concorrentes. Abaixo disso, incremental refresh nativo resolve.

Arquitetar modelos semanticos grandes, calibrar capacidade Fabric/Premium e montar esteiras de refresh via XMLA e exatamente o tipo de trabalho em que a Dynamic Solucoes atua. Se sua empresa opera datasets corporativos no limite da janela de atualizacao, nossos planos de suporte e consultoria em dados ajudam a tirar o maximo da plataforma sem desperdicio de capacidade.



When a Power BI semantic model grows into the tens of gigabytes, the platform's default behavior stops being enough. A full refresh blows past the window, memory commit doubles during the update, and the dataset simply stops opening in the Service. The answer isn't "buy more capacity" — it's changing the storage format and orchestrating refresh at the partition level via XMLA. This post covers what actually changes for teams running large models on Premium/Fabric.

**What Large semantic model storage format really does**

By default, a dataset uses the small format, which loads the entire model into memory as a single block and has a hard size cap. The **Large semantic model storage format** (enabled per dataset in Settings, or via API/Capacity settings) switches the internal representation to a pageable format backed by premium storage, with these concrete consequences:

* The dataset size limit becomes the capacity's limit (up to hundreds of GB on large SKUs), not the small format's fixed ceiling.
* It enables the **XMLA read/write endpoint**, which is the prerequisite for managing partitions, doing selective refresh, and connecting Tabular Editor/SSMS/DAX Studio as if it were an Analysis Services instance.
* It changes the memory profile: the model doesn't need to be 100% resident all the time, but the refresh peak still requires room for the old version + the new one simultaneously.

It's not a free switch: enabling large format on small datasets can actually hurt initial load performance. The payoff shows up in large models, with partitioned refresh and many concurrent users.

**Why full refresh doesn't scale and where partitions come in**

A full refresh reprocesses every table from scratch. On a 400-million-row fact table, that means rereading the entire source every night, rebuilding every VertiPaq dictionary, and doubling memory commit in the process. Incremental refresh (RangeStart/RangeEnd) solves part of this by creating automatic partitions by period — but it's a closed box: you don't control when each partition is processed, you can't reprocess a single historical partition on demand, and you can't easily combine windows of different granularity.

With XMLA read/write you take manual control of partitions (via TMSL in SSMS, Tabular Editor, or the enhanced refresh API). That opens scenarios incremental alone doesn't cover:

* **Refresh only the hot period** (e.g., last 2 days) hourly, leaving history untouched.
* **Surgical reprocessing** of a single partition when the source corrected data for a specific month, without reprocessing the rest.
* **Partitioning by another dimension** (region, business unit) beyond date, when the update pattern isn't chronological.

**The refresh operation types that matter**

The tabular model doesn't just have "refresh" — and this is where the difference between blowing memory or not lives. When triggering via XMLA/TMSL or the enhanced refresh API, you choose the processing type:

1. **Full** — reloads data and recalculates everything (calculated columns, hierarchies, relationships). Expensive, doubles memory.
2. **Data** — only reloads the partition's data; leaves the model in an "unprocessed" state for calculations until a recalc runs.
3. **Calculate** — recalculates calculated columns, hierarchies, and relationships without rereading data.
4. **ClearValues** — empties the partition (useful to free history memory that will be rebuilt).

The scalable pattern is a **parallel Data per partition** followed by a single model-wide **Calculate** at the end. Processing Data on the hot partitions plus one global Calculate costs far less memory and time than N Full refreshes. The **maxParallelism** parameter in the enhanced refresh API controls how many partitions process together — more parallelism speeds things up but raises the commit peak.

**Memory control: what takes the dataset down in production**

Three capacity limits decide whether the refresh completes:

* **Max memory per dataset** — the RAM ceiling that dataset can occupy. At the Full refresh peak you need room for the old model (serving queries) + the new version being built. If it doesn't fit, refresh fails with a memory error.
* **Eviction under pressure** — in large format, inactive datasets can be evicted from memory and reloaded on demand. The first query after eviction is slow (cold load). On undersized capacity this becomes a load/unload ping-pong that degrades the experience.
* **Commit vs working set** — commit (reserved memory) can exceed physical RAM and fall into paging, which kills performance before hitting the nominal limit.

Measuring this isn't optional: the capacity Metrics App (Fabric/Premium) and DMVs via XMLA (such as `$System.discover_memoryusage`) show where memory is going. In production, diagnosis starts by looking at the commit peak during the refresh window, not the average.

**A reference pattern for a large corporate model**

For a dataset of tens of GB serving hundreds of users:

1. Enable **Large semantic model storage format** and confirm XMLA read/write on the capacity.
2. Model the fact table with **monthly partitions** (via incremental refresh for the skeleton, or manual TMSL if you need full control).
3. Run **Data refresh** only on the hot-period partitions at high frequency, with parallelism calibrated not to blow the commit.
4. Run a single global **Calculate** after the Data operations to close the model's state.
5. Reserve **Full** for structural changes (new calculated column, relationship change), outside peak hours.
6. Monitor commit peak and eviction via the Metrics App; if cold loads are frequent, the problem is capacity sizing, not the model.

**When this is still overkill**

If the model fits comfortably in small format, refreshes finish within the window, and memory isn't an issue, enabling large format and orchestrating XMLA only adds operational complexity with no return. The trigger is concrete: large model + tight refresh window + need to selectively reprocess partitions + many concurrent users. Below that, native incremental refresh does the job.

Architecting large semantic models, sizing Fabric/Premium capacity, and building XMLA-based refresh pipelines is exactly the kind of work Dynamic Solucoes does. If your company runs corporate datasets at the edge of the refresh window, our support plans and data consulting help you get the most out of the platform without wasting capacity.
