---
title: "Dataflows Gen2 no Microsoft Fabric: ETL sem quebrar a Capacity"
description: "Como estruturar ingestão e transformação de dados com Dataflows Gen2 no Fabric sem estourar Capacity Units — staging, Fast Copy, destinos e custo real."
date: '2026-07-24 14:53:17'
---
Quem migrou pipelines de Power BI Dataflows (Gen1) para o Microsoft Fabric costuma descobrir cedo que os **Dataflows Gen2** não são só "a versão nova do mesmo componente". Eles mudam a mecânica de execução, o modelo de custo por Capacity Units (CU) e a forma como você conecta ingestão a destinos como Lakehouse, Warehouse e KQL Database. Entender essa mecânica é o que separa uma camada de ETL barata e previsível de uma que consome sua Capacity inteira em poucas atualizações.

**O que muda de Gen1 para Gen2**

No Dataflow Gen1, a transformação em Power Query gravava o resultado em um armazenamento interno do serviço Power BI (CDM folders), e o consumo era medido de forma opaca dentro do workspace Premium. No Gen2, a lógica é outra:

* A transformação continua sendo Power Query (mesma linguagem M), mas a execução roda sobre o motor de compute do Fabric e é cobrada em **Capacity Units** como qualquer outro item.
* Você define explicitamente um ou mais **data destinations** — Lakehouse, Warehouse, Azure SQL, KQL Database — em vez de depender de um armazenamento implícito.
* Existe uma camada de **staging** intermediária (um Lakehouse/Warehouse gerenciado pelo próprio dataflow) usada para materializar resultados antes de escrever no destino final.

Essa camada de staging é o principal ponto cego de quem vem do Gen1. Ela é ligada por padrão em cada query, e cada query com staging habilitado significa uma escrita adicional que consome CU e tempo de refresh.

**Staging: quando manter, quando desligar**

O staging existe para permitir *query folding* de operações que o motor consegue empurrar para o SQL do staging (joins, agregações pesadas entre queries). A regra prática:

1. **Mantenha staging habilitado** em queries que servem de base para outras (dimensões reutilizadas, tabelas grandes que sofrem join). Materializar essa base uma vez e reaproveitar é mais barato do que recalcular.
2. **Desligue staging** (botão direito na query → *Enable staging*) em queries simples e terminais que já escrevem direto no destino sem transformação pesada. Deixar staging ligado nesses casos duplica a escrita: uma no staging, outra no destino.
3. Nunca deixe o padrão sem revisar num dataflow com dezenas de queries — o custo silencioso mora aí.

**Fast Copy: ingestão em escala sem passar pelo motor M**

Para volumes grandes vindos de fontes como ADLS Gen2, bancos SQL ou arquivos CSV/Parquet, o Gen2 oferece o **Fast Copy**. Em vez de processar linha a linha pelo motor Power Query, ele usa o mesmo backend de cópia dos pipelines (Data Factory) para mover dados em bloco, com throughput muito maior e custo por CU proporcionalmente menor.

O Fast Copy só entra em ação quando a query respeita certas condições — fonte suportada, ausência de transformações que quebrem o folding no início do pipeline, volume acima de um limiar. Na prática, o padrão que funciona é: **ingerir bruto com Fast Copy, transformar depois**. Trazer os dados quase crus para um Lakehouse via Fast Copy e fazer as transformações pesadas em uma camada seguinte (outro dataflow, notebook Spark ou o próprio Warehouse) quase sempre sai mais barato do que uma query M cheia de passos que impede o Fast Copy de ativar.

**Escolhendo o destino certo**

O destino não é detalhe de configuração — ele define quem vai consumir o dado depois:

* **Lakehouse** — quando o consumo posterior é Spark, notebooks, ou você quer Direct Lake no Power BI. Formato Delta/Parquet, ótimo para volume.
* **Warehouse** — quando o consumo é T-SQL, com necessidade de transações e joins relacionais complexos a jusante.
* **Azure SQL / KQL** — integrações específicas com sistemas transacionais ou telemetria.

Um erro comum é gravar tudo em Warehouse por hábito de mundo SQL, quando o consumo real seria Direct Lake sobre Lakehouse — o que evita uma cópia extra e reduz latência no Power BI.

**Controlando o custo por Capacity Units**

No Fabric, tudo que roda consome CU da mesma Capacity (SKU F). Dataflows Gen2 concorrem com Power BI, notebooks e pipelines pela mesma bolsa de compute, e refreshes mal planejados geram *throttling* que afeta relatórios interativos. Recomendações:

* Agende refreshes de dataflows pesados **fora do horário de pico** de consumo de relatórios.
* Use o **Capacity Metrics App** para identificar quais dataflows são os maiores consumidores e onde há *smoothing* de burst empurrando custo para frente.
* Prefira **cargas incrementais** sempre que a fonte permitir, em vez de full refresh — Gen2 suporta incremental refresh como o Gen1, e ele derruba drasticamente o CU consumido.
* Divida dataflows monolíticos: um dataflow de ingestão (Fast Copy, staging off no final) e um de transformação (staging on nas bases) é mais fácil de monitorar e otimizar do que um único fluxo com trinta queries.

**Fechando o ciclo**

Dataflows Gen2 são poderosos justamente por unir a familiaridade do Power Query com o motor escalável do Fabric — mas essa mesma flexibilidade permite decisões que estouram a Capacity sem que ninguém perceba de imediato. Governança de staging, uso consciente de Fast Copy, escolha correta de destino e monitoramento por CU são o que mantêm a conta sob controle.

Se sua empresa está montando ou revisando a camada de dados no Microsoft Fabric e quer garantir que a arquitetura de ETL escale sem surpresas de licenciamento e Capacity, a Dynamic Soluções apoia desde o desenho do modelo até a otimização de custo — em projetos sob demanda, consultoria contínua ou pela nossa plataforma self-service de Power Platform.



Anyone who has migrated Power BI Dataflows (Gen1) pipelines to Microsoft Fabric usually finds out early that **Dataflows Gen2** are not just "the new version of the same component". They change the execution mechanics, the cost model per Capacity Units (CU), and the way you connect ingestion to destinations like Lakehouse, Warehouse, and KQL Database. Understanding this mechanic is what separates a cheap, predictable ETL layer from one that eats your entire Capacity in a handful of refreshes.

**What changes from Gen1 to Gen2**

In Dataflow Gen1, the Power Query transformation wrote its result into internal Power BI service storage (CDM folders), and consumption was measured opaquely inside the Premium workspace. In Gen2, the logic is different:

* Transformation is still Power Query (same M language), but execution runs on the Fabric compute engine and is billed in **Capacity Units** like any other item.
* You explicitly define one or more **data destinations** — Lakehouse, Warehouse, Azure SQL, KQL Database — instead of relying on implicit storage.
* There is an intermediate **staging** layer (a Lakehouse/Warehouse managed by the dataflow itself) used to materialize results before writing to the final destination.

This staging layer is the main blind spot for people coming from Gen1. It is on by default on each query, and every query with staging enabled means an additional write that consumes CU and refresh time.

**Staging: when to keep it, when to turn it off**

Staging exists to enable *query folding* for operations the engine can push down to the staging SQL (joins, heavy aggregations across queries). The practical rule:

1. **Keep staging enabled** on queries that serve as a base for others (reused dimensions, large tables that get joined). Materializing that base once and reusing it is cheaper than recomputing.
2. **Turn staging off** (right-click the query → *Enable staging*) on simple, terminal queries that already write straight to the destination without heavy transformation. Leaving staging on in these cases doubles the write: one to staging, one to the destination.
3. Never leave the default unreviewed in a dataflow with dozens of queries — that is where the silent cost lives.

**Fast Copy: ingesting at scale without going through the M engine**

For large volumes from sources like ADLS Gen2, SQL databases, or CSV/Parquet files, Gen2 offers **Fast Copy**. Instead of processing row by row through the Power Query engine, it uses the same copy backend as pipelines (Data Factory) to move data in bulk, with much higher throughput and proportionally lower CU cost.

Fast Copy only kicks in when the query meets certain conditions — supported source, no transformations that break folding at the start of the pipeline, volume above a threshold. In practice, the pattern that works is: **ingest raw with Fast Copy, transform later**. Bringing data in almost raw to a Lakehouse via Fast Copy and doing the heavy transformations in a later layer (another dataflow, Spark notebook, or the Warehouse itself) is almost always cheaper than an M query full of steps that prevents Fast Copy from activating.

**Choosing the right destination**

The destination is not a configuration detail — it defines who will consume the data afterward:

* **Lakehouse** — when downstream consumption is Spark, notebooks, or you want Direct Lake in Power BI. Delta/Parquet format, great for volume.
* **Warehouse** — when consumption is T-SQL, needing transactions and complex relational joins downstream.
* **Azure SQL / KQL** — specific integrations with transactional systems or telemetry.

A common mistake is writing everything to Warehouse out of SQL-world habit, when the real consumption would be Direct Lake over a Lakehouse — which avoids an extra copy and reduces Power BI latency.

**Controlling cost per Capacity Units**

In Fabric, everything that runs consumes CU from the same Capacity (F SKU). Gen2 Dataflows compete with Power BI, notebooks, and pipelines for the same compute pool, and poorly planned refreshes cause *throttling* that hits interactive reports. Recommendations:

* Schedule heavy dataflow refreshes **outside the peak hours** of report consumption.
* Use the **Capacity Metrics App** to identify which dataflows are the biggest consumers and where burst *smoothing* is pushing cost forward.
* Prefer **incremental loads** whenever the source allows, instead of full refresh — Gen2 supports incremental refresh like Gen1, and it drastically cuts CU consumed.
* Split monolithic dataflows: an ingestion dataflow (Fast Copy, staging off at the end) and a transformation one (staging on for base tables) is easier to monitor and optimize than a single flow with thirty queries.

**Closing the loop**

Gen2 Dataflows are powerful precisely because they combine the familiarity of Power Query with the scalable Fabric engine — but that same flexibility allows decisions that blow up your Capacity without anyone noticing immediately. Staging governance, deliberate Fast Copy usage, correct destination choice, and CU monitoring are what keep the bill under control.

If your company is building or reviewing its data layer in Microsoft Fabric and wants to make sure the ETL architecture scales without licensing and Capacity surprises, Dynamic Soluções supports everything from model design to cost optimization — through on-demand projects, ongoing consulting, or our self-service Power Platform platform.
