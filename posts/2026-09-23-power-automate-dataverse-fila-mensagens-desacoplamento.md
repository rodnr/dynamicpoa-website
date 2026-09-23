---
title: "Power Automate: use Dataverse como fila de mensagens confiavel"
description: "Como transformar uma tabela do Dataverse em fila de mensagens para desacoplar automacoes criticas, garantir retry, controle de concorrencia e observabilidade no Power Automate."
date: '2026-09-23 17:48:19'
---
Quando uma automacao critica dispara diretamente a partir de um gatilho e faz todo o trabalho de forma sincrona — validar, chamar API externa, gravar em varios lugares — voce esta apostando que nada vai falhar no meio do caminho. Em producao, essa aposta cedo ou tarde da errado: a API externa fica indisponivel, o throttling do Dataverse aparece num pico, ou o fluxo estoura o timeout. Sem um ponto de persistencia intermediario, cada falha vira retrabalho manual e, pior, risco de processamento parcial. A alternativa madura e desacoplar recepcao de processamento usando o Dataverse como fila de mensagens.

**Por que uma tabela do Dataverse, e nao o Service Bus?**

O Azure Service Bus continua sendo a resposta certa para volumes altos, ordenacao estrita e cenarios sistemicos — ja tratamos disso ao falar de Logic Apps. Mas para muitas automacoes corporativas de volume moderado que ja vivem inteiramente na Power Platform, subir um Service Bus significa novo recurso Azure, connector premium, credenciais e mais uma peca de governanca. Uma tabela do Dataverse resolve o problema com o que voce ja tem: persistencia transacional, seguranca por security roles, auditoria nativa (change tracking) e visibilidade direta pelos apps model-driven. Voce troca throughput bruto por simplicidade operacional e observabilidade — um trade-off que faz sentido em boa parte dos casos.

**O desenho da fila**

A ideia central e separar dois fluxos:

1. **Fluxo produtor (enfileirar)**: o gatilho de negocio (um registro criado, um webhook, um item de SharePoint) faz apenas uma coisa — criar uma linha na tabela de fila com o payload e status `Pending`. Ele e curto, rapido e raramente falha, entao o usuario ou o sistema de origem recebe confirmacao imediata.
2. **Fluxo consumidor (processar)**: roda em intervalo (scheduled) ou por gatilho de criacao na tabela de fila, pega as mensagens `Pending`, faz o trabalho pesado e atualiza o status para `Completed` ou `Failed`.

A tabela de fila costuma ter colunas como: `Payload` (texto multiline com o JSON), `Status` (choice: Pending/Processing/Completed/Failed/Dead-letter), `AttemptCount` (whole number), `NextAttemptAt` (datetime), `LastError` (multiline) e uma `MessageKey` como alternate key para idempotencia.

**Controle de concorrencia: o problema do double-pick**

O risco classico de uma fila caseira e duas execucoes do consumidor pegarem a mesma mensagem. Sem cuidado, um scheduled flow que roda a cada 5 minutos e demora 6 minutos vai processar a mesma linha duas vezes. Duas defesas praticas:

* **Marcar antes de processar**: assim que o consumidor le uma mensagem `Pending`, o primeiro passo e um Update para `Processing`. Combine isso com a configuracao de concorrencia do gatilho (Concurrency Control) para limitar o paralelismo do Apply to each.
* **Idempotencia com alternate key**: a acao final que grava o resultado no sistema de destino deve usar Upsert por `MessageKey`, nao Create. Assim, mesmo que uma mensagem seja processada duas vezes por uma condicao de corrida, o efeito colateral acontece uma unica vez. Esse padrao de alternate key + Upsert e o que garante que o "pelo menos uma vez" da fila nao vire "efeito duplicado".

**Retry inteligente e dead-letter**

A vantagem de persistir a mensagem e poder tentar de novo sem perder nada. Quando o processamento falha, o consumidor:

* incrementa `AttemptCount`;
* grava a mensagem de erro em `LastError`;
* calcula um `NextAttemptAt` com backoff exponencial (por exemplo, 5, 15, 45 minutos);
* volta o status para `Pending` — mas o filtro do consumidor so pega mensagens `Pending` com `NextAttemptAt` no passado.

Quando `AttemptCount` ultrapassa um limite (digamos, 5), o status vira `Dead-letter` em vez de `Pending`. Mensagens em dead-letter param de ser reprocessadas automaticamente e viram um alerta acionavel para o time — exatamente como uma fila real. Um app model-driven simples sobre a tabela da a quem opera a visao de tudo que travou, com o erro, o payload e um botao para reenfileirar manualmente.

**Governanca e ALM**

Mantenha a tabela de fila, os dois fluxos e o app de monitoramento dentro de uma mesma solucao gerenciada, parametrizados por environment variables e connection references. Extraia o processamento pesado para um child flow com contrato claro de entrada/saida — assim o consumidor cuida so da mecanica da fila (pegar, marcar, retry) e a logica de negocio fica isolada e testavel. Fique atento ao custo: cada Update de status e cada tentativa consomem chamadas de API do Dataverse e acoes do Power Automate, entao dimensione o intervalo do scheduled flow e o batch de mensagens por execucao de acordo com o volume real.

**Quando essa arquitetura vale a pena**

Adote a fila no Dataverse quando a automacao chama sistemas externos instaveis, quando o processamento e demorado ou pesado, quando voce precisa de rastreabilidade de cada mensagem e retry controlado, ou quando picos de volume derrubam o fluxo sincrono. Fique no fluxo direto quando a operacao e simples, rapida e sem dependencia externa fragil. E migre para Service Bus quando o volume, a ordenacao estrita ou a latencia exigirem um broker de verdade.

Desacoplar recepcao de processamento e um dos saltos de maturidade mais importantes numa arquitetura de automacoes. Se sua empresa depende de fluxos criticos que hoje falham em silencio ou exigem reprocessamento manual, a equipe da Dynamic Solucoes pode ajudar a desenhar esse padrao de fila, retry e observabilidade sob medida para o seu ambiente Power Platform.



When a critical automation fires straight from a trigger and does all the work synchronously — validate, call an external API, write to several places — you're betting that nothing will fail along the way. In production that bet eventually loses: the external API goes down, Dataverse throttling shows up during a spike, or the flow hits the timeout. Without an intermediate point of persistence, every failure becomes manual rework and, worse, a risk of partial processing. The mature alternative is to decouple reception from processing by using Dataverse as a message queue.

**Why a Dataverse table and not Service Bus?**

Azure Service Bus is still the right answer for high volume, strict ordering and systemic scenarios — we've covered that when discussing Logic Apps. But for many moderate-volume corporate automations that already live entirely inside the Power Platform, standing up a Service Bus means a new Azure resource, a premium connector, credentials and yet another governance piece. A Dataverse table solves the problem with what you already have: transactional persistence, security through security roles, native auditing (change tracking) and direct visibility through model-driven apps. You trade raw throughput for operational simplicity and observability — a trade-off that makes sense in a good share of cases.

**The queue design**

The core idea is to split into two flows:

1. **Producer flow (enqueue)**: the business trigger (a record created, a webhook, a SharePoint item) does just one thing — create a row in the queue table with the payload and `Pending` status. It's short, fast and rarely fails, so the user or source system gets immediate confirmation.
2. **Consumer flow (process)**: runs on a schedule or on a create trigger on the queue table, picks up `Pending` messages, does the heavy work and updates the status to `Completed` or `Failed`.

The queue table usually has columns like: `Payload` (multiline text with the JSON), `Status` (choice: Pending/Processing/Completed/Failed/Dead-letter), `AttemptCount` (whole number), `NextAttemptAt` (datetime), `LastError` (multiline) and a `MessageKey` as an alternate key for idempotency.

**Concurrency control: the double-pick problem**

The classic risk of a homemade queue is two consumer runs picking up the same message. Without care, a scheduled flow that runs every 5 minutes but takes 6 will process the same row twice. Two practical defenses:

* **Mark before processing**: as soon as the consumer reads a `Pending` message, the first step is an Update to `Processing`. Combine that with the trigger's Concurrency Control setting to limit the Apply to each parallelism.
* **Idempotency with alternate key**: the final action that writes the result to the target system should use Upsert by `MessageKey`, not Create. That way, even if a message gets processed twice by a race condition, the side effect happens exactly once. This alternate key + Upsert pattern is what keeps the queue's "at least once" from turning into a "duplicated effect."

**Smart retry and dead-letter**

The benefit of persisting the message is being able to try again without losing anything. When processing fails, the consumer:

* increments `AttemptCount`;
* writes the error message to `LastError`;
* computes a `NextAttemptAt` with exponential backoff (say, 5, 15, 45 minutes);
* sets the status back to `Pending` — but the consumer filter only picks up `Pending` messages whose `NextAttemptAt` is in the past.

When `AttemptCount` exceeds a limit (say, 5), the status becomes `Dead-letter` instead of `Pending`. Dead-lettered messages stop being reprocessed automatically and become an actionable alert for the team — exactly like a real queue. A simple model-driven app over the table gives operators a view of everything that got stuck, with the error, the payload and a button to manually re-enqueue.

**Governance and ALM**

Keep the queue table, both flows and the monitoring app within the same managed solution, parameterized by environment variables and connection references. Extract the heavy processing into a child flow with a clear input/output contract — that way the consumer only handles the queue mechanics (pick, mark, retry) and the business logic stays isolated and testable. Watch the cost: every status Update and every attempt consume Dataverse API calls and Power Automate actions, so size the scheduled flow interval and the batch of messages per run according to real volume.

**When this architecture is worth it**

Adopt the Dataverse queue when the automation calls unstable external systems, when processing is slow or heavy, when you need traceability of each message and controlled retry, or when volume spikes take down the synchronous flow. Stay with the direct flow when the operation is simple, fast and free of fragile external dependencies. And move to Service Bus when volume, strict ordering or latency demand a real broker.

Decoupling reception from processing is one of the most important maturity leaps in an automation architecture. If your company relies on critical flows that today fail silently or require manual reprocessing, the Dynamic Solucoes team can help design this queue, retry and observability pattern tailored to your Power Platform environment.
