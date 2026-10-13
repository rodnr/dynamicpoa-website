---
title: "Dataverse: formula columns em Power Fx vs plugin no servidor"
description: "Entenda onde as formula columns em Power Fx brilham e onde falham no Dataverse: avaliacao em tempo real, limites de delegacao, ordenacao e quando mover a logica para o servidor."
date: '2026-10-13 19:49:40'
---
As formula columns em Power Fx chegaram ao Dataverse como a resposta moderna para campos derivados — e muita gente passou a usá-las como substituto universal das antigas calculated columns. O problema é que, em cenários de volume e integração, elas têm um comportamento de avaliação diferente do que a maioria assume, e isso gera surpresas em produção. Este post detalha o que a formula column realmente faz por baixo e onde ela deixa de ser a escolha certa.

**O que muda no modelo de avaliação**

A formula column é avaliada em tempo de leitura (read-time), diferente da rollup column, que roda em job assíncrono, e da calculated column clássica, que também computa na leitura mas com uma linguagem bem mais pobre. Isso tem consequências diretas:

* O valor nunca é persistido fisicamente na tabela. Cada vez que você lê a linha, a expressão Power Fx é reavaliada sobre as colunas-fonte.
* Como não existe valor materializado, a coluna não pode ser indexada pelo storage engine. Filtrar ou ordenar por ela empurra o trabalho para fora do índice.
* A expressão opera sobre a mesma linha e sobre lookups diretos — não sobre agregações de linhas relacionadas (isso é território da rollup).

Na prática, você ganha consistência imediata (o valor sempre reflete o estado atual das colunas-fonte, sem esperar job) ao custo de não poder tratar a coluna como um dado comum para consultas pesadas.

**Os limites que aparecem em escala**

A sintaxe Power Fx na formula column é um subconjunto do Power Fx que você conhece do canvas app. Alguns pontos que travam cenários reais:

1. **Funções de agregação sobre relacionamentos não entram.** Se você precisa de soma/contagem de linhas filhas, é rollup column ou lógica no servidor — formula column não resolve.
2. **Ordenação e filtro delegáveis são limitados.** Como o valor é calculado na leitura, ordenar uma view do model-driven app por uma formula column complexa pode degradar performance ou simplesmente não delegar, forçando avaliação em memória sobre um subconjunto.
3. **Dependências em cadeia.** Uma formula column que referencia outra formula column cria uma cadeia de reavaliação; em tabelas largas com muitas colunas derivadas isso aumenta o custo de cada leitura.
4. **Sem efeito colateral.** A formula column é pura por design: ela calcula e retorna, não escreve em outra linha, não dispara flow, não chama API. Qualquer regra com efeito colateral está fora do escopo dela.

**Quando a lógica deve ir para o servidor**

O sinal mais claro de que você passou do ponto da formula column é quando o valor derivado precisa de uma das seguintes propriedades:

* **Ser consultável em volume** — usado como filtro/ordenação em views grandes, ou como coluna de busca em integrações. Aqui vale materializar o valor numa coluna comum, preenchida por um plugin em pre-operation (síncrono, dentro da transação, garante consistência na escrita) ou por um Power Automate (assíncrono, tolera latência).
* **Depender de agregação de filhos** — rollup column para o caso simples, ou plugin/flow quando o rollup não suporta a regra (filtros complexos, múltiplas tabelas, lógica condicional).
* **Ter efeito colateral ou chamar sistema externo** — nunca é formula column; é plugin, flow ou Azure Function dependendo do peso e da necessidade transacional.

Um padrão híbrido comum e saudável: use a formula column para derivações leves de exibição (concatenar nome completo, formatar um status, calcular dias desde uma data) e reserve a materialização em coluna física apenas para os poucos campos que realmente entram em consultas de alto volume. Materializar tudo "por via das dúvidas" só aumenta custo de escrita e complexidade de ALM.

**Cuidados de produção**

* Formula columns referenciam colunas por nome lógico; renomear ou remover uma coluna-fonte quebra a expressão — trate isso no seu processo de ALM em soluções gerenciadas.
* Ao exportar a solução, a formula column viaja junto; valide que as colunas-fonte existem no ambiente de destino na ordem certa de deploy.
* Teste a performance de views que ordenam por formula columns no ambiente com volume real, não no Dev com poucas linhas — o comportamento de delegação muda completamente.

Escolher onde colocar cada pedaço de lógica derivada — formula column, rollup, plugin ou flow — é uma decisão de arquitetura que impacta performance, custo e manutenibilidade a longo prazo. Se a sua empresa opera soluções Dataverse em escala e quer evitar retrabalho com campos derivados mal posicionados, a Dynamic Soluções apoia essa decisão desde o desenho do modelo até a governança de ALM nos planos de suporte contínuo.



Formula columns in Power Fx arrived in Dataverse as the modern answer for derived fields — and many teams started using them as a universal replacement for the old calculated columns. The problem is that, in high-volume and integration scenarios, their evaluation behavior differs from what most people assume, and that leads to surprises in production. This post breaks down what a formula column actually does under the hood and where it stops being the right choice.

**What changes in the evaluation model**

A formula column is evaluated at read-time, unlike a rollup column that runs in an async job, and unlike the classic calculated column that also computes on read but with a far poorer language. This has direct consequences:

* The value is never physically persisted in the table. Every time you read the row, the Power Fx expression is re-evaluated against the source columns.
* Since there's no materialized value, the column can't be indexed by the storage engine. Filtering or sorting by it pushes the work outside the index.
* The expression operates on the same row and on direct lookups — not on aggregations of related rows (that's rollup territory).

In practice you gain immediate consistency (the value always reflects the current state of the source columns, no waiting for a job) at the cost of not being able to treat the column as ordinary data for heavy queries.

**The limits that show up at scale**

The Power Fx syntax in formula columns is a subset of the Power Fx you know from canvas apps. A few points that block real scenarios:

1. **Aggregation functions over relationships don't apply.** If you need a sum/count of child rows, it's a rollup column or server-side logic — formula columns won't solve it.
2. **Delegable sort and filter are limited.** Because the value is computed on read, sorting a model-driven app view by a complex formula column can degrade performance or simply not delegate, forcing in-memory evaluation over a subset.
3. **Chained dependencies.** A formula column referencing another formula column creates a re-evaluation chain; in wide tables with many derived columns this raises the cost of each read.
4. **No side effects.** Formula columns are pure by design: they compute and return, they don't write to another row, trigger a flow, or call an API. Any rule with a side effect is out of scope.

**When the logic should move to the server**

The clearest sign you've outgrown the formula column is when the derived value needs one of these properties:

* **Being queryable at volume** — used as a filter/sort in large views, or as a search column in integrations. Here it pays to materialize the value in an ordinary column, populated by a pre-operation plugin (synchronous, inside the transaction, guarantees write-time consistency) or by a Power Automate flow (asynchronous, tolerates latency).
* **Depending on child aggregation** — rollup column for the simple case, or plugin/flow when rollup doesn't support the rule (complex filters, multiple tables, conditional logic).
* **Having a side effect or calling an external system** — never a formula column; it's a plugin, flow, or Azure Function depending on the weight and transactional need.

A common and healthy hybrid pattern: use the formula column for lightweight display derivations (concatenate full name, format a status, compute days since a date) and reserve materialization into a physical column only for the few fields that genuinely participate in high-volume queries. Materializing everything "just in case" only increases write cost and ALM complexity.

**Production considerations**

* Formula columns reference columns by logical name; renaming or removing a source column breaks the expression — handle this in your managed-solution ALM process.
* When you export the solution, the formula column travels with it; validate that the source columns exist in the target environment in the right deploy order.
* Test the performance of views that sort by formula columns in an environment with real volume, not in Dev with a handful of rows — delegation behavior changes completely.

Deciding where to place each piece of derived logic — formula column, rollup, plugin, or flow — is an architecture decision that affects performance, cost, and long-term maintainability. If your company runs Dataverse solutions at scale and wants to avoid rework from poorly placed derived fields, Dynamic Soluções supports that decision from model design through ALM governance in our ongoing support plans.
