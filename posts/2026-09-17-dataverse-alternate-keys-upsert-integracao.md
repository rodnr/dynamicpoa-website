---
title: "Dataverse: alternate keys e upsert para integracoes idempotentes"
description: "Como usar alternate keys e a operacao Upsert no Dataverse para integracoes que nao duplicam registros nem quebram em reprocessamento, com foco em performance e concorrencia."
date: '2026-09-17 17:35:09'
---
Toda integracao que grava no Dataverse a partir de um sistema externo mais cedo ou mais tarde esbarra na mesma pergunta: este registro ja existe? Sem uma resposta confiavel, o fluxo cai em um dos dois extremos — duplica dados a cada reprocessamento ou vive fazendo um Get antes de cada Create para conferir. Alternate keys e a operacao Upsert existem justamente para resolver isso de forma nativa, sem gambiarra de lookup manual.

**O que e uma alternate key e por que ela muda o jogo**

O GUID (identificador primario) de uma linha do Dataverse so faz sentido dentro do Dataverse. O sistema externo — ERP, e-commerce, legado SQL — nao conhece esse GUID; ele conhece o proprio codigo de negocio: numero de pedido, CPF/CNPJ, SKU, matricula. A alternate key permite declarar que uma ou mais colunas formam uma chave unica alternativa para aquela tabela. A partir dai, voce consegue referenciar uma linha pela chave de negocio (`accounts(cnpj='12345678000190')`) em vez de precisar do GUID.

Por tras, o Dataverse cria um indice unico no SQL Server que sustenta a chave. Duas consequencias praticas:

* A unicidade passa a ser garantida pelo banco, nao pela sua logica de fluxo. Duas tentativas simultaneas de criar o mesmo CNPJ nao geram dois registros — a segunda falha com violacao de chave.
* Buscas por essa chave ficam rapidas, porque batem no indice em vez de fazer scan.

Uma alternate key pode ser composta (ate cinco colunas) e aceita lookup, texto, numero, decimal, data e option set como componentes. O que ela **nao** aceita bem sao colunas com valores nulos frequentes — a chave depende de todos os componentes estarem preenchidos.

**Upsert: create ou update em uma unica operacao**

Com a chave declarada, a operacao Upsert faz o roteamento automatico: se existe uma linha com aquela chave, ela e atualizada; se nao existe, e criada. Isso e o que torna a integracao idempotente — reprocessar a mesma mensagem duas vezes leva ao mesmo estado final, sem duplicar e sem estourar erro de "ja existe".

No SDK, o `UpsertRequest` recebe a entidade com a chave preenchida (`new Entity("account", keyAttributeCollection)`) e resolve tudo em um round-trip. Na Web API, um `PATCH` para `/accounts(cnpj='...')` faz o mesmo: cria se nao existe, atualiza se existe. No Power Automate, a acao **Upsert a row** do connector do Dataverse expoe esse comportamento usando a alternate key como identificador da linha.

Comparado ao padrao ingenuo de "Get, testar se veio vazio, senao Create", o Upsert elimina:

1. Uma chamada de rede (o Get separado).
2. A janela de corrida entre o Get e o Create, onde dois processos podem ambos concluir que a linha nao existe.

**Referenciar relacionamentos sem carregar o GUID**

Um ganho que passa despercebido: alternate keys tambem servem para preencher lookups na hora de gravar. Se voce esta importando pedidos e cada pedido aponta para uma conta pelo CNPJ, nao precisa primeiro buscar o GUID da conta para depois setar o lookup. Voce seta a referencia pela chave alternativa da conta diretamente (`"account@odata.bind": "/accounts(cnpj='...')"` na Web API, ou `EntityReference` com `KeyAttributes` no SDK). Isso reduz drasticamente o numero de chamadas em cargas com muitos relacionamentos.

**Cuidados de producao que costumam morder**

Alternate key nao e de graca em escala. Alguns pontos que aparecem quando o volume cresce:

* **Custo de escrita.** Cada indice unico adicional deixa os inserts e updates um pouco mais caros, porque o indice precisa ser mantido. Nao saia criando alternate key em toda tabela; use onde a integracao realmente precisa referenciar por chave de negocio.
* **Criacao assincrona do indice.** Ao adicionar uma alternate key numa tabela ja populada, o Dataverse cria o indice em background. Ate o status virar Active, a chave nao esta disponivel para uso — verifique o estado antes de disparar a carga.
* **Chave sobre lookup e concorrencia.** Alternate keys que incluem colunas lookup sao poderosas para modelar unicidade contextual (ex.: um item por pedido), mas herdam a fragilidade de nulos e exigem que o lookup ja esteja resolvido no momento da gravacao.
* **Normalizacao de dados.** Se o CNPJ chega ora com pontuacao, ora sem, a chave nao vai reconciliar os dois formatos — para ela sao valores diferentes. Padronize o valor antes de gravar; a chave nao normaliza por voce.
* **Colisao legitima.** Upsert atualiza a linha existente. Se a chave estiver mal escolhida (larga demais ou solta demais), voce pode sobrescrever silenciosamente dados de outro registro. Escolha a chave que realmente identifica a entidade de negocio, nao algo conveniente.

**Um roteiro pratico de decisao**

1. A tabela recebe dados de um sistema externo que tem seu proprio identificador estavel? Se sim, crie uma alternate key sobre esse identificador.
2. O identificador externo e imutavel? Alternate key sobre um campo que muda quebra a reconciliacao — prefira algo que nunca muda no sistema de origem.
3. Vai referenciar relacionamentos na carga? Aproveite as alternate keys das tabelas relacionadas para bindar lookups sem GUID.
4. Substitua os padroes de Get+Create por Upsert e ganhe idempotencia de graca.
5. Meça o impacto de escrita se a tabela for de alto volume; remova alternate keys que nao servem a nenhuma integracao.

Integracoes idempotentes sao a diferenca entre um pipeline que voce pode reexecutar com tranquilidade e um que exige um mutirao de limpeza de duplicatas toda vez que algo falha no meio. Na Dynamic Soluções, tratamos alternate keys e Upsert como parte do desenho de qualquer integracao critica com o Dataverse — junto com tratamento de erros, ALM em solucao gerenciada e governanca. Se sua empresa esta integrando o Dataverse com sistemas externos e sofrendo com duplicidade ou reprocessamento fragil, vale estruturar isso desde o design.



Every integration that writes to Dataverse from an external system sooner or later hits the same question: does this record already exist? Without a reliable answer, the flow falls into one of two extremes — it duplicates data on every reprocess, or it keeps doing a Get before each Create just to check. Alternate keys and the Upsert operation exist precisely to solve this natively, without a manual lookup workaround.

**What an alternate key is and why it changes the game**

The GUID (primary identifier) of a Dataverse row only makes sense inside Dataverse. The external system — ERP, e-commerce, legacy SQL — doesn't know that GUID; it knows its own business code: order number, tax ID, SKU, employee number. An alternate key lets you declare that one or more columns form an alternate unique key for that table. From then on, you can reference a row by its business key (`accounts(cnpj='12345678000190')`) instead of needing the GUID.

Under the hood, Dataverse creates a unique index in SQL Server backing the key. Two practical consequences:

* Uniqueness is now guaranteed by the database, not by your flow logic. Two simultaneous attempts to create the same tax ID won't produce two records — the second fails with a key violation.
* Lookups by that key are fast, because they hit the index instead of scanning.

An alternate key can be composite (up to five columns) and accepts lookup, text, number, decimal, date, and option set as components. What it does **not** handle well are columns with frequent null values — the key depends on all components being filled.

**Upsert: create or update in a single operation**

With the key declared, the Upsert operation routes automatically: if a row with that key exists, it's updated; if not, it's created. This is what makes the integration idempotent — reprocessing the same message twice leads to the same final state, without duplicating and without throwing an "already exists" error.

In the SDK, `UpsertRequest` takes the entity with the key filled in (`new Entity("account", keyAttributeCollection)`) and resolves everything in one round-trip. In the Web API, a `PATCH` to `/accounts(cnpj='...')` does the same: creates if missing, updates if present. In Power Automate, the Dataverse connector's **Upsert a row** action exposes this behavior using the alternate key as the row identifier.

Compared with the naive "Get, test if empty, otherwise Create" pattern, Upsert eliminates:

1. A network call (the separate Get).
2. The race window between the Get and the Create, where two processes might both conclude the row doesn't exist.

**Referencing relationships without loading the GUID**

An often-overlooked win: alternate keys also help set lookups when writing. If you're importing orders and each one points to an account by tax ID, you don't need to first fetch the account's GUID to then set the lookup. You set the reference by the account's alternate key directly (`"account@odata.bind": "/accounts(cnpj='...')"` in the Web API, or `EntityReference` with `KeyAttributes` in the SDK). This drastically reduces the number of calls in loads with many relationships.

**Production caveats that tend to bite**

Alternate keys aren't free at scale. Some points that show up as volume grows:

* **Write cost.** Each additional unique index makes inserts and updates slightly more expensive, because the index has to be maintained. Don't create alternate keys on every table; use them where the integration genuinely needs to reference by business key.
* **Asynchronous index creation.** When you add an alternate key to an already-populated table, Dataverse builds the index in the background. Until the status turns Active, the key isn't available — check the state before firing the load.
* **Keys over lookups and concurrency.** Alternate keys that include lookup columns are powerful for modeling contextual uniqueness (e.g., one line item per order), but they inherit the null fragility and require the lookup to already be resolved at write time.
* **Data normalization.** If the tax ID sometimes arrives with punctuation and sometimes without, the key won't reconcile the two formats — to it they're different values. Standardize the value before writing; the key won't normalize for you.
* **Legitimate collision.** Upsert updates the existing row. If the key is poorly chosen (too broad or too loose), you may silently overwrite another record's data. Choose the key that truly identifies the business entity, not something convenient.

**A practical decision path**

1. Does the table receive data from an external system that has its own stable identifier? If so, create an alternate key on that identifier.
2. Is the external identifier immutable? An alternate key over a changing field breaks reconciliation — prefer something that never changes in the source system.
3. Will you reference relationships in the load? Leverage the related tables' alternate keys to bind lookups without a GUID.
4. Replace the Get+Create patterns with Upsert and get idempotency for free.
5. Measure the write impact if the table is high-volume; remove alternate keys that serve no integration.

Idempotent integrations are the difference between a pipeline you can rerun with confidence and one that requires a duplicate-cleanup effort every time something fails mid-way. At Dynamic Soluções, we treat alternate keys and Upsert as part of the design of any critical Dataverse integration — alongside error handling, ALM in a managed solution, and governance. If your company is integrating Dataverse with external systems and suffering from duplication or fragile reprocessing, it's worth structuring this from the design stage.
