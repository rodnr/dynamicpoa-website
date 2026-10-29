---
title: "Power Automate: concurrency control e ApplyToEach em paralelo sem corromper dados"
description: "Rodar o Apply to each em paralelo acelera fluxos, mas corrompe variaveis e dispara race conditions. Veja como controlar a concorrencia sem perder dados."
date: '2026-10-29 18:54:57'
---
Um dos primeiros ganhos de performance que muita equipe descobre no Power Automate e ligar o paralelismo do **Apply to each**. O fluxo que levava oito minutos passa a rodar em menos de um. O problema e que esse mesmo ajuste, aplicado sem entender o modelo de execucao, transforma um fluxo deterministico num gerador silencioso de dados corrompidos. Este post aborda o concurrency control do Apply to each, por que variaveis quebram em paralelo e como estruturar fluxos de alto throughput sem perder consistencia.

**O que o degree of parallelism realmente faz**

Por padrao, o Apply to each processa os itens de forma sequencial: um item por vez, na ordem da coleção. Ao abrir as configuracoes da acao (Settings > Concurrency Control) e ligar o controle de concorrencia, voce define um **degree of parallelism** de 1 a 50. Esse numero e o teto de iteracoes executando simultaneamente.

O ponto crucial: o runtime nao garante ordem nem exclusividade entre iteracoes paralelas. Cada iteracao e tratada como uma unidade de trabalho independente que pode comecar, pausar e terminar em qualquer momento relativo as outras. Isso e exatamente o que acelera o fluxo e, ao mesmo tempo, o que quebra qualquer logica que assuma sequencia.

* **Grau 1** equivale ao comportamento sequencial, mesmo com o controle ligado.
* **Grau > 1** significa execucao concorrente real, com todas as consequencias de concorrencia que qualquer sistema distribuido tem.

**Por que variaveis corrompem silenciosamente**

O erro mais comum e usar `Increment variable`, `Append to array variable` ou `Set variable` dentro de um Apply to each paralelo. Variaveis no Power Automate sao de escopo do fluxo (globais), nao da iteracao. Quando duas iteracoes leem a variavel, incrementam e gravam quase ao mesmo tempo, uma sobrescreve a outra: e o classico **lost update**.

O resultado nao e um erro vermelho no run history. O fluxo termina com status Succeeded, mas seu contador marca 37 em vez de 50, ou seu array de resultados tem itens faltando. Esse e o pior tipo de bug: silencioso, intermitente e difícil de reproduzir porque depende do timing exato das iteracoes.

Regras praticas:

* Nunca use operacoes de variavel que dependem do valor anterior (increment/decrement/append) dentro de um loop paralelo.
* Para agregar resultados, prefira a acao **Select** (map sem loop) ou colete tudo e processe fora do loop.
* Se precisar mesmo de agregacao dentro do loop, volte o grau para 1 ou desenhe a agregacao de forma stateless.

**Race conditions alem das variaveis**

O problema nao se limita a variaveis internas. Qualquer efeito colateral externo sofre com paralelismo mal controlado:

* **Dataverse/SQL:** duas iteracoes que fazem Get + Create na mesma chave de negocio podem criar duplicatas. A defesa e a mesma de qualquer integracao concorrente: Upsert com alternate key, nunca Get-then-Create.
* **Contadores em uma tabela:** incrementar um campo numa linha a partir de varias iteracoes leva a lost update no banco. Use optimistic concurrency (ETag/row version) com retry, ou delegue o incremento para o servidor.
* **APIs externas com throttling:** 30 iteracoes disparando ao mesmo tempo estouram o rate limit da API muito mais rapido que um loop sequencial. O grau de paralelismo vira, na pratica, o seu controle de vazao contra o 429.

**Como dimensionar o grau certo**

Nao existe numero magico; existe o gargalo do seu cenario. O grau ideal e o maior valor que ainda respeita o recurso mais restrito a jusante:

1. **Identifique o limite externo.** Se a API destino aceita 10 chamadas simultaneas, nao adianta colocar grau 50 — voce so antecipa o throttling.
2. **Considere os action limits do Power Platform.** Loops paralelos consomem acoes muito mais rapido; em plano por usuario, isso impacta os limites diarios de requests da plataforma.
3. **Teste com volume real.** Comece com grau 5, meça o run, suba gradualmente. O ganho costuma saturar bem antes de 50 por causa do gargalo externo.
4. **Isole operacoes com estado.** Se parte da logica precisa ser sequencial e parte pode ser paralela, quebre em dois loops ou extraia a parte paralela para um child flow invocado de forma controlada.

**Padrao de referencia para alto volume**

Para um fluxo que processa centenas de itens com chamada a API externa e persistencia:

* **Map antes do loop:** use Select para transformar a coleção de entrada no formato final, sem efeito colateral e sem concorrencia.
* **Loop paralelo so com operacoes idempotentes:** dentro do Apply to each, apenas chamadas que podem ser repetidas com seguranca (Upsert por chave, PUT idempotente), nunca append em variavel.
* **Agregacao fora do loop:** se precisar consolidar sucessos e falhas, colete via output das acoes e processe depois, ou grave cada resultado direto numa tabela de staging.
* **Tratamento de erro por iteracao:** configure o Apply to each para nao abortar tudo no primeiro erro (Configure run after / scope Try-Catch dentro do loop), registrando a falha por item em vez de derrubar o run inteiro.

**Fechamento**

Paralelismo no Power Automate e uma alavanca de performance legítima — mas e uma alavanca de concorrencia, nao so de velocidade. A regra mental e simples: tudo dentro de um loop paralelo precisa ser idempotente e stateless, ou voce esta apostando em timing. Variaveis dependentes de valor anterior, Get-then-Create e incrementos em linha nao sobrevivem ao grau > 1.

Se sua empresa opera automacoes criticas de alto volume e precisa de arquitetura resiliente — concurrency control, idempotencia, child flows e governanca em soluções gerenciadas — a Dynamic Soluções apoia o desenho e a sustentação desses fluxos, por meio dos planos de suporte e do portal self-service de Power Platform.



One of the first performance wins many teams discover in Power Automate is enabling parallelism on the **Apply to each**. A flow that took eight minutes suddenly runs in under one. The catch is that this very setting, applied without understanding the execution model, turns a deterministic flow into a silent generator of corrupted data. This post covers concurrency control on Apply to each, why variables break under parallelism, and how to structure high-throughput flows without losing consistency.

**What degree of parallelism actually does**

By default, Apply to each processes items sequentially: one item at a time, in collection order. When you open the action settings (Settings > Concurrency Control) and turn on concurrency control, you set a **degree of parallelism** between 1 and 50. That number is the ceiling of iterations running simultaneously.

The key point: the runtime guarantees neither order nor mutual exclusion between parallel iterations. Each iteration is treated as an independent unit of work that can start, pause, and finish at any moment relative to the others. That is exactly what speeds up the flow and, at the same time, what breaks any logic that assumes sequence.

* **Degree 1** equals sequential behavior, even with control enabled.
* **Degree > 1** means true concurrent execution, with all the concurrency consequences any distributed system has.

**Why variables corrupt silently**

The most common mistake is using `Increment variable`, `Append to array variable`, or `Set variable` inside a parallel Apply to each. Variables in Power Automate are flow-scoped (global), not iteration-scoped. When two iterations read the variable, increment, and write almost at the same time, one overwrites the other: the classic **lost update**.

The result is not a red error in the run history. The flow finishes with Succeeded status, but your counter reads 37 instead of 50, or your results array is missing items. This is the worst kind of bug: silent, intermittent, and hard to reproduce because it depends on the exact timing of iterations.

Practical rules:

* Never use variable operations that depend on the previous value (increment/decrement/append) inside a parallel loop.
* To aggregate results, prefer the **Select** action (map without a loop) or collect everything and process it outside the loop.
* If you truly need aggregation inside the loop, set the degree back to 1 or design the aggregation statelessly.

**Race conditions beyond variables**

The problem is not limited to internal variables. Any external side effect suffers from poorly controlled parallelism:

* **Dataverse/SQL:** two iterations doing Get + Create on the same business key can create duplicates. The defense is the same as any concurrent integration: Upsert with an alternate key, never Get-then-Create.
* **Counters in a table:** incrementing a numeric field on a row from multiple iterations leads to a lost update in the database. Use optimistic concurrency (ETag/row version) with retry, or delegate the increment to the server.
* **Throttled external APIs:** 30 iterations firing at once blow past the API rate limit far faster than a sequential loop. The degree of parallelism effectively becomes your throughput control against the 429.

**How to size the right degree**

There is no magic number; there is the bottleneck of your scenario. The ideal degree is the highest value that still respects the most constrained downstream resource:

1. **Identify the external limit.** If the target API accepts 10 concurrent calls, setting degree 50 is pointless — you only bring the throttling forward.
2. **Account for Power Platform action limits.** Parallel loops consume actions much faster; on per-user plans, this hits the platform's daily request limits.
3. **Test with real volume.** Start at degree 5, measure the run, ramp up gradually. The gain usually saturates well before 50 because of the external bottleneck.
4. **Isolate stateful operations.** If part of the logic must be sequential and part can be parallel, split into two loops or extract the parallel part into a child flow invoked in a controlled way.

**Reference pattern for high volume**

For a flow processing hundreds of items with an external API call and persistence:

* **Map before the loop:** use Select to transform the input collection into its final shape, with no side effect and no concurrency.
* **Parallel loop only with idempotent operations:** inside Apply to each, only calls that can be safely repeated (Upsert by key, idempotent PUT), never variable append.
* **Aggregation outside the loop:** if you need to consolidate successes and failures, collect via the actions' output and process afterward, or write each result straight into a staging table.
* **Per-iteration error handling:** configure Apply to each not to abort everything on the first error (Configure run after / a Try-Catch scope inside the loop), logging the per-item failure instead of taking down the whole run.

**Closing**

Parallelism in Power Automate is a legitimate performance lever — but it is a concurrency lever, not just a speed lever. The mental rule is simple: everything inside a parallel loop must be idempotent and stateless, or you are betting on timing. Variables that depend on a previous value, Get-then-Create, and inline increments do not survive degree > 1.

If your company runs critical high-volume automations and needs resilient architecture — concurrency control, idempotency, child flows, and governance in managed solutions — Dynamic Soluções supports the design and ongoing operation of these flows through its support plans and the Power Platform self-service portal.
