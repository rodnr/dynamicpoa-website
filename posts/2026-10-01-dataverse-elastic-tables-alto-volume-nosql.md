---
title: "Dataverse: elastic tables para alto volume de escrita e NoSQL"
description: "Elastic tables no Dataverse mudam o jogo para cargas de escrita intensa e dados semiestruturados. Veja quando usar, o que você perde e como integrar com o modelo relacional."
date: '2026-10-01 18:47:22'
---
Quando falamos em Dataverse, a imagem mental é quase sempre a de um banco relacional gerenciado: tabelas padrão, lookups, business rules, rollups. Mas há cenários em que esse modelo relacional, apoiado no Azure SQL por baixo, simplesmente não acompanha o ritmo — milhões de inserções por hora de telemetria, logs de IoT, eventos de aplicativos, dados de sessão. É exatamente para esses casos que existem as **elastic tables**, uma categoria de tabela do Dataverse apoiada no Azure Cosmos DB em vez do SQL tradicional. Entender quando elas fazem sentido (e, principalmente, quando não fazem) evita tanto gargalos de performance quanto decisões de arquitetura difíceis de reverter.

**O que muda por baixo do capô**

Uma tabela padrão (agora chamada de *standard table*) do Dataverse grava em um Azure SQL por trás, com todo o ferramental relacional que conhecemos. Uma elastic table grava em um container do Cosmos DB. Isso traz duas consequências diretas e imediatas:

* **Escrita horizontalmente escalável.** O Cosmos DB particiona os dados por uma *partition key* e escala praticamente sem o teto de throughput de uma tabela relacional. Cargas de ingestão massiva que derrubariam uma standard table (por contenção de locks, limites de API, tempo de resposta crescente) passam a ser absorvidas.
* **Esquema flexível.** Elastic tables suportam uma coluna especial de JSON, permitindo armazenar atributos semiestruturados que variam de registro para registro, sem ter que criar uma coluna física para cada propriedade possível.

Em troca, você abre mão de boa parte do que torna o Dataverse relacional confortável.

**O que você perde ao sair do relacional**

Este é o ponto que mais causa surpresa em projeto. Elastic tables não são "standard tables mais rápidas" — são um modelo de dados diferente. As limitações mais relevantes na prática:

* **Sem rollup e sem calculated columns** nos moldes tradicionais. Agregações precisam ser feitas na aplicação ou em pipelines de dados, não dentro da tabela.
* **Relacionamentos limitados.** Você não tem o leque completo de 1:N e N:N relacionais entre elastic tables e o resto do modelo. Lookups do jeito que você conhece não se aplicam da mesma forma.
* **Consultas dependem da partition key.** Query eficiente em Cosmos DB exige respeitar a chave de partição. Consultas *cross-partition* são possíveis, mas caras e lentas — o oposto do comportamento intuitivo de um `WHERE` em SQL.
* **Transações restritas a uma única partição.** O suporte transacional existe, mas no escopo de uma partition key, não através de várias tabelas como numa transação relacional.
* **Ferramentas tradicionais podem não funcionar como esperado** — plugins síncronos, algumas automações e relatórios assumem o modelo relacional.

**Modelar a partition key é a decisão mais importante**

No mundo relacional, a chave primária é um GUID e você quase nunca pensa nela. No Cosmos DB, a escolha da partition key define a escalabilidade e o custo de leitura do seu sistema. Uma boa partition key distribui a escrita uniformemente (evitando *hot partitions*) e, ao mesmo tempo, agrupa os dados que você consulta juntos na mesma partição.

Exemplos práticos: para logs de aplicação, `applicationId` ou `tenantId` costuma ser um bom candidato; para telemetria de dispositivos, `deviceId`. O erro clássico é usar algo de baixíssima cardinalidade (um status com três valores) ou algo que concentra toda a escrita recente numa única partição (uma data truncada por dia em carga sequencial). Essa modelagem precisa ser acertada **antes** de popular a tabela — mudar a partition key depois significa recriar e migrar.

**Quando usar — e quando não**

Um roteiro direto de decisão:

* **Use elastic table quando:** o volume de escrita é massivo e contínuo (telemetria, IoT, logs, eventos), os dados são semiestruturados ou têm esquema variável, as consultas são previsíveis e alinhadas a uma partition key clara, e você não precisa de agregações nativas nem de relacionamentos ricos dentro do Dataverse.
* **Fique na standard table quando:** você precisa de rollups, calculated columns, relacionamentos N:N, business rules, plugins síncronos transacionais ou integração natural com model-driven apps e Dynamics 365. Para a maioria das aplicações de negócio, a standard table continua sendo a escolha certa.

**O padrão híbrido que costuma funcionar**

Na prática, o melhor desenho raramente é "tudo elastic" ou "tudo standard". Um padrão recorrente em projetos de alto volume:

1. A carga bruta e massiva (eventos, telemetria) cai numa **elastic table**, absorvendo o pico de escrita sem contenção.
2. Um processo de agregação — Power Automate, Azure Functions ou um pipeline no Microsoft Fabric — consolida esses dados em métricas de negócio.
3. Os resultados consolidados, já de baixo volume e com relacionamentos, ficam em **standard tables**, onde participam de rollups, business rules e aparecem nos model-driven apps e no Power BI com todo o ferramental relacional.

Isso entrega o melhor dos dois mundos: elasticidade na ponta de ingestão e riqueza relacional na camada de consumo.

**Custo: não esqueça do Cosmos DB por trás**

Como elastic tables usam Cosmos DB, o modelo de capacidade e consumo (Request Units) está em jogo indiretamente. Em cenários de altíssimo volume, isso impacta o consumo de capacidade do ambiente Power Platform. Dimensionar partition key e padrões de consulta não é só questão de performance — é diretamente questão de custo. Consultas cross-partition mal planejadas inflam o consumo sem que o time perceba de imediato.

**Conclusão**

Elastic tables abrem o Dataverse para um território que antes exigia sair da plataforma: cargas de escrita massiva e dados semiestruturados, dentro do mesmo ambiente de segurança, API e governança do resto da Power Platform. Mas não são um substituto universal da tabela relacional — são uma ferramenta específica, com um modelo mental de NoSQL que precisa ser respeitado desde a modelagem da partition key. Se sua empresa está avaliando cenários de telemetria, IoT ou ingestão de eventos em escala sobre o Dataverse, a Dynamic Soluções pode ajudar a desenhar a arquitetura híbrida certa, validar a modelagem e evitar as decisões de difícil reversão — seja via consultoria pontual, nossos planos de suporte contínuo ou a plataforma self-service de Power Platform.



When we talk about Dataverse, the mental image is almost always that of a managed relational database: standard tables, lookups, business rules, rollups. But there are scenarios where this relational model, backed by Azure SQL underneath, simply can't keep up — millions of inserts per hour of telemetry, IoT logs, application events, session data. That's exactly what **elastic tables** are for: a Dataverse table category backed by Azure Cosmos DB instead of traditional SQL. Understanding when they make sense (and, above all, when they don't) avoids both performance bottlenecks and architecture decisions that are hard to reverse.

**What changes under the hood**

A standard Dataverse table writes to an Azure SQL backend, with all the relational tooling we know. An elastic table writes to a Cosmos DB container. This brings two direct, immediate consequences:

* **Horizontally scalable writes.** Cosmos DB partitions data by a *partition key* and scales with practically none of the throughput ceiling of a relational table. Massive ingestion loads that would bring a standard table to its knees (lock contention, API limits, growing response times) get absorbed.
* **Flexible schema.** Elastic tables support a special JSON column, allowing you to store semi-structured attributes that vary from record to record, without having to create a physical column for every possible property.

In exchange, you give up much of what makes relational Dataverse comfortable.

**What you lose by leaving the relational model**

This is the point that surprises people most in projects. Elastic tables aren't "faster standard tables" — they're a different data model. The limitations that matter most in practice:

* **No rollup and no calculated columns** in the traditional sense. Aggregations must be done in the application or in data pipelines, not inside the table.
* **Limited relationships.** You don't get the full range of relational 1:N and N:N between elastic tables and the rest of the model. Lookups as you know them don't apply the same way.
* **Queries depend on the partition key.** Efficient querying in Cosmos DB requires respecting the partition key. Cross-partition queries are possible, but expensive and slow — the opposite of the intuitive behavior of a SQL `WHERE`.
* **Transactions restricted to a single partition.** Transactional support exists, but scoped to one partition key, not across multiple tables as in a relational transaction.
* **Traditional tooling may not behave as expected** — synchronous plugins, some automations, and reports assume the relational model.

**Modeling the partition key is the most important decision**

In the relational world, the primary key is a GUID and you almost never think about it. In Cosmos DB, the partition key choice defines your system's scalability and read cost. A good partition key distributes writes evenly (avoiding *hot partitions*) while grouping the data you query together into the same partition.

Practical examples: for application logs, `applicationId` or `tenantId` is often a good candidate; for device telemetry, `deviceId`. The classic mistake is using something of very low cardinality (a status with three values) or something that concentrates all recent writes into a single partition (a date truncated by day under sequential load). This modeling must be right **before** populating the table — changing the partition key later means recreating and migrating.

**When to use — and when not to**

A direct decision guide:

* **Use an elastic table when:** the write volume is massive and continuous (telemetry, IoT, logs, events), the data is semi-structured or has a variable schema, queries are predictable and aligned to a clear partition key, and you don't need native aggregations or rich relationships inside Dataverse.
* **Stay with a standard table when:** you need rollups, calculated columns, N:N relationships, business rules, transactional synchronous plugins, or natural integration with model-driven apps and Dynamics 365. For most business applications, the standard table remains the right choice.

**The hybrid pattern that usually works**

In practice, the best design is rarely "all elastic" or "all standard." A recurring pattern in high-volume projects:

1. The raw, massive load (events, telemetry) lands in an **elastic table**, absorbing the write peak without contention.
2. An aggregation process — Power Automate, Azure Functions, or a Microsoft Fabric pipeline — consolidates that data into business metrics.
3. The consolidated results, now low-volume and with relationships, live in **standard tables**, where they participate in rollups, business rules, and show up in model-driven apps and Power BI with the full relational toolset.

This delivers the best of both worlds: elasticity at the ingestion edge and relational richness in the consumption layer.

**Cost: don't forget the Cosmos DB behind it**

Since elastic tables use Cosmos DB, the capacity and consumption model (Request Units) is indirectly in play. In very high-volume scenarios, this impacts the Power Platform environment's capacity consumption. Sizing the partition key and query patterns isn't just a performance matter — it's directly a cost matter. Poorly planned cross-partition queries inflate consumption without the team noticing immediately.

**Conclusion**

Elastic tables open Dataverse to territory that previously required leaving the platform: massive write loads and semi-structured data, within the same security, API, and governance environment as the rest of the Power Platform. But they're not a universal replacement for the relational table — they're a specific tool, with a NoSQL mental model that must be respected from the partition key modeling onward. If your company is evaluating telemetry, IoT, or event ingestion scenarios at scale on Dataverse, Dynamic Soluções can help design the right hybrid architecture, validate the modeling, and avoid hard-to-reverse decisions — whether through targeted consulting, our ongoing support plans, or the Power Platform self-service platform.
