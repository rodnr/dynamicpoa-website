---
title: "Power BI DirectQuery vs Import: escolha o storage mode certo"
description: "Import, DirectQuery, Dual e modelos compostos no Power BI: entenda quando cada storage mode faz sentido, o impacto em performance, custo e frescor dos dados."
date: '2026-07-26 14:27:43'
---
Uma das decisões de arquitetura mais consequentes em um projeto de Power BI acontece antes de qualquer medida DAX: a escolha do **storage mode** de cada tabela. É uma decisão que define performance de consulta, frescor dos dados, consumo de capacidade e até quais recursos de modelagem você poderá usar. Errar aqui costuma custar caro — e refazer um modelo em produção com milhões de linhas nunca é trivial.

Este post é para quem já opera Power BI em escala e precisa decidir entre **Import**, **DirectQuery**, **Dual** e **modelos compostos** com critério, não por hábito.

**Import: o padrão de alta performance**

No modo Import, os dados são copiados e comprimidos no motor **VertiPaq** (a engine colunar em memória do Power BI). Toda consulta roda em memória, o que entrega a melhor performance possível e libera 100% da linguagem DAX, incluindo funções de time intelligence e cálculos complexos sem restrições.

A contrapartida é que os dados são um retrato do momento do último refresh. Isso implica:

* Necessidade de agendar refresh (até 8x/dia no Pro, 48x/dia em capacidade Premium/Fabric).
* Consumo de memória proporcional ao volume — o dataset precisa caber na capacidade.
* Latência entre a fonte e o relatório igual ao intervalo de refresh.

Para a grande maioria dos cenários de BI analítico — dashboards executivos, análises históricas, dados que mudam algumas vezes ao dia — Import é a escolha certa e deveria ser o default.

**DirectQuery: dados em tempo (quase) real, ao custo de performance**

Em DirectQuery, nada é armazenado no VertiPaq. Cada interação do usuário gera consultas SQL enviadas à fonte de dados em tempo de execução. Isso garante dados sempre atuais e permite trabalhar com volumes que jamais caberiam em memória.

O preço é alto e frequentemente subestimado:

* **Performance depende inteiramente da fonte.** Um data warehouse mal indexado transforma cada clique em um relatório lento.
* **Restrições de DAX.** Várias funções não são suportadas ou geram SQL ineficiente; time intelligence complexa vira um problema.
* **Limite de linhas por consulta** (1 milhão por padrão) e carga constante na fonte, que precisa suportar a concorrência de vários usuários.

DirectQuery faz sentido quando o requisito de frescor é genuíno (dados operacionais que mudam a cada minuto), quando o volume é grande demais para Import, ou quando políticas de governança exigem que os dados não saiam da fonte.

**Dual e modelos compostos: o melhor dos dois mundos**

O storage mode **Dual** permite que uma tabela funcione como Import ou DirectQuery dependendo do contexto da consulta. Tabelas de dimensão pequenas em Dual são o alicerce de um **modelo composto** eficiente: elas ficam em memória para relacionamentos rápidos, mas conseguem ser "empurradas" para a fonte quando uma tabela fato em DirectQuery é consultada, evitando joins caros entre motores diferentes.

O padrão de arquitetura mais poderoso combina isso com **aggregations**: você mantém a tabela fato detalhada em DirectQuery (bilhões de linhas na fonte) e cria tabelas de agregação em Import que respondem às consultas de granularidade mais alta em memória. O Power BI redireciona automaticamente a consulta para a agregação quando possível, caindo para DirectQuery só quando o usuário precisa do detalhe. Na prática, isso entrega performance de Import para 95% das interações com a escala do DirectQuery para o resto.

**Direct Lake no Fabric muda a equação**

Se você já opera em Microsoft Fabric, existe uma quarta opção que vem redefinindo esse trade-off: o **Direct Lake**. Ele lê arquivos Parquet do OneLake diretamente, sem cópia (como Import) e sem consultar um banco em tempo de execução (como DirectQuery). O resultado combina performance próxima de Import com frescor próximo de DirectQuery, desde que os dados estejam no formato Delta/Parquet do Lakehouse. Não é solução para toda fonte, mas para arquiteturas Fabric ele frequentemente torna o dilema Import vs DirectQuery obsoleto.

**Um roteiro de decisão**

1. O volume cabe em memória e a latência do refresh é aceitável? Use **Import**.
2. Precisa de dados em tempo real ou o volume é grande demais? Avalie **DirectQuery** — mas otimize a fonte primeiro.
3. Tem fato grande em DirectQuery com dimensões pequenas? Coloque as dimensões em **Dual** e monte um **modelo composto**.
4. Consultas majoritariamente em alta granularidade? Adicione **aggregations** em Import sobre o fato em DirectQuery.
5. Já está no Fabric com dados no Lakehouse? Considere **Direct Lake** antes de tudo.

A escolha do storage mode não é uma configuração técnica isolada — é uma decisão de arquitetura que reflete os requisitos reais de frescor, volume e custo do negócio. Na Dynamic Soluções, ajudamos empresas a desenhar modelos Power BI que equilibram esses fatores desde o início, evitando o retrabalho caro de migrar um modelo mal dimensionado em produção. Se sua organização depende de relatórios críticos e quer garantir performance com governança de dados, nossos especialistas podem apoiar essa decisão.



One of the most consequential architecture decisions in a Power BI project happens before you write a single DAX measure: choosing the **storage mode** for each table. It defines query performance, data freshness, capacity consumption, and even which modeling features you can use. Getting it wrong is expensive — and reworking a production model with millions of rows is never trivial.

This post is for teams already running Power BI at scale who need to decide between **Import**, **DirectQuery**, **Dual**, and **composite models** with real criteria rather than habit.

**Import: the high-performance default**

In Import mode, data is copied and compressed into the **VertiPaq** engine (Power BI's in-memory columnar engine). Every query runs in memory, delivering the best possible performance and unlocking the full DAX language, including time intelligence and complex calculations with no restrictions.

The trade-off is that data is a snapshot from the last refresh. That implies:

* You must schedule refreshes (up to 8x/day on Pro, 48x/day on Premium/Fabric capacity).
* Memory consumption scales with volume — the dataset has to fit in the capacity.
* Latency between source and report equals the refresh interval.

For the vast majority of analytical BI scenarios — executive dashboards, historical analysis, data that changes a few times a day — Import is the right choice and should be the default.

**DirectQuery: (near) real-time data at a performance cost**

With DirectQuery, nothing is stored in VertiPaq. Every user interaction generates SQL queries sent to the source at runtime. This guarantees always-current data and lets you work with volumes that would never fit in memory.

The price is high and often underestimated:

* **Performance depends entirely on the source.** A poorly indexed data warehouse turns every click into a slow report.
* **DAX restrictions.** Several functions aren't supported or generate inefficient SQL; complex time intelligence becomes a problem.
* **Row limit per query** (1 million by default) and constant load on the source, which must handle concurrency from many users.

DirectQuery makes sense when the freshness requirement is genuine (operational data changing every minute), when volume is too large for Import, or when governance policies require data to stay at the source.

**Dual and composite models: the best of both worlds**

The **Dual** storage mode lets a table act as Import or DirectQuery depending on the query context. Small dimension tables in Dual are the foundation of an efficient **composite model**: they stay in memory for fast relationships but can be "pushed" to the source when a DirectQuery fact table is queried, avoiding costly joins across different engines.

The most powerful architecture pattern combines this with **aggregations**: keep the detailed fact table in DirectQuery (billions of rows at the source) and create aggregation tables in Import that answer higher-granularity queries from memory. Power BI automatically redirects the query to the aggregation when possible, falling back to DirectQuery only when the user needs the detail. In practice, this delivers Import-level performance for 95% of interactions with DirectQuery scale for the rest.

**Direct Lake in Fabric changes the equation**

If you already run on Microsoft Fabric, there's a fourth option redefining this trade-off: **Direct Lake**. It reads Parquet files from OneLake directly — no copy (like Import) and no runtime database query (like DirectQuery). The result combines near-Import performance with near-DirectQuery freshness, as long as the data sits in the Lakehouse's Delta/Parquet format. It isn't a fit for every source, but for Fabric architectures it often makes the Import vs DirectQuery dilemma obsolete.

**A decision roadmap**

1. Does the volume fit in memory and is refresh latency acceptable? Use **Import**.
2. Need real-time data or is the volume too large? Consider **DirectQuery** — but optimize the source first.
3. Have a large DirectQuery fact with small dimensions? Set the dimensions to **Dual** and build a **composite model**.
4. Are queries mostly at high granularity? Add **aggregations** in Import over the DirectQuery fact.
5. Already on Fabric with data in the Lakehouse? Consider **Direct Lake** before anything else.

Storage mode isn't an isolated technical setting — it's an architecture decision that reflects the business's real requirements for freshness, volume, and cost. At Dynamic Soluções, we help companies design Power BI models that balance these factors from the start, avoiding the expensive rework of migrating a poorly sized production model. If your organization relies on critical reports and wants to ensure performance alongside data governance, our specialists can support that decision.
