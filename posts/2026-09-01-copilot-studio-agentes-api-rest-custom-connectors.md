---
title: "Copilot Studio: como conectar agentes a APIs REST com custom connectors"
description: "Levar um agente do Copilot Studio além do Dataverse exige conectar APIs externas com governança. Veja padrões de action, autenticação e controle de custo por mensagem."
date: '2026-09-01 17:17:18'
---
Um agente conversacional que só responde com base em documentos e tabelas do Dataverse resolve uma fatia dos casos de uso. O salto de valor real acontece quando o agente do Copilot Studio consegue **executar ações contra sistemas de negócio** — abrir chamado num ITSM, consultar saldo num ERP, disparar um workflow em uma API própria. E é aí que entra a integração via actions apoiadas em custom connectors, um ponto que costuma ser subestimado em provas de conceito e vira o gargalo do projeto em produção.

**As três formas de dar ações a um agente**

No Copilot Studio, quando você adiciona uma action ao agente, tem essencialmente três caminhos para chamar um sistema externo:

1. **Connector action (prebuilt ou custom connector)** — o agente invoca uma operação de um conector da Power Platform. É o caminho mais direto e reaproveita todo o ecossistema de conectores já existente, incluindo custom connectors que você mesmo define a partir de um OpenAPI/Swagger.
2. **Flow action (Power Automate)** — o agente chama um fluxo, que por sua vez faz a orquestração (múltiplas chamadas, transformação, tratamento de erro) e devolve o resultado. Ideal quando a ação envolve mais de uma etapa ou lógica condicional.
3. **REST API / Connector Action direto** — para chamadas HTTP mais simples com contrato bem definido.

A decisão entre chamar o conector direto ou passar por um flow é o primeiro ponto de arquitetura. Chamar o custom connector direto tem menos latência e menos peças móveis, mas joga toda a responsabilidade de tratamento de erro e transformação para o próprio agente — que não é um bom lugar para lógica complexa. Passar por um Power Automate adiciona um salto e consome ações do fluxo, mas te dá try-catch, retry policy e transformação de payload num lugar testável e versionável em solução gerenciada.

**Custom connector: o contrato importa mais do que parece**

Quando o agente decide chamar uma action, o modelo generativo usa a **descrição da operação, dos parâmetros e do schema de resposta** para (a) decidir se aquela action é a certa para a intenção do usuário e (b) preencher os parâmetros a partir da conversa. Isso muda a forma como você escreve o custom connector:

* Nomes de operação e descrições precisam ser **semânticos e não ambíguos**. `GetOrderStatus` com descrição "Retorna o status atual de um pedido a partir do número do pedido" funciona muito melhor do que `Op123` sem descrição — o orquestrador literalmente lê esse texto para rotear.
* Parâmetros devem ter descrição e, quando possível, exemplos. Se o parâmetro é obrigatório, marque como required no OpenAPI — o agente vai pedir a informação que faltar ao usuário em vez de chamar com valor vazio.
* Restrinja o número de operações expostas ao agente. Um custom connector com 40 operações vira ruído para o orquestrador e aumenta o risco de a action errada ser escolhida. Exponha só o que o agente realmente precisa.

**Autenticação: não use credencial de serviço genérica sem pensar**

Este é o ponto que mais gera retrabalho. Há dois modelos conceituais:

* **Autenticação a nível de conexão** — o custom connector usa uma credencial fixa (API key, OAuth client credentials) configurada por quem publicou. Todas as chamadas do agente vão à API como o mesmo "service account". Simples, mas o sistema de destino não sabe quem é o usuário real, o que quebra qualquer regra de autorização por perfil e polui a auditoria.
* **Autenticação em nome do usuário (on-behalf-of / OAuth com Entra ID)** — o agente propaga a identidade do usuário autenticado, e a API aplica as permissões daquele usuário. É o modelo correto quando a API tem controle de acesso por registro e quando você precisa que a auditoria mostre quem de fato pediu a ação.

Para APIs internas expostas via Entra ID, registre o app, defina os escopos e configure o OAuth 2.0 no custom connector apontando para o Authorization/Token endpoint do tenant. Guarde segredos em Azure Key Vault referenciado por environment variable, nunca hardcoded no conector — isso também facilita a promoção entre ambientes Dev/Test/Prod sem editar o conector a cada deploy.

**Idempotência e efeitos colaterais**

Diferente de um flow disparado por evento, uma action de agente é acionada por linguagem natural — e o usuário pode reformular, repetir ou o próprio modelo pode chamar a operação mais de uma vez durante o raciocínio. Para qualquer operação com efeito colateral (criar registro, aprovar, cobrar), trate idempotência do lado da API: use uma chave de idempotência derivada da conversa, ou faça a API rejeitar duplicatas por natural key. Nunca assuma que o agente vai chamar sua operação de escrita exatamente uma vez.

Adicione também uma etapa de confirmação explícita no tópico antes de ações destrutivas ou irreversíveis. O Copilot Studio permite condicionar a chamada da action a uma confirmação do usuário — use isso para transações financeiras, exclusões e aprovações.

**Custo: cada resposta do agente conta**

O modelo de consumo do Copilot no ecossistema Power Platform é por mensagem/interação (via capacity packs ou pay-as-you-go em Azure). Uma conversa que dispara múltiplas actions e várias respostas generativas consome mais do que uma pergunta simples respondida por conhecimento. Isso tem implicações práticas de arquitetura:

* Concentre lógica de várias chamadas em um único flow em vez de fazer o agente encadear três actions numa mesma conversa — menos idas e voltas generativas.
* Monitore o consumo por agente e por tópico. Um tópico mal desenhado que entra em loop de reformulação é caro além de ruim para o usuário.
* Avalie se determinada intenção não deveria ser resolvida por um tópico determinístico (com fluxo fixo) em vez de generative orchestration — mais barato e mais previsível para processos críticos.

**Governança: agente é aplicação, trate como tal**

Um agente que chama APIs de negócio é uma aplicação corporativa, não um chatbot decorativo. Vale o mesmo rigor de ALM e DLP das demais soluções da Power Platform: publique o agente e seus custom connectors dentro de uma **solução gerenciada**, use environment variables para endpoints e segredos, aplique políticas de DLP que classifiquem o custom connector adequadamente e restrinja em quais ambientes o agente pode existir. Sem isso, você acaba com agentes criados por usuários em ambientes default chamando APIs internas sem visibilidade nenhuma da TI.

Conectar agentes do Copilot Studio a sistemas de negócio de forma segura, auditável e com custo sob controle é um trabalho de arquitetura, não de configuração de tela. Se sua empresa está avaliando levar Copilot para além do piloto e integrá-lo aos sistemas críticos, a Dynamic Soluções pode apoiar no desenho das actions, na estratégia de autenticação e na governança — via consultoria, planos de suporte contínuo ou pela nossa plataforma self-service de Power Platform.



A conversational agent that only answers based on documents and Dataverse tables covers a slice of the use cases. The real jump in value happens when a Copilot Studio agent can **execute actions against business systems** — open a ticket in an ITSM tool, check a balance in an ERP, trigger a workflow in your own API. That is where integration via actions backed by custom connectors comes in, and it is a point that is usually underestimated in proofs of concept and becomes the bottleneck of the project in production.

**The three ways to give actions to an agent**

In Copilot Studio, when you add an action to the agent, you essentially have three paths to call an external system:

1. **Connector action (prebuilt or custom connector)** — the agent invokes an operation from a Power Platform connector. It is the most direct path and reuses the entire existing connector ecosystem, including custom connectors you define yourself from an OpenAPI/Swagger.
2. **Flow action (Power Automate)** — the agent calls a flow, which in turn handles the orchestration (multiple calls, transformation, error handling) and returns the result. Ideal when the action involves more than one step or conditional logic.
3. **Direct REST API / connector action** — for simpler HTTP calls with a well-defined contract.

Deciding between calling the connector directly or going through a flow is the first architectural point. Calling the custom connector directly means lower latency and fewer moving parts, but it pushes all error handling and transformation responsibility onto the agent itself — which is not a good place for complex logic. Going through a Power Automate flow adds a hop and consumes flow actions, but it gives you try-catch, retry policy and payload transformation in a place that is testable and versionable inside a managed solution.

**Custom connector: the contract matters more than it seems**

When the agent decides to call an action, the generative model uses the **operation description, the parameters and the response schema** to (a) decide whether that action is the right one for the user's intent and (b) fill the parameters from the conversation. This changes how you write the custom connector:

* Operation names and descriptions must be **semantic and unambiguous**. `GetOrderStatus` with the description "Returns the current status of an order given the order number" works much better than `Op123` with no description — the orchestrator literally reads that text to route.
* Parameters should have descriptions and, where possible, examples. If a parameter is mandatory, mark it as required in OpenAPI — the agent will ask the user for the missing information instead of calling with an empty value.
* Restrict the number of operations exposed to the agent. A custom connector with 40 operations becomes noise for the orchestrator and increases the risk of the wrong action being chosen. Expose only what the agent actually needs.

**Authentication: don't use a generic service credential without thinking**

This is the point that generates the most rework. There are two conceptual models:

* **Connection-level authentication** — the custom connector uses a fixed credential (API key, OAuth client credentials) configured by whoever published it. All agent calls hit the API as the same "service account". Simple, but the target system does not know who the real user is, which breaks any per-profile authorization rule and pollutes auditing.
* **On-behalf-of authentication (OAuth with Entra ID)** — the agent propagates the authenticated user's identity, and the API applies that user's permissions. This is the correct model when the API has record-level access control and when you need auditing to show who actually requested the action.

For internal APIs exposed via Entra ID, register the app, define the scopes and configure OAuth 2.0 in the custom connector pointing to the tenant's Authorization/Token endpoint. Store secrets in Azure Key Vault referenced by an environment variable, never hardcoded in the connector — this also makes promotion across Dev/Test/Prod environments easier without editing the connector on every deploy.

**Idempotency and side effects**

Unlike an event-triggered flow, an agent action is triggered by natural language — and the user may rephrase, repeat, or the model itself may call the operation more than once during its reasoning. For any operation with side effects (create record, approve, charge), handle idempotency on the API side: use an idempotency key derived from the conversation, or have the API reject duplicates by natural key. Never assume the agent will call your write operation exactly once.

Also add an explicit confirmation step in the topic before destructive or irreversible actions. Copilot Studio lets you condition the action call on user confirmation — use this for financial transactions, deletions and approvals.

**Cost: every agent response counts**

The Copilot consumption model in the Power Platform ecosystem is per message/interaction (via capacity packs or pay-as-you-go in Azure). A conversation that triggers multiple actions and several generative responses consumes more than a simple question answered from knowledge. This has practical architectural implications:

* Concentrate multi-call logic in a single flow instead of having the agent chain three actions in the same conversation — fewer generative round trips.
* Monitor consumption per agent and per topic. A poorly designed topic that gets into a rephrasing loop is expensive on top of being bad for the user.
* Assess whether a given intent should be resolved by a deterministic topic (fixed flow) instead of generative orchestration — cheaper and more predictable for critical processes.

**Governance: an agent is an application, treat it as one**

An agent that calls business APIs is a corporate application, not a decorative chatbot. It deserves the same ALM and DLP rigor as the rest of the Power Platform solutions: publish the agent and its custom connectors inside a **managed solution**, use environment variables for endpoints and secrets, apply DLP policies that classify the custom connector appropriately, and restrict which environments the agent can live in. Without this, you end up with agents created by users in default environments calling internal APIs with no visibility whatsoever from IT.

Connecting Copilot Studio agents to business systems in a secure, auditable and cost-controlled way is architecture work, not screen configuration. If your company is evaluating taking Copilot beyond the pilot and integrating it with critical systems, Dynamic Soluções can support the design of actions, the authentication strategy and governance — through consulting, continuous support plans or our Power Platform self-service platform.
