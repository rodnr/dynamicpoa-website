---
title: "Power BI: aggregations para acelerar modelos DirectQuery em escala"
description: "Modelos DirectQuery grandes travam no clique do usuário. Veja como configurar aggregations no Power BI para responder consultas em cache sem abrir mão da granularidade."
date: '2026-09-25 17:53:20'
---
Modelos em DirectQuery resolvem o problema do volume — o fato de bilhões de linhas nunca precisar caber na memória do dataset — mas transferem esse custo para cada interação do usuário. Todo clique em um slicer, todo drill, toda troca de página vira uma query SQL na fonte, e a experiência fica refém da latência do banco. **Aggregations** são o mecanismo do Power BI para quebrar esse trade-off: manter a granularidade completa em DirectQuery e, ao mesmo tempo, responder a maioria das consultas de um cache agregado em memória, sem que o usuário (ou a medida DAX) precise saber que isso acontece.

**O que uma aggregation realmente faz**

Uma aggregation é uma tabela adicional, geralmente em modo Import (ou Dual), que contém uma versão pré-somada da tabela fato em uma granularidade mais grossa. Em vez de armazenar cada transação, ela guarda, por exemplo, o total de vendas por dia, produto e loja. O ponto central é que o Power BI faz o *aggregation matching* automaticamente: quando uma medida como `SUM(Vendas[Valor])` é avaliada em um nível que a tabela agregada cobre, o engine responde direto do VertiPaq em milissegundos, sem tocar na fonte. Se a consulta pede um grão que a agregação não cobre — uma transação individual, um atributo não presente na agregação — ele faz *fallback* transparente para o DirectQuery na tabela detalhada.

O usuário não muda nada. A mesma medida, o mesmo visual, o mesmo relatório. A diferença é que 80–90% das interações típicas de dashboard (totais, tendências mensais, ranking de categorias) passam a ser atendidas pelo cache.

**Configurando: storage mode e o papel do Dual**

O desenho clássico tem três camadas:

1. **Tabela fato detalhada** em DirectQuery — a granularidade máxima, que garante o fallback.
2. **Tabela de agregação** em Import — o cache pré-somado.
3. **Tabelas de dimensão** em **Dual** — este é o detalhe que muitos erram.

As dimensões precisam estar em Dual porque elas participam das duas rotas de consulta. Quando o engine resolve a query pela agregação (Import), a dimensão precisa se comportar como Import; quando cai no fallback (DirectQuery), a dimensão precisa se comportar como DirectQuery para gerar o JOIN correto no SQL. Se você deixar a dimensão como Import puro, o fallback quebra ou gera consultas ineficientes; se deixar como DirectQuery puro, você perde a resposta em cache. Dual resolve os dois casos.

**Aggregations gerenciadas vs. user-defined**

Há dois modos de declarar aggregations no Power BI Desktop:

* **Managed aggregations** (a caixa de diálogo "Manage aggregations"): você mapeia cada coluna da tabela agregada para uma coluna da tabela detalhada com uma função de summarization (Sum, Count, GroupBy, Min, Max). O engine usa esse mapeamento para decidir o matching. É o caminho recomendado para agregações sobre uma única fato, com relacionamentos convencionais.
* **User-defined aggregations sem relacionamento**: para cenários mais complexos (várias granularidades encadeadas, agregações que dependem de colunas GroupBy específicas), você declara múltiplas tabelas de agregação em precisão crescente, e o engine escolhe a mais fina que ainda cobre a consulta.

O campo **Precedence** controla essa ordem: se você tem uma agregação diária e uma mensal, defina precedência maior para a diária (mais detalhada) — o engine tenta a de maior precedência primeiro e só desce quando a consulta é mais grossa.

**Validando que o matching está acontecendo**

O erro mais comum é montar toda a estrutura e nunca confirmar que o hit está ocorrendo — deixando o modelo com o custo de manter o cache mas sem o benefício. Duas formas de validar:

* No **DAX Studio**, com Server Timings ligado, uma consulta que bate na agregação mostra a busca resolvida no *Storage Engine* em modo cache, sem gerar uma query SQL na origem. Se aparecer uma linha de RemoteEvents / SQL, houve fallback.
* No **SQL Profiler / Extended Events** contra a fonte: se o visual não dispara SQL nenhum, o hit aconteceu.

Motivos frequentes de fallback indesejado: a medida usa uma coluna que não está na agregação; há um filtro sobre um atributo de granularidade fina; a função de summarization não bate (um `DISTINCTCOUNT` não é resolvido por uma soma pré-agregada — distinct count exige tratamento próprio); ou a dimensão ficou em Import em vez de Dual.

**Cuidados de produção**

* **DISTINCTCOUNT não agrega trivialmente.** Contagens distintas não são somáveis, então uma agregação de `Sum` não resolve. Ou você aceita o fallback para essas medidas, ou modela uma agregação específica com a coluna de contagem distinta no grão certo.
* **A agregação precisa ser atualizada.** Sendo Import, ela tem um refresh próprio. Se a fonte DirectQuery muda em tempo real e a agregação é atualizada de hora em hora, existe uma janela de inconsistência entre o cache e o detalhe. Alinhe a frequência de refresh à tolerância do negócio.
* **Granularidade é uma aposta.** Uma agregação boa cobre os padrões de consulta reais. Analise quais níveis os usuários mais acessam (Performance Analyzer, logs de uso) antes de decidir o grão — uma agregação fina demais quase não reduz linhas; uma grossa demais quase nunca dá hit.
* **Direct Lake muda o jogo.** No Microsoft Fabric, o modo Direct Lake lê Parquet do OneLake diretamente em memória, reduzindo a necessidade de aggregations em muitos cenários. Ainda assim, para relacionamentos com fontes SQL externas em DirectQuery, aggregations continuam sendo a ferramenta certa.

Aggregations são um dos recursos de maior impacto/esforço do Power BI corporativo: bem configuradas, transformam um relatório DirectQuery lento em algo que responde como Import na maioria das interações, sem duplicar todo o volume de dados na memória. Se sua empresa opera modelos grandes e quer estruturar arquitetura de dados, storage modes e performance de forma consistente, a consultoria de dados da Dynamic Soluções pode ajudar a desenhar e validar esse tipo de decisão antes que o custo de uma escolha errada apareça em produção.



DirectQuery models solve the volume problem — the fact that billions of rows never need to fit in the dataset's memory — but they shift that cost onto every user interaction. Every slicer click, every drill, every page change becomes a SQL query against the source, and the experience is hostage to database latency. **Aggregations** are Power BI's mechanism for breaking that trade-off: keeping full granularity in DirectQuery while answering the majority of queries from an aggregated in-memory cache, without the user (or the DAX measure) ever needing to know it's happening.

**What an aggregation actually does**

An aggregation is an additional table, usually in Import mode (or Dual), holding a pre-summarized version of the fact table at a coarser grain. Instead of storing every transaction, it stores, for example, total sales by day, product and store. The key point is that Power BI does *aggregation matching* automatically: when a measure like `SUM(Sales[Amount])` is evaluated at a level the aggregated table covers, the engine answers straight from VertiPaq in milliseconds, never touching the source. If the query asks for a grain the aggregation doesn't cover — an individual transaction, an attribute not present in the aggregation — it transparently *falls back* to DirectQuery on the detail table.

The user changes nothing. Same measure, same visual, same report. The difference is that 80–90% of typical dashboard interactions (totals, monthly trends, category rankings) are now served from the cache.

**Configuring: storage mode and the role of Dual**

The classic design has three layers:

1. **Detail fact table** in DirectQuery — the maximum granularity that guarantees fallback.
2. **Aggregation table** in Import — the pre-summarized cache.
3. **Dimension tables** in **Dual** — this is the detail many people get wrong.

Dimensions must be Dual because they participate in both query paths. When the engine resolves the query via the aggregation (Import), the dimension must behave as Import; when it falls back (DirectQuery), the dimension must behave as DirectQuery to generate the correct JOIN in SQL. If you leave the dimension as pure Import, fallback breaks or produces inefficient queries; if you leave it as pure DirectQuery, you lose the cached answer. Dual handles both cases.

**Managed vs. user-defined aggregations**

There are two ways to declare aggregations in Power BI Desktop:

* **Managed aggregations** (the "Manage aggregations" dialog): you map each column of the aggregated table to a column of the detail table with a summarization function (Sum, Count, GroupBy, Min, Max). The engine uses this mapping to decide matching. It's the recommended path for aggregations over a single fact with conventional relationships.
* **User-defined aggregations without relationships**: for more complex scenarios (multiple chained granularities, aggregations that depend on specific GroupBy columns), you declare several aggregation tables at increasing precision, and the engine picks the finest one that still covers the query.

The **Precedence** field controls that order: if you have a daily and a monthly aggregation, set higher precedence for the daily (more detailed) one — the engine tries the highest precedence first and only steps down when the query is coarser.

**Validating that matching is happening**

The most common mistake is building the whole structure and never confirming the hit is occurring — leaving the model with the cost of maintaining the cache but none of the benefit. Two ways to validate:

* In **DAX Studio**, with Server Timings on, a query that hits the aggregation shows the lookup resolved in the *Storage Engine* in cache mode, with no SQL query against the source. If a RemoteEvents / SQL line appears, there was fallback.
* With **SQL Profiler / Extended Events** against the source: if the visual fires no SQL at all, the hit happened.

Frequent causes of unwanted fallback: the measure uses a column not in the aggregation; there's a filter on a fine-grain attribute; the summarization function doesn't match (a `DISTINCTCOUNT` isn't resolved by a pre-aggregated sum — distinct count needs its own handling); or the dimension was left in Import instead of Dual.

**Production considerations**

* **DISTINCTCOUNT doesn't aggregate trivially.** Distinct counts aren't summable, so a `Sum` aggregation won't resolve them. Either you accept fallback for those measures, or you model a specific aggregation with the distinct-count column at the right grain.
* **The aggregation must be refreshed.** Being Import, it has its own refresh. If the DirectQuery source changes in real time and the aggregation refreshes hourly, there's a window of inconsistency between cache and detail. Align the refresh frequency with the business tolerance.
* **Granularity is a bet.** A good aggregation covers the real query patterns. Analyze which levels users access most (Performance Analyzer, usage logs) before deciding the grain — an aggregation that's too fine barely reduces rows; one that's too coarse rarely gets a hit.
* **Direct Lake changes the game.** In Microsoft Fabric, Direct Lake mode reads Parquet from OneLake directly into memory, reducing the need for aggregations in many scenarios. Even so, for relationships with external SQL sources in DirectQuery, aggregations remain the right tool.

Aggregations are one of the highest impact-per-effort features in enterprise Power BI: configured well, they turn a slow DirectQuery report into something that responds like Import on most interactions, without duplicating the full data volume in memory. If your company runs large models and wants to structure data architecture, storage modes and performance consistently, Dynamic Soluções' data consultancy can help design and validate this kind of decision before the cost of a wrong choice shows up in production.
