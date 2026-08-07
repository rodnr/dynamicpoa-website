---
title: "Microsoft Fabric: entenda Lakehouse vs Warehouse na prática"
description: "Lakehouse ou Warehouse no Microsoft Fabric? Comparamos os dois motores de análise, quando usar cada um, custos de capacidade e integração com OneLake e Power BI."
date: '2026-07-16 15:00:14'
---
Quem começa a estruturar uma plataforma de dados no Microsoft Fabric esbarra rápido na primeira decisão de arquitetura: criar um **Lakehouse** ou um **Warehouse**? Os dois aparecem lado a lado na criação de itens do workspace, ambos armazenam dados em formato Delta sobre o OneLake e ambos podem alimentar relatórios do Power BI. A diferença está em como você escreve, transforma e consulta esses dados — e escolher errado significa retrabalho de pipeline e custo de capacidade desperdiçado.

**O que cada um realmente é**

O Lakehouse é a experiência centrada em arquivos e Spark. Ele expõe duas visões: a área de **Files** (dados brutos, não estruturados, em qualquer formato) e a área de **Tables** (tabelas Delta gerenciadas). Você transforma dados majoritariamente com notebooks PySpark/Spark SQL ou com Dataflows Gen2, e o SQL fica disponível em modo **somente leitura** através do SQL analytics endpoint.

O Warehouse é a experiência centrada em T-SQL transacional. Ele oferece um motor de data warehouse relacional completo, com suporte a `INSERT`, `UPDATE`, `DELETE`, transações multi-tabela e stored procedures — tudo em T-SQL, sem precisar escrever Spark. Por baixo, os dados também moram em Delta no OneLake, mas o ponto de entrada é o SQL de escrita.

**A regra prática de decisão**

* Escolha **Lakehouse** quando a ingestão vier de arquivos (CSV, JSON, Parquet), quando houver dados semiestruturados/não estruturados, quando o time domina Python/Spark ou quando você precisa de engenharia de dados em larga escala (medallion architecture com camadas bronze/silver/gold).
* Escolha **Warehouse** quando a carga for majoritariamente relacional, quando o time é de SQL (não de Spark), quando você precisa de escrita transacional com T-SQL puro e quando quer stored procedures e controle transacional multi-tabela.

Na prática, muitos projetos usam **os dois**: um Lakehouse como camada de engenharia (bronze/silver) e um Warehouse como camada de consumo/servindo (gold) para as áreas de negócio que consultam via T-SQL. Como tudo está no OneLake, o Warehouse consegue fazer cross-query contra tabelas do Lakehouse sem cópia física de dados.

**OneLake e o fim das cópias**

O ponto que muda o jogo em relação a arquiteturas anteriores é o **OneLake**: um único data lake lógico para todo o tenant. Tabelas Delta criadas no Lakehouse ou no Warehouse ficam acessíveis a outros itens via **shortcuts**, sem duplicação. Isso significa que um relatório de Power BI, um notebook Spark e uma consulta T-SQL podem apontar para o mesmo conjunto físico de arquivos Delta. Menos ETL de cópia, menos divergência entre versões da mesma tabela.

Para o Power BI, o desdobramento direto é o **Direct Lake**: um modo de conexão que lê os arquivos Delta do OneLake diretamente, sem importar (como o Import) e sem consultar linha a linha no runtime (como o DirectQuery). Você ganha performance próxima do Import com atualização quase em tempo real — desde que a tabela esteja em formato compatível e a capacidade suporte.

**Custo: tudo é capacidade**

Diferente do modelo antigo de Power BI Premium por SKU dedicado, o Fabric cobra por **Capacity Units (CU)** em SKUs `F` (F2, F4, F8... F2048). Toda operação — notebook Spark, consulta no Warehouse, refresh de Dataflow Gen2, render de Direct Lake — consome CU da mesma capacidade compartilhada. Dois pontos de atenção:

1. **Smoothing e throttling**: o Fabric suaviza picos ao longo do tempo, mas cargas pesadas concentradas podem gerar throttling se a SKU for subdimensionada. Monitore com o app **Fabric Capacity Metrics**.
2. **Pausar capacidade**: SKUs F podem ser pausadas (no Azure) fora do horário de uso, cortando custo — algo impossível no modelo de reserva anual do Premium P SKU. Isso muda a economia de ambientes de Dev/Test.

**Onde as equipes erram**

Os tropeços mais comuns que vemos em projetos de Fabric:

* Criar um Warehouse só porque "warehouse soa mais corporativo", quando toda a ingestão é de arquivos e o time nem usa T-SQL — resultando em pipelines Spark desnecessários.
* Ignorar a governança de workspace e deixar todo mundo escrevendo na mesma capacidade, sem separar Dev/Test/Prod, gerando throttling imprevisível.
* Tratar o Direct Lake como bala de prata sem validar o fallback para DirectQuery, que ocorre silenciosamente quando um limite é ultrapassado e degrada a performance percebida.
* Duplicar dados com cópias físicas quando um shortcut do OneLake resolveria.

**Fechando**

Lakehouse e Warehouse não são concorrentes — são ferramentas com pontos fortes diferentes dentro da mesma plataforma unificada. A decisão certa depende do perfil do time, da natureza dos dados e do padrão de consumo, e o dimensionamento correto de capacidade é o que separa um Fabric barato de um Fabric caro. Se sua empresa está avaliando ou já migrando para o Microsoft Fabric e quer estruturar uma arquitetura de dados sustentável — com governança de workspace, dimensionamento de capacidade e modelagem no Power BI —, a Dynamic Soluções pode ajudar tanto na consultoria quanto no licenciamento das SKUs F.



Anyone starting to structure a data platform on Microsoft Fabric quickly hits the first architecture decision: create a **Lakehouse** or a **Warehouse**? Both appear side by side when you add items to a workspace, both store data in Delta format on top of OneLake, and both can feed Power BI reports. The difference lies in how you write, transform, and query that data — and choosing wrong means pipeline rework and wasted capacity cost.

**What each one really is**

The Lakehouse is the file- and Spark-centric experience. It exposes two views: the **Files** area (raw, unstructured data in any format) and the **Tables** area (managed Delta tables). You transform data mostly with PySpark/Spark SQL notebooks or Dataflows Gen2, and SQL is available in **read-only** mode through the SQL analytics endpoint.

The Warehouse is the transactional T-SQL-centric experience. It offers a full relational data warehouse engine, with support for `INSERT`, `UPDATE`, `DELETE`, multi-table transactions, and stored procedures — all in T-SQL, no Spark required. Under the hood the data also lives as Delta on OneLake, but the entry point is write-capable SQL.

**The practical decision rule**

* Choose **Lakehouse** when ingestion comes from files (CSV, JSON, Parquet), when there is semi-structured/unstructured data, when the team is fluent in Python/Spark, or when you need large-scale data engineering (medallion architecture with bronze/silver/gold layers).
* Choose **Warehouse** when the workload is mostly relational, when the team is SQL-oriented (not Spark), when you need transactional writes in pure T-SQL, and when you want stored procedures and multi-table transactional control.

In practice, many projects use **both**: a Lakehouse as the engineering layer (bronze/silver) and a Warehouse as the consumption/serving layer (gold) for business areas that query via T-SQL. Since everything lives in OneLake, the Warehouse can cross-query against Lakehouse tables without physically copying data.

**OneLake and the end of copies**

The game-changer compared to previous architectures is **OneLake**: a single logical data lake for the entire tenant. Delta tables created in the Lakehouse or the Warehouse are accessible to other items via **shortcuts**, with no duplication. That means a Power BI report, a Spark notebook, and a T-SQL query can all point to the same physical set of Delta files. Less copy-based ETL, less divergence between versions of the same table.

For Power BI, the direct payoff is **Direct Lake**: a connection mode that reads the OneLake Delta files directly, without importing (like Import) and without querying row by row at runtime (like DirectQuery). You get near-Import performance with almost real-time refresh — provided the table is in a compatible format and the capacity can handle it.

**Cost: everything is capacity**

Unlike the old Power BI Premium dedicated-SKU model, Fabric charges by **Capacity Units (CU)** on `F` SKUs (F2, F4, F8... F2048). Every operation — Spark notebook, Warehouse query, Dataflow Gen2 refresh, Direct Lake render — consumes CU from the same shared capacity. Two things to watch:

1. **Smoothing and throttling**: Fabric smooths spikes over time, but heavy concentrated workloads can trigger throttling if the SKU is undersized. Monitor with the **Fabric Capacity Metrics** app.
2. **Pausing capacity**: F SKUs can be paused (in Azure) outside business hours, cutting cost — something impossible in the annual reservation model of the Premium P SKU. This changes the economics of Dev/Test environments.

**Where teams get it wrong**

The most common missteps we see in Fabric projects:

* Creating a Warehouse just because "warehouse sounds more corporate," when all ingestion is file-based and the team doesn't even use T-SQL — resulting in unnecessary Spark pipelines.
* Ignoring workspace governance and letting everyone write to the same capacity, without separating Dev/Test/Prod, causing unpredictable throttling.
* Treating Direct Lake as a silver bullet without validating the fallback to DirectQuery, which happens silently when a limit is exceeded and degrades perceived performance.
* Duplicating data with physical copies when a OneLake shortcut would solve it.

**Wrapping up**

Lakehouse and Warehouse are not competitors — they are tools with different strengths within the same unified platform. The right decision depends on the team profile, the nature of the data, and the consumption pattern, and correctly sizing capacity is what separates a cheap Fabric from an expensive one. If your company is evaluating or already migrating to Microsoft Fabric and wants to build a sustainable data architecture — with workspace governance, capacity sizing, and Power BI modeling — Dynamic Soluções can help both with consulting and with licensing the F SKUs.
