---
title: "Dataverse: escolha entre calculated, rollup e Power Fx columns"
description: "Comparativo prático dos tipos de colunas calculadas do Dataverse: calculated, rollup e formula columns em Power Fx, com trade-offs de performance e limites."
date: '2026-08-13 14:25:13'
---
Quem projeta apps model-driven ou soluções sobre Dataverse cedo ou tarde precisa calcular valores derivados: um total de pedido, a idade de um contrato, a soma de itens filhos, um campo concatenado. O Dataverse oferece hoje três mecanismos nativos para isso — **calculated columns**, **rollup columns** e as **formula columns** baseadas em Power Fx — e escolher o errado gera problemas de performance, dados desatualizados ou lógica que simplesmente não é possível. Este post detalha o que cada tipo faz, quando calcula, e como decidir.

**Calculated columns: cálculo em tempo de leitura, dentro da mesma linha**

A calculated column resolve uma expressão no momento em que a linha é lida (retrieve), usando valores da própria linha ou de linhas relacionadas via lookup. Não armazena o resultado — ele é computado sob demanda pelo servidor.

* **O que resolve bem:** concatenação de campos (`fullname`), classificação condicional (faixa de valor, status derivado), cálculos aritméticos simples entre colunas da mesma linha.
* **Limites que importam:** você não pode ordenar nem agrupar de forma confiável por uma calculated column em views grandes, porque o cálculo acontece na leitura e não está indexado. Cálculos em cadeia (uma calculated referenciando outra) têm profundidade limitada. E não há acesso a agregações de linhas filhas.
* **Pegadinha comum:** usar calculated column como filtro em views ou em queries de grande volume degrada a performance, porque força o motor a calcular para avaliar o filtro.

**Rollup columns: agregação de linhas relacionadas, calculada em lote**

Rollup columns existem para o cenário que a calculated não cobre: agregar linhas filhas — soma, contagem, mínimo, máximo, média sobre um relacionamento 1:N. O total de itens de um pedido, o número de casos abertos por conta, o maior valor de proposta de uma oportunidade.

O ponto crítico é **quando** o valor é atualizado. O rollup **não é recalculado em tempo real**: um job em background (por padrão a cada 12 horas, ajustável no nível do sistema) reprocessa os valores em massa. O usuário pode forçar o recálculo de uma linha específica clicando no ícone de refresh ao lado do campo, mas você não deve assumir que o rollup está sempre atualizado ao vivo.

* **Quando usar:** métricas agregadas que toleram alguma latência (dashboards, indicadores, relatórios).
* **Quando NÃO usar:** regra de negócio que precisa do total exato no instante de uma decisão — por exemplo, bloquear um pedido se o total ultrapassar um limite de crédito. Nesse caso, use um fluxo, um plugin ou uma formula column, não rollup.
* **Limites:** filtros no rollup são restritos, hierarquias recursivas têm profundidade limitada e cada rollup consome recurso de job — não crie dezenas indiscriminadamente.

**Formula columns (Power Fx): a evolução das calculated**

As formula columns são a geração mais recente e usam **Power Fx** — a mesma linguagem do canvas app — para calcular em tempo de leitura. Elas foram desenhadas para substituir boa parte dos casos de calculated column com uma sintaxe muito mais expressiva e familiar para quem já vive na Power Platform.

* **Vantagens:** funções ricas (texto, data/hora, matemática, condicionais), melhor legibilidade e a mesma experiência de autoria do Power Fx. Bom para lógica que ficaria verbosa ou impossível numa calculated.
* **Cuidados:** como calculam na leitura, valem as mesmas ressalvas de performance de ordenação/filtro em grande volume. Nem toda função Power Fx está disponível, e há limites de tipos de retorno e de referências. Como recurso mais novo, vale validar disponibilidade e comportamento no seu ambiente antes de padronizar.

**Roteiro de decisão**

1. **É agregação de linhas filhas (soma/contagem/etc.)?** → Rollup, se latência é aceitável; senão, fluxo/plugin no momento do evento.
2. **É cálculo dentro da própria linha (ou lookup direto) e você quer sintaxe moderna?** → Formula column (Power Fx).
3. **É cálculo simples dentro da linha em ambiente que ainda não adota formula columns?** → Calculated column.
4. **A regra precisa ser garantida no exato momento da gravação (validação crítica, valores travados historicamente)?** → Saia das colunas calculadas: use business rule, Power Automate ou plugin gravando em uma coluna comum, e considere impacto de ALM e performance.

Um erro clássico de arquitetura é tratar rollup como se fosse tempo real e construir automações que leem um total desatualizado. Outro é abusar de calculated/formula columns como filtro de views pesadas e depois culpar a plataforma pela lentidão. Escolher o mecanismo certo é parte de modelagem de dados, não um detalhe de configuração.

Se sua empresa está estruturando um modelo de dados sério no Dataverse — com regras de negócio, agregações e apps model-driven em produção — a Dynamic Soluções ajuda a desenhar a arquitetura de colunas, segurança e ALM para que ela escale sem retrabalho. Fale com a gente ou solicite uma solução pelo nosso portal self-service de Power Platform.



Anyone designing model-driven apps or Dataverse-based solutions eventually needs derived values: an order total, a contract's age, the sum of child items, a concatenated field. Dataverse currently offers three native mechanisms for this — **calculated columns**, **rollup columns**, and Power Fx-based **formula columns** — and picking the wrong one leads to performance issues, stale data, or logic that simply isn't possible. This post breaks down what each type does, when it computes, and how to decide.

**Calculated columns: computed at read time, within the same row**

A calculated column resolves an expression the moment the row is read (retrieve), using values from the row itself or from related rows via lookup. It doesn't store the result — it's computed on demand by the server.

* **Good fits:** field concatenation (`fullname`), conditional classification (value band, derived status), simple arithmetic between columns on the same row.
* **Limits that matter:** you can't reliably sort or group by a calculated column in large views, because the calculation happens at read time and isn't indexed. Chained calculations (one calculated column referencing another) have limited depth. And there's no access to aggregations of child rows.
* **Common trap:** using a calculated column as a filter in views or in high-volume queries hurts performance, because the engine is forced to compute in order to evaluate the filter.

**Rollup columns: aggregating related rows, computed in batch**

Rollup columns exist for the scenario calculated columns don't cover: aggregating child rows — sum, count, min, max, average over a 1:N relationship. The total of items on an order, the number of open cases per account, the highest quote value on an opportunity.

The critical point is **when** the value is updated. A rollup is **not recalculated in real time**: a background job (by default every 12 hours, adjustable at the system level) reprocesses the values in bulk. A user can force recalculation of a specific row by clicking the refresh icon next to the field, but you should never assume a rollup is always live.

* **When to use:** aggregate metrics that tolerate some latency (dashboards, KPIs, reports).
* **When NOT to use:** business rules that need the exact total at the instant of a decision — for example, blocking an order if the total exceeds a credit limit. In that case use a flow, a plugin, or a formula column, not a rollup.
* **Limits:** rollup filters are restricted, recursive hierarchies have limited depth, and each rollup consumes job resources — don't create dozens indiscriminately.

**Formula columns (Power Fx): the evolution of calculated columns**

Formula columns are the newest generation and use **Power Fx** — the same language as canvas apps — to compute at read time. They were designed to replace many calculated column use cases with far more expressive syntax that's familiar to anyone living in the Power Platform.

* **Advantages:** rich functions (text, date/time, math, conditionals), better readability, and the same Power Fx authoring experience. Great for logic that would be verbose or impossible in a calculated column.
* **Watch out for:** since they compute at read time, the same performance caveats apply to sorting/filtering at high volume. Not every Power Fx function is available, and there are limits on return types and references. As a newer feature, validate availability and behavior in your environment before standardizing on it.

**Decision roadmap**

1. **Is it aggregating child rows (sum/count/etc.)?** → Rollup, if latency is acceptable; otherwise a flow/plugin at event time.
2. **Is it a within-row calculation (or direct lookup) and you want modern syntax?** → Formula column (Power Fx).
3. **Is it a simple within-row calculation in an environment that doesn't yet adopt formula columns?** → Calculated column.
4. **Must the rule be guaranteed at the exact moment of the write (critical validation, values locked historically)?** → Step away from calculated columns: use a business rule, Power Automate, or a plugin writing to a regular column, and weigh the ALM and performance impact.

A classic architecture mistake is treating rollups as if they were real time and building automations that read a stale total. Another is abusing calculated/formula columns as filters in heavy views and then blaming the platform for the slowness. Choosing the right mechanism is part of data modeling, not a configuration afterthought.

If your company is building a serious Dataverse data model — with business rules, aggregations, and model-driven apps in production — Dynamic Soluções helps design the column, security, and ALM architecture so it scales without rework. Reach out or request a solution through our Power Platform self-service portal.
