---
title: "Power BI: tooltips de página vs drillthrough — quando usar cada um"
description: "Nem toda falha em um fluxo é culpa do seu código: entenda como distinguir erro transiente de permanente e construir retry que não quebra automações críticas."
date: '2026-11-11 20:06:47'
---
Um fluxo corporativo que roda milhares de vezes por dia vai falhar — isso é certeza, não hipótese. A pergunta real não é *se* vai falhar, mas *como* seu fluxo reage à falha. E o maior erro que vemos em ambientes de produção é tratar toda falha da mesma forma: um retry cego e genérico em cima de tudo. Esse padrão esconde bugs reais, duplica efeitos colaterais e, pior, faz o fluxo parecer saudável enquanto corrompe dados silenciosamente.

Neste post, o foco é a diferença entre **falha transiente** e **falha permanente**, e como construir uma estratégia de retry que respeita essa distinção — algo que vai muito além do campo "Retry Policy" na ação.

**Transiente vs permanente: a distinção que muda tudo**

Uma falha transiente é temporária por natureza: o serviço de destino estava sobrecarregado, houve um throttling momentâneo (HTTP 429), um timeout de rede, ou uma indisponibilidade curta (HTTP 503). Repetir a mesma operação daqui a alguns segundos tem alta probabilidade de sucesso, porque *a requisição em si estava correta*.

Uma falha permanente é determinística: o payload está malformado (HTTP 400), o registro não existe (404), você não tem permissão (403), ou a regra de negócio no destino rejeitou o dado (409/422). Repetir *exatamente a mesma requisição* vai falhar exatamente da mesma forma, para sempre. Retry sobre falha permanente é desperdício de execução, custo de conector e, em cenários com efeito colateral parcial, risco de duplicação.

A retry policy nativa do Power Automate (Default, Fixed Interval, Exponential) **não faz essa distinção**. Ela reexecuta a ação em qualquer falha dentro da faixa configurada. Por isso, estratégia de retry séria começa separando os dois mundos.

**O que a retry policy nativa cobre — e o que não cobre**

* A policy **Exponential** é a escolha padrão para chamadas HTTP/conector: ela espaça as tentativas crescentemente, dando tempo para o serviço se recuperar e respeitando backpressure. Use-a em vez de Fixed quando o destino pode estar sob throttling.
* O Power Automate **respeita o header `Retry-After`** retornado em respostas 429/503 de muitos conectores e da ação HTTP — nesses casos o backoff automático já faz o certo, e forçar um intervalo fixo menor pode piorar o throttling.
* O que a policy **não faz**: ela não inspeciona o *motivo* da falha. Um 400 por payload inválido vai ser retentado as 4 vezes configuradas, inutilmente. E ela não garante **idempotência** — se a ação teve efeito parcial antes de falhar (ex.: criou o registro mas o timeout veio na resposta), o retry pode criar um segundo registro.

**Padrão de retry por classificação de erro**

Para efeito colateral crítico (criar pedido, lançar nota, chamar API de pagamento), o padrão recomendado é:

1. **Desligue o retry automático na ação** e envolva a chamada num `Scope` configurado como Try.
2. No `Scope` de Catch (configure run after: *has failed / timed out*), use `result('Try')` para capturar o status code e o corpo do erro da ação que falhou.
3. **Classifique**: se o status estiver na faixa transiente (408, 429, 500, 502, 503, 504), entre num loop de retry manual com backoff exponencial — assim você controla quantas tentativas, o jitter e a condição de parada.
4. Se o status for permanente (4xx que não 408/429), **não repita**: registre em dead-letter (uma tabela do Dataverse ou fila) para tratamento humano/assíncrono e saia.

Esse controle manual parece mais trabalho que marcar "Exponential", mas é o que separa uma automação que se recupera sozinha de uma que gera incidente no plantão.

**Idempotência é pré-requisito, não opcional**

Qualquer retry sobre ação com efeito colateral exige idempotência — caso contrário você troca "falha" por "duplicata", que é pior porque é silenciosa. As ferramentas já discutidas em posts anteriores se aplicam aqui diretamente:

* **Alternate key + Upsert** no Dataverse, para que a reexecução reaproveite o mesmo registro em vez de criar outro.
* **Idempotency key** enviada em header para APIs REST que suportam (muitos gateways de pagamento e ERPs modernos deduplicam por essa chave).
* **Chave de negócio determinística** derivada do payload, nunca um GUID gerado dentro do loop de retry.

Sem isso, aumentar o número de tentativas só aumenta a superfície de corrupção.

**Circuit breaker: quando parar de tentar**

Retry individual resolve a falha pontual. Mas se o serviço de destino cai por completo, ter 500 execuções simultâneas fazendo retry exponencial transforma seu fluxo numa máquina de DDoS contra o próprio parceiro — e você ainda queima ações consumidas e conector premium à toa. O padrão **circuit breaker** cobre isso: um estado compartilhado (uma coluna/registro no Dataverse, por exemplo) que, após N falhas consecutivas num intervalo, "abre o circuito" e faz os fluxos subsequentes desviarem direto para a dead-letter sem nem tentar, por um período de cool-down. Após o cool-down, uma tentativa de sondagem reabre o fluxo normal se o destino voltou.

Em Power Automate isso não é nativo, mas é implementável com uma tabela de estado e uma trigger condition que checa o circuito antes de rodar a lógica cara. Para integrações de altíssimo volume, considere mover a orquestração para Azure Logic Apps ou Service Bus, onde esses padrões têm suporte mais maduro.

**Roteiro de decisão**

* Fluxo sem efeito colateral (só leitura/notificação): retry policy **Exponential** nativa resolve bem.
* Fluxo com efeito colateral e volume moderado: **retry manual classificado + idempotência + dead-letter**.
* Integração crítica de alto volume ou destino instável: adicione **circuit breaker** e avalie Logic Apps/Service Bus.
* Em qualquer caso: nunca retente cegamente um 4xx permanente, e sempre registre o que caiu na dead-letter com contexto suficiente para reprocessar.

Arquitetar resiliência não é marcar uma caixa de seleção — é desenhar como cada classe de falha deve ser tratada. Se a sua empresa depende de automações críticas e você quer blindá-las contra as falhas inevitáveis de produção, a Dynamic Soluções apoia esse desenho de ponta a ponta, do diagnóstico ao suporte contínuo.



A corporate flow that runs thousands of times a day will fail — that's a certainty, not a hypothesis. The real question isn't *whether* it fails, but *how* your flow reacts to that failure. And the biggest mistake we see in production environments is treating every failure the same way: a blind, generic retry wrapped around everything. That pattern hides real bugs, duplicates side effects and, worse, makes the flow look healthy while silently corrupting data.

In this post the focus is the difference between a **transient failure** and a **permanent failure**, and how to build a retry strategy that respects that distinction — something that goes well beyond the "Retry Policy" field on the action.

**Transient vs permanent: the distinction that changes everything**

A transient failure is temporary by nature: the target service was overloaded, there was momentary throttling (HTTP 429), a network timeout, or a brief outage (HTTP 503). Repeating the same operation a few seconds later has a high chance of success, because *the request itself was correct*.

A permanent failure is deterministic: the payload is malformed (HTTP 400), the record doesn't exist (404), you lack permission (403), or the business rule at the destination rejected the data (409/422). Repeating *the exact same request* will fail in exactly the same way, forever. Retrying a permanent failure wastes executions, connector cost and, in scenarios with partial side effects, risks duplication.

The native Power Automate retry policy (Default, Fixed Interval, Exponential) **does not make this distinction**. It reruns the action on any failure within the configured range. That's why a serious retry strategy starts by separating the two worlds.

**What the native retry policy covers — and what it doesn't**

* The **Exponential** policy is the default choice for HTTP/connector calls: it spaces attempts out progressively, giving the service time to recover and respecting backpressure. Use it instead of Fixed when the destination may be under throttling.
* Power Automate **honors the `Retry-After` header** returned in 429/503 responses from many connectors and the HTTP action — in those cases the automatic backoff already does the right thing, and forcing a shorter fixed interval can make throttling worse.
* What the policy **doesn't do**: it never inspects the *reason* for the failure. A 400 caused by an invalid payload will be retried the 4 configured times, uselessly. And it does not guarantee **idempotency** — if the action had a partial effect before failing (e.g. it created the record but the timeout hit the response), the retry may create a second record.

**A retry pattern based on error classification**

For critical side effects (creating an order, posting an invoice, calling a payment API), the recommended pattern is:

1. **Turn off the automatic retry on the action** and wrap the call in a `Scope` configured as Try.
2. In the Catch `Scope` (configure run after: *has failed / timed out*), use `result('Try')` to capture the status code and error body of the failed action.
3. **Classify**: if the status falls in the transient range (408, 429, 500, 502, 503, 504), enter a manual retry loop with exponential backoff — this way you control the attempt count, the jitter and the stop condition.
4. If the status is permanent (4xx other than 408/429), **don't retry**: log it to dead-letter (a Dataverse table or queue) for human/asynchronous handling and exit.

This manual control looks like more work than ticking "Exponential", but it's what separates an automation that recovers on its own from one that triggers an on-call incident.

**Idempotency is a prerequisite, not an option**

Any retry over an action with side effects requires idempotency — otherwise you trade "failure" for "duplicate", which is worse because it's silent. The tools already discussed in previous posts apply directly here:

* **Alternate key + Upsert** in Dataverse, so a rerun reuses the same record instead of creating another.
* **Idempotency key** sent in a header to REST APIs that support it (many payment gateways and modern ERPs deduplicate by that key).
* **Deterministic business key** derived from the payload, never a GUID generated inside the retry loop.

Without this, raising the attempt count only enlarges the corruption surface.

**Circuit breaker: when to stop trying**

Individual retry handles the one-off failure. But if the target service goes completely down, having 500 concurrent executions all doing exponential retry turns your flow into a DDoS machine against your own partner — and you still burn consumed actions and premium connector cost for nothing. The **circuit breaker** pattern covers this: a shared state (a Dataverse column/record, for instance) that, after N consecutive failures within an interval, "opens the circuit" and makes subsequent flows route straight to dead-letter without even trying, for a cool-down period. After the cool-down, a probe attempt reopens normal flow if the destination has recovered.

In Power Automate this isn't native, but it's implementable with a state table and a trigger condition that checks the circuit before running the expensive logic. For very high-volume integrations, consider moving the orchestration to Azure Logic Apps or Service Bus, where these patterns have more mature support.

**Decision guide**

* Flow with no side effects (read-only/notification): the native **Exponential** retry policy works well.
* Flow with side effects and moderate volume: **classified manual retry + idempotency + dead-letter**.
* Critical high-volume integration or unstable destination: add a **circuit breaker** and evaluate Logic Apps/Service Bus.
* In every case: never blindly retry a permanent 4xx, and always log what failed to dead-letter with enough context to reprocess.

Architecting resilience isn't ticking a checkbox — it's designing how each class of failure should be handled. If your company depends on critical automations and you want them hardened against the inevitable failures of production, Dynamic Soluções supports that design end to end, from diagnosis to ongoing support.
