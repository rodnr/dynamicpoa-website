---
title: "Power Automate: Service Bus para integracoes assincronas em escala"
description: "Como integrar Power Automate com Azure Service Bus para desacoplar sistemas em escala: filas vs topicos, sessions, dead-letter, peek-lock e controle de custo."
date: '2026-09-27 17:38:58'
---
Quando uma automacao precisa conversar com sistemas que nao respondem na mesma cadencia — um ERP que processa em lote, um servico externo com throttling agressivo, ou multiplos consumidores que reagem ao mesmo evento — colocar tudo dentro de um unico fluxo sincrono e receita para timeout e reprocessamento duplicado. O **Azure Service Bus** e o broker de mensagens gerenciado da Microsoft para exatamente esse cenario, e o conector do Power Automate o torna acessivel sem escrever uma linha de infraestrutura. A questao nao e *se* ele resolve, e sim *como* estruturar a integracao para nao herdar os problemas classicos de filas mal desenhadas.

**Por que Service Bus e nao a tabela de fila no Dataverse**

Ja cobrimos aqui usar uma tabela do Dataverse como fila de mensagens, e para muitos casos ela basta. O Service Bus entra quando voce precisa de garantias que o Dataverse nao entrega nativamente:

* **Ordenacao garantida** por meio de sessions (FIFO real por chave de sessao).
* **Fan-out desacoplado** com topics e subscriptions: um produtor publica uma vez, N consumidores independentes recebem sua copia.
* **Dead-letter queue nativa**, com contagem de entrega e razao de falha, sem voce modelar isso a mao.
* **Throughput alto e latencia baixa** sem consumir capacidade do Dataverse nem gerar custo de armazenamento transacional.
* **Interoperabilidade** com sistemas fora da Power Platform (Azure Functions, Logic Apps, aplicacoes .NET) que ja falam AMQP.

Se a integracao e interna, de baixo volume e vive dentro do ecossistema Power Platform, fique no Dataverse. Se ha sistemas externos, ordenacao critica ou fan-out para varios consumidores, o Service Bus paga o custo adicional.

**Queue vs Topic: a decisao de topologia**

A primeira escolha e entre **queue** (um-para-um) e **topic** (um-para-muitos):

* **Queue** — uma unica mensagem e consumida por um unico receptor. Use para comando: "processe este pedido". Se houver varios workers lendo a mesma fila, o Service Bus faz o balanceamento (competing consumers), mas cada mensagem so vai para um deles.
* **Topic + subscriptions** — a mensagem e copiada para cada subscription que casa com a regra de filtro. Use para evento: "pedido aprovado" que precisa disparar faturamento, notificacao ao cliente e atualizacao de estoque de forma independente. Cada subscription tem sua propria dead-letter e seu proprio ritmo de consumo.

Um erro comum e usar uma queue e depois tentar ramificar dentro do fluxo com condicoes — isso reacopla o que voce estava tentando separar. Se os consumidores tem ciclos de vida diferentes, use topic.

**Peek-lock, complete e o perigo do auto-complete**

O trigger "When a message is received in a queue (auto-complete)" e conveniente e perigoso. Em auto-complete, a mensagem e marcada como consumida assim que o Power Automate a recebe — antes de o fluxo processar nada. Se o fluxo falha no meio, a mensagem *ja foi*, e voce perdeu o trabalho.

Para automacoes criticas, use o modo **peek-lock**:

1. O trigger recebe a mensagem com um lock temporario (a mensagem fica invisivel para outros consumidores).
2. O fluxo processa a logica de negocio.
3. Em caso de sucesso, chame a acao **Complete the message** com o lock token.
4. Em caso de erro tratado, chame **Abandon** (a mensagem volta para a fila e sera reentregue) ou **Dead-letter** (move para a DLQ com uma razao).

O lock tem um tempo de expiracao (lock duration). Se o processamento demora mais que isso, o lock expira, a mensagem e reentregue e voce ganha um processamento duplicado silencioso. Ajuste a lock duration para acima do pior caso de tempo de fluxo, ou renove o lock em processamentos longos.

**Idempotencia continua sendo obrigatoria**

Service Bus garante entrega *at-least-once*, nao *exactly-once*. Reentrega por lock expirado, por abandon ou por retry de rede acontece. Isso significa que o consumidor precisa ser idempotente: usar o `MessageId` (ou uma chave de negocio) para verificar se aquela mensagem ja foi processada antes de aplicar o efeito colateral. No Dataverse, o padrao natural e uma alternate key com Upsert — reprocessar a mesma mensagem simplesmente sobrescreve o mesmo registro em vez de criar duplicata. Sem idempotencia, qualquer garantia de fila vira uma fonte de dados duplicados.

**Dead-letter: o que fazer com o que falhou**

Toda queue e subscription tem uma dead-letter queue associada. Mensagens vao para la quando excedem `MaxDeliveryCount` (falhas repetidas) ou quando o consumidor as envia explicitamente. A DLQ nao se auto-resolve — ela e um deposito de problemas que exige um segundo fluxo:

* Um fluxo dedicado que le a DLQ (o path da DLQ e `<fila>/$deadletterqueue`), registra o motivo (`DeadLetterReason`, `DeadLetterErrorDescription`) e notifica o time.
* Uma decisao humana ou automatica de reprocessar (reenviar para a fila principal) ou descartar.

Ignorar a DLQ e o equivalente a ter um try-catch que engole a excecao: parece que funciona ate o dia em que alguem pergunta por que um lote inteiro de pedidos sumiu.

**Sessions para ordenacao por entidade**

Se voce precisa processar todos os eventos de um mesmo pedido na ordem em que ocorreram, mas eventos de pedidos diferentes podem correr em paralelo, use **sessions**. O produtor define o `SessionId` (por exemplo, o ID do pedido); o Service Bus garante FIFO dentro de cada sessao e permite paralelismo entre sessoes. No conector, use o trigger com session habilitado. Sem sessions, mensagens de uma queue com multiplos consumidores podem ser processadas fora de ordem — perfeitamente aceitavel para comandos independentes, desastroso para uma sequencia de estados.

**Custo: connector premium e tier do namespace**

Dois custos se somam aqui. O conector do Service Bus e **premium** no Power Automate, entao cada execucao consome contra o plano Premium por usuario, Process por fluxo ou pay-as-you-go — o mesmo racional que discutimos ao falar de otimizacao de conectores premium. Do lado do Azure, o tier do namespace importa: **Standard** cobra por operacao e nao suporta alguns recursos avancados; **Premium** oferece isolamento de recursos, throughput previsivel e e obrigatorio para cenarios de alto volume. Um erro classico e desenhar um fluxo com polling agressivo de uma queue quase sempre vazia — cada verificacao e uma operacao cobrada e uma acao consumida. Prefira o trigger baseado em evento a loops de polling manual.

**Roteiro de decisao**

1. A integracao e interna, de baixo volume e vive na Power Platform? Fila no Dataverse.
2. Ha sistemas externos, fan-out ou ordenacao critica? Service Bus.
3. Um consumidor por mensagem? Queue. Varios consumidores independentes? Topic + subscriptions.
4. A automacao e critica? Peek-lock com Complete/Abandon/Dead-letter explicitos, nunca auto-complete.
5. Ordem por entidade importa? Sessions com SessionId.
6. Sempre: consumidor idempotente por MessageId ou alternate key, e um fluxo de tratamento da DLQ.

Desenhar integracoes assincronas resilientes e menos sobre o conector e mais sobre garantias de entrega, idempotencia e o que acontece quando algo falha. Se sua empresa esta conectando Power Platform a sistemas criticos e quer arquitetar isso sem acumular divida tecnica, a Dynamic Solucoes pode ajudar a desenhar a topologia certa e sustentar a operacao com nossos planos de suporte.



When an automation needs to talk to systems that don't respond at the same pace — an ERP that processes in batches, an external service with aggressive throttling, or multiple consumers reacting to the same event — cramming everything into a single synchronous flow is a recipe for timeouts and duplicate reprocessing. **Azure Service Bus** is Microsoft's managed message broker for exactly this scenario, and the Power Automate connector makes it accessible without writing a line of infrastructure. The question isn't *whether* it solves the problem, but *how* to structure the integration so you don't inherit the classic problems of poorly designed queues.

**Why Service Bus and not a queue table in Dataverse**

We've covered using a Dataverse table as a message queue here, and for many cases it's enough. Service Bus comes in when you need guarantees Dataverse doesn't deliver natively:

* **Guaranteed ordering** through sessions (real FIFO per session key).
* **Decoupled fan-out** with topics and subscriptions: a producer publishes once, N independent consumers each get their copy.
* **Native dead-letter queue**, with delivery count and failure reason, without you modeling it by hand.
* **High throughput and low latency** without consuming Dataverse capacity or generating transactional storage cost.
* **Interoperability** with systems outside Power Platform (Azure Functions, Logic Apps, .NET applications) that already speak AMQP.

If the integration is internal, low-volume and lives inside the Power Platform ecosystem, stay in Dataverse. If there are external systems, critical ordering or fan-out to multiple consumers, Service Bus pays for the extra cost.

**Queue vs Topic: the topology decision**

The first choice is between **queue** (one-to-one) and **topic** (one-to-many):

* **Queue** — a single message is consumed by a single receiver. Use it for commands: "process this order." If multiple workers read the same queue, Service Bus balances them (competing consumers), but each message goes to only one.
* **Topic + subscriptions** — the message is copied to each subscription that matches the filter rule. Use it for events: "order approved" that needs to trigger billing, customer notification and stock update independently. Each subscription has its own dead-letter and its own consumption pace.

A common mistake is using a queue and then branching inside the flow with conditions — this re-couples what you were trying to separate. If consumers have different lifecycles, use a topic.

**Peek-lock, complete and the danger of auto-complete**

The "When a message is received in a queue (auto-complete)" trigger is convenient and dangerous. In auto-complete, the message is marked as consumed as soon as Power Automate receives it — before the flow processes anything. If the flow fails midway, the message is *gone*, and you've lost the work.

For critical automations, use **peek-lock** mode:

1. The trigger receives the message with a temporary lock (the message becomes invisible to other consumers).
2. The flow processes the business logic.
3. On success, call the **Complete the message** action with the lock token.
4. On a handled error, call **Abandon** (the message returns to the queue and will be redelivered) or **Dead-letter** (moves it to the DLQ with a reason).

The lock has an expiration time (lock duration). If processing takes longer than that, the lock expires, the message is redelivered and you get a silent duplicate processing. Set the lock duration above the worst-case flow time, or renew the lock in long-running processing.

**Idempotency is still mandatory**

Service Bus guarantees *at-least-once* delivery, not *exactly-once*. Redelivery from an expired lock, from an abandon or from a network retry happens. This means the consumer must be idempotent: use the `MessageId` (or a business key) to check whether that message was already processed before applying the side effect. In Dataverse, the natural pattern is an alternate key with Upsert — reprocessing the same message simply overwrites the same record instead of creating a duplicate. Without idempotency, any queue guarantee becomes a source of duplicate data.

**Dead-letter: what to do with what failed**

Every queue and subscription has an associated dead-letter queue. Messages go there when they exceed `MaxDeliveryCount` (repeated failures) or when the consumer explicitly sends them. The DLQ doesn't self-resolve — it's a deposit of problems that requires a second flow:

* A dedicated flow that reads the DLQ (the DLQ path is `<queue>/$deadletterqueue`), logs the reason (`DeadLetterReason`, `DeadLetterErrorDescription`) and notifies the team.
* A human or automatic decision to reprocess (resend to the main queue) or discard.

Ignoring the DLQ is the equivalent of having a try-catch that swallows the exception: it looks like it works until the day someone asks why an entire batch of orders vanished.

**Sessions for per-entity ordering**

If you need to process all events for the same order in the order they occurred, but events from different orders can run in parallel, use **sessions**. The producer sets the `SessionId` (for example, the order ID); Service Bus guarantees FIFO within each session and allows parallelism across sessions. In the connector, use the session-enabled trigger. Without sessions, messages from a queue with multiple consumers can be processed out of order — perfectly acceptable for independent commands, disastrous for a state sequence.

**Cost: premium connector and namespace tier**

Two costs add up here. The Service Bus connector is **premium** in Power Automate, so each run counts against the Premium per user plan, Process per flow or pay-as-you-go — the same rationale we discussed when talking about optimizing premium connectors. On the Azure side, the namespace tier matters: **Standard** charges per operation and doesn't support some advanced features; **Premium** offers resource isolation, predictable throughput and is mandatory for high-volume scenarios. A classic mistake is designing a flow with aggressive polling of an almost-always-empty queue — each check is a billed operation and a consumed action. Prefer the event-based trigger to manual polling loops.

**Decision roadmap**

1. Is the integration internal, low-volume and living in Power Platform? Dataverse queue.
2. Are there external systems, fan-out or critical ordering? Service Bus.
3. One consumer per message? Queue. Several independent consumers? Topic + subscriptions.
4. Is the automation critical? Peek-lock with explicit Complete/Abandon/Dead-letter, never auto-complete.
5. Does per-entity order matter? Sessions with SessionId.
6. Always: idempotent consumer by MessageId or alternate key, and a DLQ handling flow.

Designing resilient asynchronous integrations is less about the connector and more about delivery guarantees, idempotency and what happens when something fails. If your company is connecting Power Platform to critical systems and wants to architect this without accumulating technical debt, Dynamic Soluções can help design the right topology and sustain the operation with our support plans.
