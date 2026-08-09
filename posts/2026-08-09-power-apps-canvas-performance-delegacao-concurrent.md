---
title: "Power Apps Canvas: performance com delegação e concurrent"
description: "Apps canvas lentos quase sempre têm a mesma raiz: delegação quebrada e carregamento serial. Veja padrões práticos para acelerar telas e queries no Dataverse."
date: '2026-08-09 13:53:35'
---
App canvas rápido em ambiente de teste e lento em produção é um clássico. Na maioria dos casos o problema não está no dispositivo do usuário, e sim em duas decisões de arquitetura tomadas cedo demais: como as queries são delegadas para a fonte de dados e como o `OnStart`/`OnVisible` carrega os dados. Este post é um roteiro prático para quem já entrega apps canvas em escala e precisa domar tempo de abertura e responsividade de tela.

**Delegação: o gargalo silencioso**

Delegação é a capacidade do Power Apps de empurrar o processamento de um filtro/ordenação para a fonte de dados, em vez de baixar tudo para o cliente e processar localmente. Quando uma função não é delegável para aquela fonte, o Power Apps traz apenas os primeiros 500 registros (ajustável até 2000 em Settings) e aplica a lógica localmente — resultado: números errados, listas truncadas e a temida barra amarela (delegation warning) no editor.

Pontos que mudam na prática:

* A delegação depende do par **função + conector**. `Filter` com `StartsWith` é delegável no Dataverse e no SQL Server, mas `Search` não é delegável em vários conectores. Em SharePoint, o suporte é mais restrito que no Dataverse.
* Operações que quase sempre quebram delegação: `Filter` sobre colunas calculadas, comparações com funções não delegáveis (ex.: parte de datas manipulada em fórmula), `in` em texto e algumas combinações com `And`/`Or` aninhados.
* O limite de 500/2000 é um teto, não um alerta. Um app pode parecer correto no teste porque a tabela tem 300 linhas, e falhar silenciosamente em produção com 50 mil.

**Como projetar para delegar**

1. Prefira **Dataverse** como fonte para apps com volume — o suporte a delegação é o mais amplo da plataforma.
2. Faça o filtro pesado na fonte e traga um conjunto reduzido. Se precisar de lógica não delegável, aplique-a depois sobre o conjunto já filtrado e pequeno.
3. Materialize valores em variáveis antes do `Filter` quando a fórmula referencia funções não delegáveis: em vez de `Filter(Contas, Modified > DateAdd(Now(), -7, Days))`, calcule a data em `Set(dtCorte, ...)` e use `Filter(Contas, Modified > dtCorte)`.
4. Trate o delegation warning como bug, não como aviso cosmético. Se ele aparece, assuma que os dados estão errados até prova em contrário.

**Carregamento serial vs. Concurrent**

O segundo grande vilão do tempo de abertura é o `OnStart` que executa uma dúzia de chamadas de dados em sequência. Cada `ClearCollect` espera o anterior terminar. A função `Concurrent` executa fórmulas independentes em paralelo:

```
Concurrent(
    ClearCollect(colUsuarios, Filter(Usuarios, Ativo = true)),
    ClearCollect(colCategorias, Categorias),
    Set(varConfig, LookUp(Config, Chave = "app"))
)
```

Se você tem cinco chamadas de ~400ms cada, o serial gasta ~2s e o `Concurrent` tende a gastar o tempo da mais lenta, não a soma. A regra: só paralelize fórmulas que **não dependem** do resultado uma da outra.

**Menos no OnStart, mais sob demanda**

O instinto de pré-carregar tudo no `OnStart` para "deixar rápido depois" costuma piorar o tempo de abertura, que é o momento em que o usuário mais percebe lentidão. Estratégias que ajudam:

* Carregue no `OnVisible` da tela apenas o que aquela tela precisa, não o app inteiro.
* Use `App.StartScreen` (propriedade nativa) em vez de `Navigate` dentro do `OnStart` — ele elimina a espera do `OnStart` para decidir a primeira tela.
* Evite `ClearCollect` de tabelas grandes só para exibir em uma galeria: aponte a galeria diretamente para a fonte delegável e deixe o Power Apps paginar.
* Cuidado com galerias aninhadas e fórmulas complexas em `Items` — elas reavaliam a cada scroll.

**Medir antes de otimizar**

Não otimize no achismo. O **Monitor** (dentro do Power Apps Studio, aba Advanced tools) mostra cada chamada de rede, sua duração e a fonte, permitindo identificar exatamente qual query está lenta e se foi delegada. Combine com o painel de análise de performance do app para separar o custo de rede do custo de renderização de controles.

**Impacto de licenciamento**

Vale lembrar que usar Dataverse como fonte — recomendação central para delegação e performance — exige licenciamento **Power Apps Premium** (per app ou per user) para os usuários do app. Conectores standard como SharePoint entram no Microsoft 365, mas com o custo de uma delegação mais limitada. Essa é uma decisão de arquitetura com efeito direto no TCO do app, e deve ser feita no início do projeto, não depois que a tabela cresceu.

Apps canvas performáticos raramente são fruto de um truque isolado; são o resultado de projetar delegação desde o modelo de dados e disciplinar o carregamento. Se sua empresa mantém apps críticos que estão lentos conforme os dados crescem, a Dynamic Soluções pode revisar a arquitetura, o licenciamento e os padrões de fórmula com você — seja em um projeto pontual ou dentro de um plano de suporte contínuo.



A canvas app that flies in testing and crawls in production is a classic. In most cases the problem isn't the user's device — it's two architecture decisions made too early: how queries are delegated to the data source, and how `OnStart`/`OnVisible` loads data. This post is a practical roadmap for teams already shipping canvas apps at scale who need to tame startup time and screen responsiveness.

**Delegation: the silent bottleneck**

Delegation is Power Apps' ability to push a filter/sort down to the data source instead of downloading everything to the client and processing locally. When a function isn't delegable for that source, Power Apps only pulls the first 500 records (adjustable up to 2000 in Settings) and applies the logic locally — the result: wrong numbers, truncated lists, and the dreaded yellow delegation warning in the editor.

What changes in practice:

* Delegation depends on the **function + connector** pair. `Filter` with `StartsWith` is delegable in Dataverse and SQL Server, but `Search` isn't delegable in several connectors. In SharePoint, support is more limited than in Dataverse.
* Operations that almost always break delegation: `Filter` over calculated columns, comparisons with non-delegable functions (e.g., a date part manipulated inside a formula), `in` on text, and some nested `And`/`Or` combinations.
* The 500/2000 limit is a ceiling, not an alert. An app can look correct in testing because the table has 300 rows and then fail silently in production with 50,000.

**Designing to delegate**

1. Prefer **Dataverse** as the source for high-volume apps — it has the broadest delegation support on the platform.
2. Do the heavy filtering at the source and bring back a small set. If you need non-delegable logic, apply it afterwards on the already-filtered, small set.
3. Materialize values into variables before `Filter` when the formula references non-delegable functions: instead of `Filter(Accounts, Modified > DateAdd(Now(), -7, Days))`, compute the date in `Set(cutoffDate, ...)` and use `Filter(Accounts, Modified > cutoffDate)`.
4. Treat the delegation warning as a bug, not a cosmetic notice. If it appears, assume the data is wrong until proven otherwise.

**Serial loading vs. Concurrent**

The second big villain of startup time is an `OnStart` running a dozen data calls in sequence. Each `ClearCollect` waits for the previous one to finish. The `Concurrent` function runs independent formulas in parallel:

```
Concurrent(
    ClearCollect(colUsers, Filter(Users, Active = true)),
    ClearCollect(colCategories, Categories),
    Set(varConfig, LookUp(Config, Key = "app"))
)
```

If you have five calls of ~400ms each, serial spends ~2s while `Concurrent` tends to spend the time of the slowest one, not the sum. The rule: only parallelize formulas that **don't depend** on each other's result.

**Less in OnStart, more on demand**

The instinct to pre-load everything in `OnStart` to "make it fast later" usually worsens startup time — the very moment the user perceives lag most. Strategies that help:

* Load in a screen's `OnVisible` only what that screen needs, not the whole app.
* Use `App.StartScreen` (a native property) instead of `Navigate` inside `OnStart` — it removes the wait for `OnStart` to decide the first screen.
* Avoid `ClearCollect` of large tables just to display them in a gallery: point the gallery directly at the delegable source and let Power Apps paginate.
* Beware of nested galleries and complex formulas in `Items` — they re-evaluate on every scroll.

**Measure before optimizing**

Don't optimize on hunches. **Monitor** (inside Power Apps Studio, Advanced tools tab) shows every network call, its duration and its source, letting you pinpoint exactly which query is slow and whether it was delegated. Combine it with the app's performance analysis panel to separate network cost from control rendering cost.

**Licensing impact**

Remember that using Dataverse as the source — the central recommendation for delegation and performance — requires **Power Apps Premium** licensing (per app or per user) for the app's users. Standard connectors like SharePoint are included in Microsoft 365, but at the cost of more limited delegation. This is an architecture decision with a direct effect on the app's TCO, and it should be made at the start of the project, not after the table has grown.

Performant canvas apps rarely come from a single trick; they're the result of designing delegation from the data model up and disciplining data loading. If your company runs critical apps that slow down as data grows, Dynamic Soluções can review the architecture, licensing and formula patterns with you — whether in a one-off project or within an ongoing support plan.
