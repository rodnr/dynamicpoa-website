---
title: "Power BI: DAX time intelligence sem tabela calendário quebrar"
description: "Funcoes de time intelligence do DAX so funcionam com uma tabela de datas bem construida. Veja como montar o calendario, marca-lo como date table e evitar erros comuns."
date: '2026-09-29 18:33:44'
---
Quase todo relatorio corporativo precisa de comparativos temporais: acumulado do ano, variacao contra o mesmo periodo do ano anterior, media movel de 3 meses. O DAX oferece um arsenal de funcoes de time intelligence justamente para isso — mas elas dependem de uma premissa que muita gente ignora e que e a causa da maioria dos numeros errados em producao: **uma tabela de datas dedicada, continua e marcada como tal**. Sem ela, `TOTALYTD`, `SAMEPERIODLASTYEAR` e afins retornam valores silenciosamente errados ou simplesmente em branco.

**Por que a coluna de data da tabela fato nao basta**

O erro classico e aplicar time intelligence direto sobre a coluna `DataVenda` da tabela de fato. As funcoes de time intelligence do DAX assumem internamente que existe uma tabela de datas com uma linha por dia, sem buracos, cobrindo todo o intervalo do modelo. Elas usam essa continuidade para deslocar contextos de filtro ("mesmo periodo, ano anterior") de forma confiavel.

Se voce usa a coluna da fato:

* Dias sem transacao nao existem na coluna, entao a serie tem buracos e o deslocamento de periodo fica impreciso.
* Funcoes como `DATESYTD` podem funcionar por sorte em alguns cenarios e falhar em outros, o que e pior do que falhar sempre — o bug passa desapercebido.
* Voce nao consegue relacionar multiplas fatos (vendas, metas, estoque) a um unico eixo temporal comum.

**Como construir a tabela calendario**

A forma mais limpa e uma tabela calculada com `CALENDAR` ou `CALENDARAUTO`, garantindo continuidade dia a dia entre o menor e o maior valor do modelo:

```
Dim Calendario =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2020, 1, 1 ), DATE ( 2027, 12, 31 ) ),
    "Ano", YEAR ( [Date] ),
    "MesNum", MONTH ( [Date] ),
    "MesNome", FORMAT ( [Date], "MMM" ),
    "AnoMes", FORMAT ( [Date], "YYYY-MM" ),
    "Trimestre", "T" & FORMAT ( [Date], "Q" )
)
```

Defina o intervalo com folga em relacao aos seus dados — nunca deixe a tabela terminar no meio de um ano fiscal, senao os acumulados do ultimo periodo ficam truncados. Em modelos grandes, prefira construir o calendario no Power Query ou na fonte, para nao pagar o custo de uma coluna calculada em cada refresh, mas o principio e o mesmo.

**O passo que quase todo mundo pula: Mark as Date Table**

Criar a tabela e relacionar com a fato nao e suficiente. Voce precisa marcar a tabela como tabela de datas (`Mark as date table`, apontando a coluna de data). Isso faz duas coisas essenciais:

1. Informa ao engine qual coluna representa a continuidade temporal, permitindo que as funcoes de time intelligence funcionem de forma deterministica.
2. Remove as hierarquias automaticas de data (Auto Date/Time) associadas as colunas da fato, que inflam o modelo com tabelas ocultas por coluna de data.

Sem esse passo, o comportamento de funcoes como `SAMEPERIODLASTYEAR` fica dependente de heuristicas internas e pode divergir entre visuais. Marcar a tabela e a diferenca entre time intelligence confiavel e um jogo de adivinhacao.

**Padroes de medidas que voce vai reusar**

Com a tabela pronta e marcada, as medidas ficam limpas e componiveis:

```
Vendas YTD = TOTALYTD ( [Total Vendas], 'Dim Calendario'[Date] )

Vendas Ano Anterior =
CALCULATE ( [Total Vendas], SAMEPERIODLASTYEAR ( 'Dim Calendario'[Date] ) )

Var % YoY =
DIVIDE ( [Total Vendas] - [Vendas Ano Anterior], [Vendas Ano Anterior] )

Media Movel 3M =
AVERAGEX (
    DATESINPERIOD ( 'Dim Calendario'[Date], MAX ( 'Dim Calendario'[Date] ), -3, MONTH ),
    [Total Vendas]
)
```

Repare que todas apontam para a coluna de data do calendario, nunca para a fato. Esse e o contrato que mantem tudo coerente.

**Armadilhas de producao**

* **Ano fiscal diferente do calendario:** se sua empresa fecha o ano em julho, use o parametro de fim de ano fiscal em `TOTALYTD ( ..., "06-30" )` ou construa colunas fiscais proprias. Ignorar isso gera acumulados errados nos relatorios da diretoria.
* **Auto Date/Time ainda ligado:** verifique nas opcoes do arquivo e desligue globalmente. Deixar ligado junto com o calendario duplica o custo em memoria e confunde quem edita o modelo.
* **Relacionamento inativo ou multiplas datas:** modelos com varias datas relevantes (data do pedido, data de entrega) exigem role-playing dimensions com `USERELATIONSHIP` — nao tente resolver com duas tabelas calendario sem necessidade.
* **Filtro por coluna de texto AnoMes:** ordenar `AnoMes` alfabeticamente funciona porque usamos formato `YYYY-MM`; se usar `MMM/YYYY`, configure `Sort by column` com uma coluna numerica, senao os meses saem fora de ordem.

**Fechamento**

Time intelligence no DAX e poderoso, mas e tao confiavel quanto a tabela de datas por baixo dele. Uma dimensao calendario continua, com intervalo folgado, marcada como date table e com Auto Date/Time desligado, elimina de uma vez a maior fonte de numeros errados em relatorios corporativos. Se sua empresa esta escalando modelos Power BI e precisa de governanca de dados que sustente decisoes de diretoria, a Dynamic Solucoes ajuda a estruturar modelagem, DAX e ALM da sua camada analitica com seguranca.



Almost every corporate report needs time-based comparisons: year-to-date totals, variance against the same period last year, 3-month moving averages. DAX offers a full arsenal of time intelligence functions precisely for this — but they rely on an assumption many people ignore, and that is the root cause of most wrong numbers in production: **a dedicated, continuous date table, properly marked as such**. Without it, `TOTALYTD`, `SAMEPERIODLASTYEAR` and their siblings return silently wrong values or simply blanks.

**Why the fact table's date column isn't enough**

The classic mistake is applying time intelligence directly on the `SalesDate` column of the fact table. DAX time intelligence functions internally assume a date table with one row per day, no gaps, covering the model's full range. They use that continuity to shift filter contexts ("same period, prior year") reliably.

If you use the fact column:

* Days with no transactions don't exist in the column, so the series has gaps and period shifting becomes imprecise.
* Functions like `DATESYTD` may work by luck in some scenarios and fail in others, which is worse than always failing — the bug goes unnoticed.
* You can't relate multiple fact tables (sales, targets, inventory) to a single shared time axis.

**How to build the calendar table**

The cleanest approach is a calculated table with `CALENDAR` or `CALENDARAUTO`, guaranteeing day-by-day continuity between the model's minimum and maximum values:

```
Dim Calendar =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2020, 1, 1 ), DATE ( 2027, 12, 31 ) ),
    "Year", YEAR ( [Date] ),
    "MonthNum", MONTH ( [Date] ),
    "MonthName", FORMAT ( [Date], "MMM" ),
    "YearMonth", FORMAT ( [Date], "YYYY-MM" ),
    "Quarter", "Q" & FORMAT ( [Date], "Q" )
)
```

Set the range with margin around your data — never let the table end in the middle of a fiscal year, or the last period's totals get truncated. In large models, prefer building the calendar in Power Query or at the source to avoid the cost of a calculated column on every refresh, but the principle is the same.

**The step almost everyone skips: Mark as Date Table**

Creating the table and relating it to the fact isn't enough. You must mark the table as a date table (`Mark as date table`, pointing to the date column). This does two essential things:

1. Tells the engine which column represents temporal continuity, letting time intelligence functions behave deterministically.
2. Removes the automatic date hierarchies (Auto Date/Time) tied to fact columns, which bloat the model with a hidden table per date column.

Without this step, functions like `SAMEPERIODLASTYEAR` depend on internal heuristics and can diverge between visuals. Marking the table is the difference between reliable time intelligence and a guessing game.

**Measure patterns you'll reuse**

With the table ready and marked, measures become clean and composable:

```
Sales YTD = TOTALYTD ( [Total Sales], 'Dim Calendar'[Date] )

Sales Prior Year =
CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Dim Calendar'[Date] ) )

% YoY Var =
DIVIDE ( [Total Sales] - [Sales Prior Year], [Sales Prior Year] )

3M Moving Average =
AVERAGEX (
    DATESINPERIOD ( 'Dim Calendar'[Date], MAX ( 'Dim Calendar'[Date] ), -3, MONTH ),
    [Total Sales]
)
```

Notice they all point to the calendar's date column, never to the fact. That's the contract that keeps everything consistent.

**Production pitfalls**

* **Fiscal year different from calendar year:** if your company closes the year in July, use the fiscal year-end parameter in `TOTALYTD ( ..., "06-30" )` or build your own fiscal columns. Ignoring this produces wrong totals in board reports.
* **Auto Date/Time still on:** check the file options and turn it off globally. Leaving it on alongside your calendar doubles memory cost and confuses anyone editing the model.
* **Inactive relationship or multiple dates:** models with several relevant dates (order date, delivery date) require role-playing dimensions with `USERELATIONSHIP` — don't reach for two calendar tables unnecessarily.
* **Filtering by a YearMonth text column:** sorting `YearMonth` alphabetically works because we use `YYYY-MM` format; if you use `MMM/YYYY`, configure `Sort by column` with a numeric column, or months come out unsorted.

**Wrap-up**

DAX time intelligence is powerful, but it's only as reliable as the date table underneath it. A continuous calendar dimension, with a generous range, marked as a date table and with Auto Date/Time turned off, eliminates the single biggest source of wrong numbers in corporate reports. If your company is scaling Power BI models and needs data governance that supports board-level decisions, Dynamic Solucoes helps structure the modeling, DAX and ALM of your analytical layer with confidence.
