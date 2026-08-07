---
title: "Power Automate: tratamento de erros com scopes e Try-Catch-Finally"
description: "Fluxos corporativos falham em silêncio sem uma estratégia de erros. Veja como aplicar o padrão Try-Catch-Finally com scopes, retry policies e notificações no Power Automate."
date: '2026-07-20 15:10:48'
---
Em ambientes de produção, o que separa uma automação amadora de uma automação corporativa raramente é a lógica de negócio — é o tratamento de erros. Um fluxo que funciona no happy path mas falha em silêncio quando uma API retorna 429 ou um registro não existe no Dataverse é uma bomba-relógio. Neste post, mostramos como estruturar tratamento de erros robusto no Power Automate usando o padrão Try-Catch-Finally com scopes, configurações de run after e retry policies.

**Por que o comportamento padrão não é suficiente**

Por padrão, quando uma ação falha no Power Automate, o fluxo inteiro para e é marcado como *Failed*. Isso pode ser aceitável em automações simples, mas em fluxos críticos — integrações financeiras, provisionamento de usuários, sincronização entre sistemas — parar sem registrar o que aconteceu, sem notificar ninguém e sem desfazer estados parciais é inaceitável.

O problema é que muitos desenvolvedores tratam erro ação por ação, com dezenas de branches *Configure run after* espalhados. Isso vira um pesadelo de manutenção. A abordagem escalável é isolar blocos lógicos em scopes e centralizar o tratamento.

**O padrão Try-Catch-Finally com scopes**

Um *Scope* no Power Automate agrupa ações e propaga o status agregado do bloco (Succeeded, Failed, Skipped, TimedOut). A partir disso, você monta três scopes principais:

1. **Try** — contém toda a lógica de negócio principal (chamadas de API, operações Dataverse, cálculos).
2. **Catch** — configurado com *Configure run after* para rodar apenas quando o scope Try tiver status **has failed**, **is skipped** ou **has timed out**. Aqui você registra o erro, notifica e faz rollback.
3. **Finally** — configurado para rodar **is successful**, **has failed**, **is skipped** e **has timed out** do Catch, garantindo que sempre execute (limpeza, log de encerramento, atualização de status).

Essa estrutura reproduz o try/catch/finally de linguagens tradicionais e mantém o fluxo legível mesmo com dezenas de ações dentro do Try.

**Como capturar o detalhe do erro que realmente falhou**

Dentro do Catch, a mágica está na função `result()`. Ao usar `result('Try')` você obtém um array com o resultado de cada ação executada dentro do scope Try, incluindo status, código e mensagem de erro. Combinado com um *Filter array* que seleciona apenas os itens com `status` igual a `Failed`, você extrai exatamente qual ação quebrou e por quê — sem adivinhação.

Uma expressão útil para o corpo da notificação:

* `body('Filtrar_falhas')` para listar todas as ações falhas;
* `first(body('Filtrar_falhas'))?['error']?['message']` para pegar a mensagem da primeira falha;
* `workflow()?['run']?['name']` para incluir o Run ID e facilitar o rastreamento no histórico.

**Retry policies: antes de cair no Catch**

Muitos erros são transitórios — throttling (429), timeouts de rede, indisponibilidade momentânea de serviço. Não faz sentido acionar o Catch e o rollback para uma falha que se resolveria com uma nova tentativa. Cada ação HTTP e vários conectores têm, em *Settings*, a configuração de **Retry Policy**:

* **Default** — até 4 tentativas com backoff exponencial;
* **Exponential Interval** — permite ajustar o intervalo mínimo, máximo e a contagem de retries;
* **Fixed Interval** — intervalo fixo, útil para APIs com limites bem definidos;
* **None** — desativa retries, indicado quando a operação não é idempotente e uma repetição causaria efeito colateral (ex.: cobrar um cartão duas vezes).

A regra prática: use retry para falhas transitórias e reserve o Catch para falhas reais de negócio ou erros permanentes.

**Idempotência e rollback no Catch**

O ponto mais negligenciado é o estado parcial. Se seu Try criou um registro no Dataverse, chamou uma API externa e então falhou na terceira ação, o Catch precisa desfazer o que foi feito para não deixar dados inconsistentes. Estratégias:

* Registre em variáveis os IDs criados durante o Try, para poder deletá-los ou reverter no Catch;
* Prefira operações idempotentes (upsert com chave alternativa no Dataverse em vez de create cego);
* Para integrações críticas, considere um padrão de *compensating transaction*, onde cada passo tem uma ação inversa correspondente.

**Notificação e observabilidade**

Um fluxo crítico que falha e ninguém fica sabendo é tão ruim quanto não ter fluxo. No Catch, além do log, envie uma notificação acionável — um card no Teams com o nome do fluxo, o Run ID, a ação que falhou e um link direto para o histórico de execução. Para volumes maiores, grave os erros em uma tabela Dataverse dedicada e construa um relatório no Power BI para identificar padrões de falha e reincidência.

**Boas práticas para escalar**

* Padronize o Try-Catch-Finally como template e reutilize-o via child flows (assunto que já cobrimos no blog);
* Nunca deixe o Catch falhar silenciosamente — teste-o forçando exceções propositais em homologação;
* Documente quais erros são recuperáveis (retry) e quais exigem intervenção manual;
* Combine com environment variables para parametrizar destinatários de notificação entre Dev/Test/Prod.

Tratamento de erros bem-feito é o que transforma uma prova de conceito em uma automação de produção confiável. Se sua empresa depende de fluxos críticos no Power Automate e precisa de arquitetura resiliente, governança e monitoramento contínuo, a Dynamic Soluções pode ajudar — seja por meio dos nossos planos de suporte ou do portal Self-Service de Power Platform, que une IA e especialistas humanos para entregar soluções mais rápido e com padrão corporativo.



In production environments, what separates an amateur automation from an enterprise-grade one is rarely the business logic — it's error handling. A flow that works on the happy path but fails silently when an API returns 429 or a record doesn't exist in Dataverse is a ticking time bomb. In this post, we show how to structure robust error handling in Power Automate using the Try-Catch-Finally pattern with scopes, run after settings, and retry policies.

**Why the default behavior isn't enough**

By default, when an action fails in Power Automate, the entire flow stops and is marked as *Failed*. That may be acceptable in simple automations, but in critical flows — financial integrations, user provisioning, cross-system synchronization — stopping without logging what happened, without notifying anyone, and without undoing partial states is unacceptable.

The problem is that many developers handle errors action by action, with dozens of *Configure run after* branches scattered around. This becomes a maintenance nightmare. The scalable approach is to isolate logical blocks into scopes and centralize the handling.

**The Try-Catch-Finally pattern with scopes**

A *Scope* in Power Automate groups actions and propagates the aggregate status of the block (Succeeded, Failed, Skipped, TimedOut). From that, you build three main scopes:

1. **Try** — contains all the main business logic (API calls, Dataverse operations, calculations).
2. **Catch** — configured with *Configure run after* to run only when the Try scope status is **has failed**, **is skipped**, or **has timed out**. Here you log the error, notify, and roll back.
3. **Finally** — configured to run on **is successful**, **has failed**, **is skipped**, and **has timed out** of the Catch, ensuring it always executes (cleanup, closing log, status update).

This structure reproduces the try/catch/finally of traditional languages and keeps the flow readable even with dozens of actions inside the Try.

**How to capture the detail of the action that actually failed**

Inside the Catch, the magic lies in the `result()` function. Using `result('Try')` gives you an array with the outcome of each action executed inside the Try scope, including status, code, and error message. Combined with a *Filter array* that selects only items with `status` equal to `Failed`, you extract exactly which action broke and why — no guessing.

Useful expressions for the notification body:

* `body('Filter_failures')` to list all failed actions;
* `first(body('Filter_failures'))?['error']?['message']` to grab the message of the first failure;
* `workflow()?['run']?['name']` to include the Run ID and make tracing in the history easier.

**Retry policies: before falling into the Catch**

Many errors are transient — throttling (429), network timeouts, momentary service unavailability. It makes no sense to trigger the Catch and rollback for a failure that would resolve itself with a retry. Each HTTP action and several connectors have, under *Settings*, a **Retry Policy** configuration:

* **Default** — up to 4 attempts with exponential backoff;
* **Exponential Interval** — lets you adjust the minimum, maximum interval, and retry count;
* **Fixed Interval** — fixed interval, useful for APIs with well-defined limits;
* **None** — disables retries, recommended when the operation is not idempotent and repeating it would cause a side effect (e.g., charging a card twice).

The rule of thumb: use retry for transient failures and reserve the Catch for real business failures or permanent errors.

**Idempotency and rollback in the Catch**

The most overlooked point is partial state. If your Try created a Dataverse record, called an external API, and then failed on the third action, the Catch needs to undo what was done to avoid leaving inconsistent data. Strategies:

* Store the IDs created during the Try in variables so you can delete them or revert in the Catch;
* Prefer idempotent operations (upsert with an alternate key in Dataverse instead of a blind create);
* For critical integrations, consider a *compensating transaction* pattern, where each step has a corresponding inverse action.

**Notification and observability**

A critical flow that fails and no one finds out is as bad as having no flow at all. In the Catch, beyond logging, send an actionable notification — a Teams card with the flow name, the Run ID, the action that failed, and a direct link to the run history. For larger volumes, record errors in a dedicated Dataverse table and build a Power BI report to identify failure patterns and recurrence.

**Best practices to scale**

* Standardize Try-Catch-Finally as a template and reuse it via child flows (a topic we've already covered on the blog);
* Never let the Catch fail silently — test it by forcing intentional exceptions in staging;
* Document which errors are recoverable (retry) and which require manual intervention;
* Combine it with environment variables to parameterize notification recipients across Dev/Test/Prod.

Proper error handling is what turns a proof of concept into a reliable production automation. If your company depends on critical Power Automate flows and needs resilient architecture, governance, and continuous monitoring, Dynamic Soluções can help — whether through our support plans or the Power Platform Self-Service portal, which combines AI and human experts to deliver solutions faster and to an enterprise standard.
