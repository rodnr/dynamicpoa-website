---
title: "Child flows no Power Automate: como estruturar automações reutilizáveis"
description: "Reaproveitar lógica de automação em escala exige mais do que copiar fluxos. Veja como usar child flows em soluções gerenciadas com passagem de parâmetros e tratamento de erros."
date: '2026-07-15 20:30:42'
---
Quando uma automação começa a crescer, é comum ver o mesmo bloco de lógica — enviar uma notificação formatada, gravar um log no Dataverse, chamar uma API com autenticação — copiado e colado em dezenas de fluxos diferentes. O problema aparece na manutenção: uma mudança de regra vira uma caça manual por todos os lugares onde aquele trecho foi replicado. É aqui que os **child flows** deixam de ser um recurso opcional e passam a ser uma decisão de arquitetura.

**O que são child flows na prática**

Um child flow é um fluxo do Power Automate acionado por outro fluxo (o *parent*) através do gatilho **When a flow is invoked (Request)** ou, mais comumente hoje, pela ação **Run a Child Flow**. A ideia central é encapsular uma responsabilidade única e reutilizável — um "método" que o resto da sua camada de automação pode chamar. O parent envia parâmetros de entrada, o child processa e devolve valores de saída via ação **Respond to a Power App or flow**.

Na prática, isso muda a forma como você desenha automações corporativas:

* Lógica de negócio compartilhada fica em um único lugar, versionada e testável isoladamente.
* Fluxos principais ficam menores e mais legíveis, orquestrando chamadas em vez de repetir passos.
* Correções e melhorias se propagam automaticamente para todos os consumidores do child flow.

**Pré-requisito que muita gente ignora: solução gerenciada**

A ação **Run a Child Flow** só funciona corretamente quando ambos os fluxos — parent e child — estão dentro da **mesma solução**. Tentar chamar um child flow que vive fora de uma solution é a causa número um de erros silenciosos e de fluxos que "funcionam no Dev e quebram em produção".

Além disso, child flows têm implicações de contexto de execução. Por padrão, o child roda no contexto da conexão definida nele, mas você pode configurar para que use o contexto do chamador. Definir isso de forma explícita (via *Run only users* e as conexões embutidas) é o que garante previsibilidade quando o fluxo passa pelo pipeline de ALM para Test, UAT e Prod.

**Passagem de parâmetros: contrato claro entre parent e child**

Trate o child flow como uma API interna. Isso significa desenhar um contrato explícito:

1. **Entradas tipadas** — no gatilho do child, defina cada parâmetro com o tipo correto (texto, número, booleano, arquivo). Evite passar um JSON gigante como string "faz-tudo"; parâmetros nomeados tornam o fluxo autoexplicativo.
2. **Saídas padronizadas** — retorne sempre um status (`sucesso`/`falha`), uma mensagem e, quando fizer sentido, o ID do registro afetado. Assim o parent sabe reagir sem inspecionar internamente o child.
3. **Idempotência** — para operações que podem ser reexecutadas (retries), garanta que chamar o child duas vezes com os mesmos dados não gere efeitos duplicados.

**Tratamento de erros e observabilidade**

Um dos maiores ganhos de centralizar lógica em child flows é padronizar o tratamento de erros. Em vez de configurar `Configure run after` em cada fluxo, você concentra a captura de exceções no child e devolve um resultado estruturado. Recomendações concretas:

* Envolva a lógica crítica em um escopo (**Scope**) com um segundo escopo de tratamento configurado para rodar após falha/timeout.
* Grave logs de execução no Dataverse (correlacionando por um `runId`), o que dá rastreabilidade centralizada de todas as automações da empresa.
* Retorne erros de forma amigável ao parent, deixando a decisão de reprocessar ou notificar a cargo do orquestrador.

**Cuidado com limites e performance**

Child flows não são gratuitos em termos de execução. Cada chamada conta para os limites de ações da plataforma, e cadeias muito profundas de parent → child → child podem se aproximar dos limites de tempo de execução (o child também tem seus próprios timeouts). Além disso, se o child faz uso de conectores premium, todos os cenários que o consomem precisam do licenciamento adequado — algo a considerar no seu planejamento de custos de Power Automate.

Como regra prática: use child flows para encapsular responsabilidades reais e reutilizáveis, não para fatiar artificialmente um fluxo pequeno. O objetivo é reduzir duplicação e centralizar governança, não multiplicar o número de fluxos por si só.

**Quando o child flow vale mais que uma custom connector ou Azure Function**

Se a lógica é puramente orquestração de conectores Microsoft e regras de negócio, o child flow costuma ser a escolha mais rápida e de menor atrito. Se envolve processamento pesado, código customizado ou integrações que exigem controle fino de retries e concorrência, uma **Azure Function** exposta por custom connector tende a escalar melhor. A arquitetura madura muitas vezes combina os dois: child flows para orquestração e governança, Functions para o trabalho computacional.

Estruturar automações críticas com child flows, soluções gerenciadas e um pipeline de ALM bem definido é justamente o tipo de maturidade que separa um ambiente de Power Platform sustentável de um emaranhado de fluxos difíceis de manter. Se a sua empresa depende de automações em escala e quer reduzir risco operacional, a Dynamic Soluções pode ajudar a desenhar essa arquitetura e implementar governança de ponta a ponta.



When an automation starts to grow, it's common to see the same block of logic — sending a formatted notification, writing a log to Dataverse, calling an authenticated API — copied and pasted across dozens of different flows. The pain shows up in maintenance: a single rule change becomes a manual hunt for every place that snippet was replicated. This is where **child flows** stop being an optional feature and become an architectural decision.

**What child flows really are**

A child flow is a Power Automate flow triggered by another flow (the *parent*) through the **When a flow is invoked (Request)** trigger or, more commonly today, through the **Run a Child Flow** action. The core idea is to encapsulate a single, reusable responsibility — a "method" that the rest of your automation layer can call. The parent sends input parameters, the child processes them, and returns output values via the **Respond to a Power App or flow** action.

In practice, this changes how you design corporate automations:

* Shared business logic lives in a single place, versioned and testable in isolation.
* Main flows become smaller and more readable, orchestrating calls instead of repeating steps.
* Fixes and improvements propagate automatically to every consumer of the child flow.

**A prerequisite many people ignore: managed solution**

The **Run a Child Flow** action only works correctly when both flows — parent and child — live inside the **same solution**. Trying to call a child flow that sits outside a solution is the number-one cause of silent errors and of flows that "work in Dev and break in production."

Child flows also have execution-context implications. By default, the child runs in the context of the connection defined within it, but you can configure it to use the caller's context. Setting this explicitly (via *Run only users* and the embedded connections) is what guarantees predictability as the flow moves through the ALM pipeline into Test, UAT and Prod.

**Parameter passing: a clear contract between parent and child**

Treat the child flow like an internal API. That means designing an explicit contract:

1. **Typed inputs** — in the child's trigger, define each parameter with the right type (text, number, boolean, file). Avoid passing a giant JSON "do-everything" string; named parameters make the flow self-documenting.
2. **Standardized outputs** — always return a status (`success`/`failure`), a message and, when it makes sense, the ID of the affected record. This way the parent knows how to react without inspecting the child internally.
3. **Idempotency** — for operations that may be re-run (retries), make sure calling the child twice with the same data doesn't cause duplicate effects.

**Error handling and observability**

One of the biggest wins of centralizing logic in child flows is standardizing error handling. Instead of configuring `Configure run after` in every flow, you concentrate exception capture in the child and return a structured result. Concrete recommendations:

* Wrap critical logic in a **Scope**, with a second handling scope configured to run after failure/timeout.
* Write execution logs to Dataverse (correlating by a `runId`), which gives centralized traceability across all company automations.
* Return errors in a friendly way to the parent, leaving the decision to reprocess or notify to the orchestrator.

**Watch out for limits and performance**

Child flows aren't free in execution terms. Each call counts toward the platform's action limits, and very deep parent → child → child chains can approach execution-time limits (the child has its own timeouts too). Also, if the child uses premium connectors, every scenario that consumes it needs proper licensing — something to factor into your Power Automate cost planning.

As a rule of thumb: use child flows to encapsulate real, reusable responsibilities, not to artificially slice a small flow. The goal is to cut duplication and centralize governance, not to multiply the number of flows for its own sake.

**When a child flow beats a custom connector or Azure Function**

If the logic is purely orchestration of Microsoft connectors and business rules, the child flow is usually the fastest, lowest-friction choice. If it involves heavy processing, custom code, or integrations that require fine-grained control over retries and concurrency, an **Azure Function** exposed through a custom connector tends to scale better. A mature architecture often combines both: child flows for orchestration and governance, Functions for the computational work.

Structuring critical automations with child flows, managed solutions and a well-defined ALM pipeline is exactly the kind of maturity that separates a sustainable Power Platform environment from a tangle of hard-to-maintain flows. If your company relies on automation at scale and wants to reduce operational risk, Dynamic Soluções can help design this architecture and implement end-to-end governance.
