---
title: "Dataverse: quando usar virtual tables em vez de integração"
description: "Precisa expor dados externos no Dataverse sem duplicar registros? Entenda virtual tables, seus data providers, limitações e quando preferir sincronização real."
date: '2026-08-25 13:55:46'
---
Toda equipe que opera Power Apps model-driven em escala eventualmente enfrenta a mesma pergunta: como trazer dados que vivem em outro sistema (um ERP, um SQL corporativo, uma API SaaS) para dentro do Dataverse sem transformar isso em um pesadelo de sincronização? A resposta padrão costuma ser "replico com Power Automate ou com Azure Data Factory". Mas existe uma alternativa que muita gente esquece de considerar: **virtual tables** (antigas virtual entities). Elas expõem dados externos como se fossem tabelas nativas do Dataverse, sem copiar um único registro. O problema é que virtual tables não são bala de prata — elas resolvem um conjunto específico de cenários e sabotam vários outros. Este post é sobre onde a linha fica.

**O que é uma virtual table na prática**

Uma virtual table é uma definição de metadados no Dataverse que aponta para uma fonte de dados externa em tempo de execução. Quando um usuário abre uma view ou um formulário que consome essa tabela, o Dataverse chama um **data provider** que traduz a requisição (filtros, colunas, paginação) para a linguagem da fonte externa, busca os dados na hora e devolve para a interface. Nenhum registro é gravado no banco do Dataverse — os dados sempre vivem na origem.

Os providers disponíveis out-of-the-box hoje são:

* **OData v4** — para qualquer serviço que exponha um endpoint OData (inclusive outras instâncias Dataverse).
* **Connector-based virtual tables** — usando conectores da Power Platform, notavelmente **SQL Server** e **SharePoint**, criados direto pelo Maker Portal sem escrever código.
* **Custom data provider** — um plugin em C# que você registra para traduzir operações CRUD para uma API proprietária qualquer.

A grande promessa é: o usuário do model-driven app não percebe diferença. A virtual table aparece nas views, pode ser referenciada em relacionamentos, aparece em pesquisas — como se fosse uma tabela normal.

**Quando virtual table é a escolha certa**

Virtual tables brilham em cenários com um perfil bem definido:

1. **A fonte externa é a fonte da verdade e precisa continuar sendo.** Se o dado é dono por um ERP e a última coisa que você quer é uma cópia desatualizada convivendo no Dataverse, a virtual table elimina o problema de sincronização por construção — sempre lê o valor atual.
2. **Volume alto que não faz sentido replicar.** Milhões de registros históricos de um data warehouse que você só precisa exibir sob demanda: replicar isso consome storage caro do Dataverse sem retorno.
3. **Necessidade de leitura contextual, não de processamento em massa.** O usuário abre um cliente, vê os pedidos vindos do sistema externo naquele instante. Consulta pontual, filtrada, com poucos registros na tela.
4. **Requisitos de compliance que proíbem cópia.** Alguns dados não podem ser duplicados em outra base por política de governança — virtual tables mantêm o dado na origem.

**Onde virtual tables quebram**

Aqui está o que raramente aparece na demo e derruba projetos em produção:

* **Não há Power Automate trigger sobre virtual tables.** Como não existe gravação no Dataverse, não há evento "quando um registro é criado/atualizado". Se sua automação depende de reagir a mudanças, virtual table não serve.
* **Rollup e calculated columns não funcionam** sobre virtual tables, e agregações do lado Dataverse ficam limitadas — a computação teria que acontecer na fonte.
* **Performance é refém da fonte externa e do provider.** Cada abertura de view é uma chamada em tempo real. Se a API externa é lenta ou não suporta bem `$filter`/`$top`/paginação OData, a experiência degrada rápido e você não tem VertiPaq nem índice do Dataverse para salvar.
* **Delegação e filtros complexos** nem sempre são traduzidos: o provider precisa suportar a operação. Um filtro que o OData da origem não entende volta como erro ou traz dados demais.
* **Escrita (create/update/delete) é opcional e depende do provider.** O provider OData padrão e o de SQL suportam escrita em muitos casos, mas custom providers exigem que você implemente cada operação — e transações distribuídas entre Dataverse e sistema externo são um problema que virtual tables não resolvem.
* **Nada de offline, nem de busca global unificada robusta**, e integrações com Power BI via Dataverse ficam limitadas.

**O roteiro de decisão**

Uma forma prática de decidir:

* Precisa **reagir a mudanças** (flows, plugins, notificações)? → Não use virtual table pura. Replique ou use webhook da origem + Dataverse real.
* Precisa de **rollups, cálculos, RLS complexa, relatórios pesados** sobre esse dado? → Sincronize para tabela real (Data Factory, Dataverse connector, Synapse Link ao contrário).
* Precisa apenas **exibir dados atuais, sob demanda, dentro do app**, com a origem sendo dona? → Virtual table é provavelmente a melhor opção, desde que a fonte suporte filtro e paginação decentes.
* Volume enorme só para consulta pontual + proibição de cópia? → Virtual table quase certamente.

Um padrão híbrido comum: usar virtual table para leitura contextual de dados vivos e, em paralelo, replicar apenas os poucos campos que precisam de automação/agregação para uma tabela real. Você paga o custo de sincronização só do que realmente precisa reagir.

**Fechamento**

Virtual tables são uma ferramenta de arquitetura de integração, não um atalho universal. A decisão errada aparece meses depois, quando alguém pede "um alerta quando o pedido mudar" e descobre que a tabela escolhida nunca dispara eventos. Se sua empresa está desenhando a camada de dados de um projeto Power Platform que integra ERP, SQL corporativo ou APIs SaaS, vale envolver quem já viu esses trade-offs em produção. A Dynamic Soluções ajuda a definir a arquitetura de integração do Dataverse — virtual tables, sincronização ou modelos híbridos — junto com governança e ALM, tanto em consultoria quanto pelos planos de suporte contínuo.



Every team running model-driven Power Apps at scale eventually hits the same question: how do you bring data that lives in another system (an ERP, a corporate SQL database, a SaaS API) into Dataverse without turning it into a synchronization nightmare? The default answer is usually "I'll replicate it with Power Automate or Azure Data Factory." But there's an alternative many people forget to consider: **virtual tables** (formerly virtual entities). They expose external data as if it were native Dataverse tables, without copying a single record. The catch is that virtual tables are no silver bullet — they solve a specific set of scenarios and sabotage several others. This post is about where that line sits.

**What a virtual table actually is**

A virtual table is a metadata definition in Dataverse that points to an external data source at runtime. When a user opens a view or a form that consumes that table, Dataverse calls a **data provider** that translates the request (filters, columns, paging) into the external source's language, fetches the data on the fly, and returns it to the interface. No record is written to the Dataverse database — the data always lives at the source.

The providers available out-of-the-box today are:

* **OData v4** — for any service exposing an OData endpoint (including other Dataverse instances).
* **Connector-based virtual tables** — using Power Platform connectors, notably **SQL Server** and **SharePoint**, created straight from the Maker Portal with no code.
* **Custom data provider** — a C# plugin you register to translate CRUD operations to any proprietary API.

The big promise is that the model-driven app user notices no difference. The virtual table shows up in views, can be referenced in relationships, appears in lookups — as if it were a normal table.

**When a virtual table is the right choice**

Virtual tables shine in scenarios with a well-defined profile:

1. **The external source is the source of truth and must stay that way.** If the data is owned by an ERP and the last thing you want is a stale copy living inside Dataverse, virtual tables eliminate the sync problem by design — they always read the current value.
2. **High volume that makes no sense to replicate.** Millions of historical records from a data warehouse that you only need to display on demand: replicating that consumes expensive Dataverse storage with no payoff.
3. **Contextual read needs, not mass processing.** The user opens a customer and sees orders coming from the external system in that instant. A pointed, filtered query with few records on screen.
4. **Compliance requirements that forbid copying.** Some data cannot be duplicated to another store by governance policy — virtual tables keep it at the origin.

**Where virtual tables break**

Here's what rarely shows up in the demo and takes projects down in production:

* **There is no Power Automate trigger over virtual tables.** Since nothing is written to Dataverse, there's no "when a record is created/updated" event. If your automation depends on reacting to changes, virtual tables won't work.
* **Rollup and calculated columns don't work** over virtual tables, and Dataverse-side aggregations are limited — computation would have to happen at the source.
* **Performance is hostage to the external source and the provider.** Every view open is a real-time call. If the external API is slow or doesn't handle `$filter`/`$top`/OData paging well, the experience degrades fast, and there's no VertiPaq or Dataverse index to save you.
* **Delegation and complex filters** aren't always translated: the provider must support the operation. A filter the source OData doesn't understand comes back as an error or pulls too much data.
* **Write (create/update/delete) is optional and provider-dependent.** The default OData and SQL providers support writes in many cases, but custom providers require you to implement each operation — and distributed transactions between Dataverse and an external system are a problem virtual tables don't solve.
* **No offline, no robust unified global search**, and Power BI integration via Dataverse is constrained.

**The decision path**

A practical way to decide:

* Need to **react to changes** (flows, plugins, notifications)? → Don't use a pure virtual table. Replicate, or use a source webhook + real Dataverse.
* Need **rollups, calculations, complex RLS, heavy reporting** over this data? → Sync to a real table (Data Factory, Dataverse connector, reverse Synapse Link).
* Just need to **display current data, on demand, inside the app**, with the source owning it? → A virtual table is probably the best option, as long as the source supports decent filtering and paging.
* Huge volume for pointed queries only + copying is forbidden? → Virtual table almost certainly.

A common hybrid pattern: use a virtual table for contextual reads of live data and, in parallel, replicate only the few fields that need automation/aggregation into a real table. You pay the sync cost only for what actually needs to react.

**Closing**

Virtual tables are an integration-architecture tool, not a universal shortcut. The wrong decision surfaces months later, when someone asks for "an alert when the order changes" and finds out the chosen table never fires events. If your company is designing the data layer of a Power Platform project that integrates an ERP, corporate SQL, or SaaS APIs, it's worth involving people who've seen these trade-offs in production. Dynamic Soluções helps define the Dataverse integration architecture — virtual tables, synchronization, or hybrid models — along with governance and ALM, both through consulting and through ongoing support plans.
