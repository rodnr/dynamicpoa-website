---
title: "Power BI: reduza tamanho do modelo com otimização de VertiPaq"
description: "Modelos Power BI grandes e lentos raramente são culpa do volume de dados. Veja como cardinalidade, tipos de coluna e granularidade impactam o VertiPaq e como reduzir tamanho."
date: '2026-08-07 16:12:51'
---
Quando um modelo Power BI passa a demorar para atualizar, consumir memória demais e travar visuais, o instinto costuma ser culpar o volume de linhas. Mas na prática o que quase sempre explica um modelo inchado não é a quantidade de dados — é como o VertiPaq comprime (ou não consegue comprimir) suas colunas. Entender esse motor é o que separa um modelo de 800 MB de um de 90 MB carregando exatamente os mesmos fatos.

**Como o VertiPaq realmente armazena os dados**

O VertiPaq é um engine colunar in-memory. Diferente de um banco relacional que armazena linha a linha, ele armazena coluna a coluna e aplica compressão em cima de cada coluna isoladamente. Três técnicas dominam:

* **Value encoding** — usado em colunas numéricas, armazena os valores como offsets matemáticos de um valor base. Barato e rápido.
* **Dictionary encoding** — cria um dicionário de valores distintos e substitui cada célula por um índice inteiro para esse dicionário. É aqui que a cardinalidade pesa.
* **RLE (Run-Length Encoding)** — comprime sequências repetidas de um mesmo valor em pares (valor, quantidade). Extremamente eficiente quando a coluna está ordenada e tem baixa variação.

A consequência prática: o tamanho de uma coluna no modelo é governado principalmente pela sua **cardinalidade** (número de valores distintos) e pela **ordenação** dos dados, não pela contagem de linhas.

**Cardinalidade é o principal vilão**

Uma coluna com 50 valores distintos em 10 milhões de linhas comprime brutalmente bem. Uma coluna com 9 milhões de valores distintos (praticamente uma chave única) quase não comprime — o dicionário fica quase do tamanho da própria coluna.

Os suspeitos clássicos que estouram um modelo:

* **Colunas de datetime com hora, minuto e segundo.** Um único campo `DataHora` com precisão de segundo pode ter dezenas de milhões de valores distintos. Separe em uma coluna de **data** (baixa cardinalidade) e outra de **hora** (86.400 valores no máximo). Só isso derruba o tamanho do modelo drasticamente.
* **Chaves técnicas e GUIDs** trazidos por engano para o modelo. Se a coluna não é usada em relacionamento, medida ou visual, ela não deveria estar lá.
* **Colunas de texto livre** (observações, descrições longas). Se você não filtra nem exibe, remova.

**Reduza a granularidade antes de importar**

O ganho mais consistente vem de não trazer o que você não vai usar. Se o relatório analisa vendas por dia, não importe a tabela fato no grão de transação por segundo — agregue no Dataflow Gen2 ou na fonte. Uma tabela fato agregada a dia/produto/loja pode ter 5% das linhas da tabela transacional e responder exatamente às mesmas perguntas de negócio.

Algumas decisões que sempre valem revisão:

1. **Remova colunas, não apenas linhas.** No engine colunar, remover uma coluna de alta cardinalidade economiza mais memória do que filtrar milhões de linhas.
2. **Ajuste tipos de dados.** Um decimal com precisão desnecessária (muitas casas) explode a cardinalidade. Se você precisa de 2 casas, use *Fixed Decimal Number*, não *Decimal Number* de ponto flutuante.
3. **Desative Auto Date/Time.** O Power BI cria uma tabela de datas oculta para cada coluna de data do modelo. Em modelos com muitas datas isso adiciona MBs invisíveis. Use uma única tabela de calendário própria.

**Star schema não é só teoria — é compressão**

Modelar em star schema (tabelas fato finas + tabelas dimensão) não é apenas boa prática de DAX; é o que permite ao VertiPaq comprimir melhor. Tabelas fato com poucas colunas e chaves inteiras de baixa cardinalidade (surrogate keys) comprimem muito melhor do que tabelas largas e desnormalizadas cheias de texto repetido. Evite o padrão de "uma tabela grande com tudo" — ele infla o dicionário de cada coluna.

**Meça em vez de adivinhar**

Não otimize no escuro. A ferramenta **DAX Studio** (com a função VertiPaq Analyzer) mostra, por coluna, quanto de memória ela consome, sua cardinalidade e o tipo de encoding aplicado. Em minutos você identifica as duas ou três colunas que respondem por 70% do tamanho do modelo — normalmente uma coluna de datetime e uma chave técnica esquecida. Otimize essas primeiro e ignore o resto.

Em ambientes Power BI Premium / Fabric essa disciplina tem impacto direto no custo: modelos menores consomem menos memória na Capacity, atualizam mais rápido e reduzem o risco de refresh falhar por falta de recursos. Direct Lake, no Fabric, muda parte dessa dinâmica ao ler direto do OneLake, mas os mesmos princípios de granularidade e cardinalidade continuam ditando a performance de consulta.

Se a sua empresa opera modelos analíticos críticos e enfrenta refreshes lentos, estouro de memória na Capacity ou dashboards que travam, a Dynamic Soluções pode revisar a arquitetura do seu modelo, aplicar boas práticas de VertiPaq e otimizar o custo de licenciamento Power BI. Fale com a gente sobre consultoria de dados.



When a Power BI model starts taking forever to refresh, eating up memory and freezing visuals, the instinct is usually to blame the row count. In practice, though, what almost always explains a bloated model isn't the amount of data — it's how VertiPaq compresses (or fails to compress) your columns. Understanding this engine is what separates an 800 MB model from a 90 MB one carrying exactly the same facts.

**How VertiPaq actually stores data**

VertiPaq is an in-memory columnar engine. Unlike a relational database that stores data row by row, it stores it column by column and applies compression to each column in isolation. Three techniques dominate:

* **Value encoding** — used for numeric columns, stores values as mathematical offsets from a base value. Cheap and fast.
* **Dictionary encoding** — builds a dictionary of distinct values and replaces each cell with an integer index into that dictionary. This is where cardinality bites.
* **RLE (Run-Length Encoding)** — compresses repeated sequences of the same value into (value, count) pairs. Extremely efficient when the column is sorted and has low variation.

The practical consequence: a column's size in the model is driven mainly by its **cardinality** (number of distinct values) and by data **ordering**, not by the row count.

**Cardinality is the main villain**

A column with 50 distinct values across 10 million rows compresses brutally well. A column with 9 million distinct values (basically a unique key) barely compresses — the dictionary ends up nearly the size of the column itself.

The classic suspects that blow up a model:

* **Datetime columns with hour, minute and second.** A single `DateTime` field with second-level precision can have tens of millions of distinct values. Split it into a **date** column (low cardinality) and a **time** column (86,400 values max). That alone drops the model size dramatically.
* **Technical keys and GUIDs** dragged into the model by mistake. If the column isn't used in a relationship, measure or visual, it shouldn't be there.
* **Free-text columns** (notes, long descriptions). If you don't filter or display them, remove them.

**Reduce granularity before importing**

The most consistent gain comes from not bringing in what you won't use. If the report analyzes sales by day, don't import the fact table at per-second transaction grain — aggregate it in Dataflow Gen2 or at the source. A fact table aggregated to day/product/store can have 5% of the rows of the transactional table and answer exactly the same business questions.

Some decisions always worth reviewing:

1. **Remove columns, not just rows.** In a columnar engine, dropping a high-cardinality column saves more memory than filtering millions of rows.
2. **Fix data types.** A decimal with unnecessary precision (too many places) explodes cardinality. If you need 2 decimal places, use *Fixed Decimal Number*, not floating-point *Decimal Number*.
3. **Disable Auto Date/Time.** Power BI creates a hidden date table for every date column in the model. In models with many dates this adds invisible MBs. Use a single proper calendar table.

**Star schema isn't just theory — it's compression**

Modeling in a star schema (thin fact tables + dimension tables) isn't just DAX best practice; it's what lets VertiPaq compress better. Fact tables with few columns and low-cardinality integer keys (surrogate keys) compress far better than wide, denormalized tables full of repeated text. Avoid the "one big table with everything" pattern — it inflates every column's dictionary.

**Measure instead of guessing**

Don't optimize in the dark. The **DAX Studio** tool (with the VertiPaq Analyzer function) shows, per column, how much memory it consumes, its cardinality and the encoding type applied. In minutes you identify the two or three columns responsible for 70% of the model size — usually a datetime column and a forgotten technical key. Optimize those first and ignore the rest.

In Power BI Premium / Fabric environments, this discipline has a direct impact on cost: smaller models consume less memory on the Capacity, refresh faster and reduce the risk of refreshes failing for lack of resources. Direct Lake, in Fabric, changes part of this dynamic by reading straight from OneLake, but the same principles of granularity and cardinality still dictate query performance.

If your company operates critical analytical models and struggles with slow refreshes, Capacity memory overruns or dashboards that freeze, Dynamic Soluções can review your model's architecture, apply VertiPaq best practices and optimize your Power BI licensing cost. Talk to us about data consulting.
