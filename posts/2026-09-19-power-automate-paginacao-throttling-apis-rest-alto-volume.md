---
title: "Power Automate: paginação e throttling em APIs REST de alto volume"
description: "Como consumir APIs REST paginadas no Power Automate sem perder registros nem bater no throttle: pagination nativa, cursores, retry-after e controle de concorrência."
date: '2026-09-19 16:21:24'
---
Consumir uma API REST no Power Automate parece trivial até o dia em que o endpoint devolve mais de uma página de dados e o fluxo passa a processar só os primeiros 100 registros — silenciosamente. Ou até o momento em que a API começa a responder `429 Too Many Requests` sob carga e o fluxo falha de forma intermitente, sem padrão claro. Esses dois problemas — **paginação** e **throttling** — são a diferença entre uma integração de demonstração e uma integração que sobrevive em produção com volume real.

**Paginação: por que o resultado "completo" quase nunca é completo**

Quase toda API REST corporativa limita o tamanho da resposta. Ela devolve um bloco de registros e uma pista de como buscar o próximo. As três estratégias mais comuns são:

1. **Offset/limit** — você envia `?offset=200&limit=100` e incrementa o offset a cada chamada até vir uma página vazia. Simples, mas frágil se registros forem inseridos entre as chamadas (pode duplicar ou pular linhas).
2. **Cursor/continuation token** — a resposta traz um token opaco (`nextPageToken`, `@odata.nextLink`, `continuation`) que você passa na próxima requisição. É o padrão mais robusto porque a API garante consistência da sequência.
3. **Link header (RFC 5988)** — o próximo endereço vem no header `Link` com `rel="next"`. Comum em APIs REST públicas (GitHub, por exemplo).

O conector HTTP do Power Automate **não pagina sozinho**. Se você usa a ação HTTP genérica, precisa implementar o laço manualmente: uma variável para o cursor/offset, um `Do until` que roda enquanto houver próxima página, e dentro dele a chamada HTTP seguida da extração do token da resposta. O erro clássico é montar a condição de parada olhando só a contagem de itens — o certo é parar quando o campo de continuação vier nulo ou vazio, não quando a página vier "pequena".

Já os **custom connectors** têm suporte nativo a paginação: no editor, você define o campo que contém o próximo link e o Power Automate itera automaticamente, devolvendo a coleção agregada. É a forma mais limpa quando a API segue um padrão previsível de `nextLink`.

**Throttling: o 429 não é um erro, é uma instrução**

Quando uma API responde `429`, ela não está quebrada — está pedindo para você desacelerar. O comportamento profissional é respeitar o header `Retry-After` (em segundos ou como data HTTP) que quase sempre acompanha a resposta. Ignorar isso e simplesmente tentar de novo imediatamente só piora o quadro e pode levar a bloqueio temporário do cliente.

O Power Automate tem uma **retry policy** por ação (Settings → Retry Policy), com modos:

* **Exponential** — espera crescente entre tentativas (recomendado como padrão para 429/500).
* **Fixed interval** — intervalo constante.
* **None** — desliga o retry (útil quando você quer tratar o erro manualmente).

A retry policy nativa cobre `408`, `429` e `5xx` automaticamente e, importante, **honra o `Retry-After` quando presente**. Para a maioria dos casos, configurar exponential com um número razoável de tentativas já resolve. Quando a lógica de espera precisa ser mais fina — por exemplo, ler o `Retry-After` da resposta e usá-lo num `Delay` dinâmico dentro de um `Scope` com padrão Try/Catch — aí você desliga a retry nativa (`None`) e assume o controle.

**Controle de concorrência: o gargalo que você mesmo cria**

Um erro sutil é combinar paginação com `Apply to each` em modo paralelo alto. Se você processa cada página abrindo 50 chamadas simultâneas para a mesma API, você fabrica o próprio `429`. Ajuste o **Concurrency Control** do `Apply to each` para um grau compatível com o rate limit documentado da API — muitas APIs corporativas toleram bem 5 a 10 requisições concorrentes, mas não 50. Menos concorrência com retry saudável quase sempre termina mais rápido do que muita concorrência batendo em throttle.

**Padrão de referência para produção**

Para uma integração de alto volume que precisa ser confiável, o desenho que recomendamos combina:

* Um `Do until` (ou custom connector com paginação nativa) para varrer todas as páginas usando cursor, nunca offset quando houver alternativa.
* Retry policy exponential nas ações HTTP, respeitando `Retry-After`.
* Um `Scope` Try/Catch envolvendo o bloco crítico, com `result()` para identificar exatamente qual chamada falhou.
* Concorrência limitada e conservadora no processamento dos itens.
* Persistência incremental (gravar cada página no Dataverse/SharePoint antes de buscar a próxima), para que uma falha na página 40 não obrigue a reprocessar as 39 anteriores — o que, combinado com **alternate keys e upsert no Dataverse**, torna o reprocessamento idempotente.

**Quando a integração cresce demais para o fluxo**

Se o volume passa de dezenas de milhares de registros por execução, se a janela de tempo aperta ou se o custo de ações consumidas dispara, esse é o sinal de que a carga deveria migrar para uma **Azure Function** ou **Logic App**, deixando o Power Automate como orquestrador e não como motor de laço. O laço de paginação em código roda mais rápido, mais barato e com controle total de backoff.

Integrações que puxam dados de sistemas externos em escala são exatamente o tipo de projeto onde detalhes de paginação e throttling separam o piloto que "funcionou na demo" do serviço que roda todo dia sem intervenção. Se sua empresa depende dessas integrações, contar com um parceiro que já enfrentou esses limites em produção — como a Dynamic Soluções, via consultoria ou pela plataforma self-service de Power Platform — encurta bastante o caminho até uma arquitetura resiliente.



Consuming a REST API in Power Automate looks trivial until the day the endpoint returns more than one page of data and the flow starts processing only the first 100 records — silently. Or the moment the API begins responding with `429 Too Many Requests` under load and the flow fails intermittently, with no clear pattern. These two problems — **pagination** and **throttling** — are the difference between a demo integration and one that survives in production with real volume.

**Pagination: why the "complete" result is almost never complete**

Nearly every corporate REST API limits the size of its response. It returns a block of records plus a hint on how to fetch the next one. The three most common strategies are:

1. **Offset/limit** — you send `?offset=200&limit=100` and increment the offset on each call until an empty page comes back. Simple, but fragile if records are inserted between calls (it can duplicate or skip rows).
2. **Cursor/continuation token** — the response carries an opaque token (`nextPageToken`, `@odata.nextLink`, `continuation`) that you pass into the next request. This is the most robust pattern because the API guarantees sequence consistency.
3. **Link header (RFC 5988)** — the next address comes in the `Link` header with `rel="next"`. Common in public REST APIs (GitHub, for example).

Power Automate's HTTP connector **does not paginate on its own**. If you use the generic HTTP action, you must implement the loop manually: a variable for the cursor/offset, a `Do until` that runs while there is a next page, and inside it the HTTP call followed by extracting the token from the response. The classic mistake is building the stop condition based solely on item count — the right thing is to stop when the continuation field comes back null or empty, not when a page comes back "small."

**Custom connectors**, on the other hand, have native pagination support: in the editor you define the field containing the next link and Power Automate iterates automatically, returning the aggregated collection. This is the cleanest approach when the API follows a predictable `nextLink` pattern.

**Throttling: the 429 isn't an error, it's an instruction**

When an API responds with `429`, it isn't broken — it's asking you to slow down. The professional behavior is to respect the `Retry-After` header (in seconds or as an HTTP date) that almost always accompanies the response. Ignoring it and simply retrying immediately only makes things worse and can lead to a temporary client block.

Power Automate has a per-action **retry policy** (Settings → Retry Policy), with modes:

* **Exponential** — growing wait between attempts (recommended as the default for 429/500).
* **Fixed interval** — constant interval.
* **None** — turns retry off (useful when you want to handle the error manually).

The native retry policy automatically covers `408`, `429`, and `5xx` and, importantly, **honors `Retry-After` when present**. For most cases, configuring exponential with a reasonable number of attempts already solves it. When the wait logic needs to be finer — for example, reading `Retry-After` from the response and using it in a dynamic `Delay` inside a `Scope` with a Try/Catch pattern — you turn native retry off (`None`) and take control.

**Concurrency control: the bottleneck you create yourself**

A subtle mistake is combining pagination with `Apply to each` in high parallel mode. If you process each page by firing 50 simultaneous calls to the same API, you manufacture your own `429`. Adjust the **Concurrency Control** of the `Apply to each` to a degree compatible with the API's documented rate limit — many corporate APIs tolerate 5 to 10 concurrent requests well, but not 50. Less concurrency with healthy retry almost always finishes faster than heavy concurrency hitting throttle.

**A reference pattern for production**

For a high-volume integration that needs to be reliable, the design we recommend combines:

* A `Do until` (or a custom connector with native pagination) to sweep all pages using a cursor, never offset when there's an alternative.
* Exponential retry policy on HTTP actions, respecting `Retry-After`.
* A `Scope` Try/Catch wrapping the critical block, with `result()` to identify exactly which call failed.
* Limited, conservative concurrency when processing items.
* Incremental persistence (writing each page to Dataverse/SharePoint before fetching the next), so that a failure on page 40 doesn't force reprocessing the previous 39 — which, combined with **alternate keys and upsert in Dataverse**, makes reprocessing idempotent.

**When the integration grows too big for the flow**

If volume exceeds tens of thousands of records per run, if the time window tightens, or if the cost of consumed actions spikes, that's the signal that the workload should move to an **Azure Function** or **Logic App**, leaving Power Automate as the orchestrator rather than the loop engine. A pagination loop in code runs faster, cheaper, and with full backoff control.

Integrations that pull data from external systems at scale are exactly the kind of project where pagination and throttling details separate the pilot that "worked in the demo" from the service that runs every day without intervention. If your company depends on these integrations, working with a partner that has already faced these limits in production — such as Dynamic Soluções, through consulting or the Power Platform self-service platform — shortens the path to a resilient architecture considerably.
