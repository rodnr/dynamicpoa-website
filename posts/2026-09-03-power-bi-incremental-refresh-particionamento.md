---
title: "Power BI: incremental refresh sem estourar a janela de atualização"
description: "Atualizações completas que demoram horas e falham por timeout têm solução: entenda como o incremental refresh particiona o modelo e mantém o dataset saudável."
date: '2026-09-03 17:00:25'
---
Quando um dataset do Power BI cresce de alguns milhões para dezenas ou centenas de milhões de linhas, o refresh completo deixa de ser sustentável. Cada atualização relê toda a fonte, reconstrói o modelo inteiro e consome memória proporcional ao volume total — até que a janela noturna estoura, o gateway atinge timeout, ou a Capacity satura. O **incremental refresh** resolve isso particionando a tabela e reprocessando só o que mudou. Mas ele exige uma configuração precisa para funcionar de fato, e mal implementado dá a ilusão de estar ligado sem trazer o benefício.

**O que o incremental refresh realmente faz**

Em vez de tratar a tabela como um bloco único, o Power BI a divide em partições por período (dia, mês, ano). A cada refresh, ele reprocessa apenas as partições dentro da janela de atualização recente e mantém as demais congeladas em disco. Um modelo com 5 anos de dados históricos passa a atualizar apenas os últimos 7 dias, por exemplo, reduzindo o processamento de 100 milhões de linhas para poucos milhões.

Dois parâmetros governam tudo: `RangeStart` e `RangeEnd`. São parâmetros do tipo Date/Time no Power Query que você usa para filtrar a tabela de fatos por uma coluna de data. O Power BI substitui os valores desses parâmetros em runtime para cada partição — você nunca os define manualmente em produção.

**Query folding não é opcional**

Este é o ponto que mais derruba implementações. Para que o incremental refresh funcione, o filtro de `RangeStart`/`RangeEnd` precisa ser traduzido em uma cláusula `WHERE` na consulta enviada à fonte (query folding). Se o folding quebra — por exemplo, porque você aplicou uma transformação em M que o conector não sabe traduzir para SQL —, o Power BI baixa a tabela inteira e filtra em memória. O resultado: você reprocessa tudo mesmo com o particionamento configurado, sem ganho algum.

Por isso:

* Aplique o filtro de data o mais cedo possível na query, antes de qualquer transformação complexa.
* Prefira fontes que suportam folding nativo (SQL Server, Azure SQL, Synapse, Fabric Warehouse) — arquivos CSV/Excel e muitos conectores web não fazem folding.
* Valide com "View Native Query" no Power Query: se a opção estiver disponível e o `WHERE` refletir o intervalo, o folding está preservado.

**Detect data changes e políticas avançadas**

O refresh incremental básico reprocessa toda a janela recente. Se, dentro dessa janela, a maioria das partições não muda, você ainda desperdiça ciclos. A opção **Detect data changes** aponta uma coluna (tipicamente `LastModified`) que o Power BI usa para verificar se a partição foi alterada desde o último refresh — reprocessando só as que realmente mudaram. Isso exige uma coluna confiável de auditoria na fonte.

Há também a opção de manter dados em tempo real na partição mais recente via DirectQuery (hybrid tables): o histórico fica em Import particionado, enquanto o dia corrente é consultado ao vivo. Útil quando o negócio precisa de latência baixa sem sacrificar a performance do histórico.

**Premium, XMLA e a primeira carga**

Alguns pontos operacionais que costumam surpreender:

* O primeiro refresh após publicar carrega todo o histórico de uma vez — pode ser lento e pesado. Em datasets muito grandes, vale carregar as partições incrementalmente via XMLA endpoint com ferramentas como Tabular Editor, em vez de deixar o serviço fazer a carga inicial completa.
* O particionamento é visível e gerenciável apenas em capacidades Premium/Fabric (Premium Per User, capacidades P ou F) através do XMLA endpoint. No Pro puro você configura a política, mas perde o controle fino.
* Alterar a estrutura da política depois de publicada pode forçar uma recarga completa. Planeje o desenho de arquivamento e período de atualização antes de subir para produção.

**Roteiro prático**

1. Crie os parâmetros `RangeStart` e `RangeEnd` (Date/Time) e filtre a tabela de fatos por eles.
2. Garanta que o folding sobrevive ao filtro — valide o native query.
3. Defina a política: quantos anos arquivar e qual a janela de atualização incremental.
4. Se houver coluna de auditoria confiável, ative Detect data changes.
5. Publique em capacidade Premium/Fabric e, para históricos grandes, faça a carga inicial via XMLA.
6. Monitore a duração do refresh e a memória — o ganho deve ser imediato e mensurável.

Refresh incremental é uma das otimizações de maior retorno em modelos corporativos: transforma atualizações de horas em minutos e elimina a maior causa de falha em datasets grandes. Se sua empresa opera modelos Power BI críticos e enfrenta janelas de atualização apertadas ou timeouts recorrentes, a Dynamic Soluções ajuda a desenhar a estratégia de particionamento, garantir o query folding ponta a ponta e estruturar a governança de refresh na sua capacidade.



When a Power BI dataset grows from a few million to tens or hundreds of millions of rows, full refresh stops being sustainable. Every update re-reads the entire source, rebuilds the whole model, and consumes memory proportional to the total volume — until the nightly window blows past, the gateway times out, or the Capacity saturates. **Incremental refresh** solves this by partitioning the table and reprocessing only what changed. But it requires precise configuration to actually work, and a poor implementation gives the illusion of being enabled without delivering the benefit.

**What incremental refresh really does**

Instead of treating the table as a single block, Power BI splits it into partitions by period (day, month, year). On each refresh, it reprocesses only the partitions within the recent refresh window and keeps the rest frozen on disk. A model with 5 years of history now updates only the last 7 days, for example, reducing processing from 100 million rows to just a few million.

Two parameters govern everything: `RangeStart` and `RangeEnd`. These are Date/Time parameters in Power Query that you use to filter the fact table by a date column. Power BI substitutes their values at runtime for each partition — you never set them manually in production.

**Query folding is not optional**

This is the point that sinks most implementations. For incremental refresh to work, the `RangeStart`/`RangeEnd` filter must be translated into a `WHERE` clause on the query sent to the source (query folding). If folding breaks — for instance, because you applied an M transformation the connector can't translate to SQL — Power BI downloads the entire table and filters in memory. The result: you reprocess everything despite the partitioning being configured, with no gain at all.

Therefore:

* Apply the date filter as early as possible in the query, before any complex transformation.
* Prefer sources that support native folding (SQL Server, Azure SQL, Synapse, Fabric Warehouse) — CSV/Excel files and many web connectors don't fold.
* Validate with "View Native Query" in Power Query: if the option is available and the `WHERE` reflects the range, folding is preserved.

**Detect data changes and advanced policies**

Basic incremental refresh reprocesses the whole recent window. If, within that window, most partitions don't change, you still waste cycles. The **Detect data changes** option points to a column (typically `LastModified`) that Power BI uses to check whether a partition changed since the last refresh — reprocessing only those that actually did. This requires a reliable audit column in the source.

There's also the option to keep real-time data in the most recent partition via DirectQuery (hybrid tables): history stays in partitioned Import, while the current day is queried live. Useful when the business needs low latency without sacrificing the performance of historical data.

**Premium, XMLA, and the first load**

Some operational points that tend to surprise:

* The first refresh after publishing loads the entire history at once — it can be slow and heavy. On very large datasets, it's worth loading partitions incrementally via the XMLA endpoint with tools like Tabular Editor, rather than letting the service do the full initial load.
* Partitioning is only visible and manageable on Premium/Fabric capacities (Premium Per User, P or F capacities) through the XMLA endpoint. On pure Pro you configure the policy but lose fine-grained control.
* Changing the policy structure after publishing may force a full reload. Plan the archival and refresh-window design before going to production.

**A practical roadmap**

1. Create the `RangeStart` and `RangeEnd` parameters (Date/Time) and filter the fact table by them.
2. Ensure folding survives the filter — validate the native query.
3. Define the policy: how many years to archive and the incremental refresh window.
4. If there's a reliable audit column, enable Detect data changes.
5. Publish to a Premium/Fabric capacity and, for large histories, do the initial load via XMLA.
6. Monitor refresh duration and memory — the gain should be immediate and measurable.

Incremental refresh is one of the highest-return optimizations in enterprise models: it turns hour-long updates into minutes and eliminates the leading cause of failure in large datasets. If your company operates critical Power BI models and faces tight refresh windows or recurring timeouts, Dynamic Soluções helps design the partitioning strategy, ensure end-to-end query folding, and structure refresh governance on your capacity.
