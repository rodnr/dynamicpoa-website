---
title: "Power Automate: desencadeie fluxos via Dataverse plugin step"
description: "Descubra como disparar flows de forma confiavel a partir do pipeline do Dataverse, superando os limites do trigger nativo e ganhando controle sobre estagio, filtros e ordem de execucao."
date: '2026-10-03 17:10:04'
---
O trigger nativo "When a row is added, modified or deleted" do conector Dataverse resolve a maioria dos cenarios de automacao, mas em projetos de escala ele comeca a mostrar limitacoes: pouca visibilidade sobre o estagio do pipeline em que dispara, dificuldade de filtrar por mudanca de coluna especifica, e ordem de execucao que voce nao controla em relacao a plugins e outros flows. Quando isso vira gargalo, vale entender como o Dataverse realmente aciona automacoes e onde o registro via plugin step entra como alternativa.

**Como o trigger nativo realmente funciona**

O que muitos tratam como "trigger magico" e, na verdade, um registro no mesmo event framework que sustenta plugins. Quando voce cria um fluxo automatizado com o trigger do Dataverse, a plataforma registra por baixo dos panos um **SdkMessageProcessingStep** apontando para o servico interno de workflow. Esse step dispara em um estagio especifico do pipeline (tipicamente post-operation, assincrono) e invoca o fluxo.

O problema e que a UI do maker expoe muito pouco desse registro. Voce escolhe a tabela, o escopo (organization, business unit, user) e as colunas filtradas, mas nao tem acesso fino ao estagio, a imagens pre/post ou a ordem de execucao (rank) em relacao a outros steps. Em cenarios criticos, essa opacidade custa caro.

**Os limites que aparecem em escala**

* **Filtro por coluna impreciso.** O campo "Select columns" filtra o gatilho, mas combinacoes de mudanca (ex.: disparar so quando status muda E o valor e maior que X) exigem condicoes dentro do fluxo, desperdicando execucoes.
* **Sem controle de estagio.** Voce nao decide se a automacao roda em pre-validation, pre-operation ou post-operation. Para reagir a um registro ja persistido com os valores finais, post-operation assincrono resolve; para validar/abortar uma transacao, o trigger nativo nao serve.
* **Ordem de execucao indefinida.** Se um plugin sincrono altera o registro e voce precisa que o fluxo veja o resultado final, a falta de controle de rank gera resultados nao deterministicos.
* **Imagens limitadas.** O trigger entrega a linha, mas acessar o valor anterior de uma coluna (pre-image) de forma confiavel e trabalhoso \u2014 geralmente voce acaba consultando o Dataverse de novo dentro do fluxo.

**O padrao: registrar o step manualmente**

A alternativa e usar o **Plugin Registration Tool** (ou a configuracao avancada de process) para registrar o step que aciona o fluxo com controle total. O fluxo em si continua sendo um flow de Power Automate dentro de uma solucao, mas o registro do gatilho passa a ser explicito:

1. Crie o fluxo com um trigger manual/HTTP ou um trigger Dataverse generico e adicione-o a uma solucao gerenciada.
2. No Plugin Registration Tool, conecte ao ambiente e localize o step gerado pelo fluxo.
3. Ajuste **stage**, **execution mode** (sincrono vs assincrono), **filtering attributes** e **rank**.
4. Configure **pre-image** e **post-image** para que o fluxo receba os valores antes e depois sem round-trip extra ao Dataverse.

Com isso voce elimina consultas redundantes, garante que o fluxo so dispara na combinacao de mudanca certa e fixa a ordem em relacao a plugins existentes.

**Quando NAO usar essa abordagem**

Controle fino tem custo de governanca. Registrar steps manualmente foge do que a UI do maker mostra, o que complica troubleshooting por quem nao conhece o Plugin Registration Tool. Antes de ir por esse caminho, confirme que:

* O trigger nativo realmente nao atende \u2014 muitas vezes uma condicao bem feita no inicio do fluxo resolve sem complexidade extra.
* A logica nao deveria morar num plugin de verdade. Se voce precisa de execucao sincrona, transacional, com rollback, isso e um plugin em C#, nao um fluxo. Flow sincrono acoplado ao pipeline adiciona latencia a transacao do usuario e tem timeout agressivo.
* O step registrado esta documentado e versionado na solucao, para nao virar configuracao fantasma que ninguem entende depois.

**Roteiro de decisao**

* Mudanca simples, reacao assincrona, sem dependencia de ordem \u2192 **trigger nativo**.
* Filtro por combinacao de colunas, necessidade de pre/post-image, ordem relativa a plugins \u2192 **step registrado manualmente apontando para o fluxo**.
* Validacao transacional, rollback, baixa latencia obrigatoria \u2192 **plugin em C#**, nao fluxo.

Arquitetar automacoes criticas no Dataverse exige entender o event framework por tras do conector, nao so a UI do maker. Se sua empresa opera solucoes de missao critica sobre Power Platform e precisa de automacoes deterministicas, auditaveis e com governanca de ALM, a Dynamic Solucoes pode ajudar a desenhar essa arquitetura e manter tudo sob um plano de suporte continuo.



The native "When a row is added, modified or deleted" trigger in the Dataverse connector handles most automation scenarios, but on large-scale projects it starts to show its limits: little visibility into which pipeline stage it fires at, difficulty filtering by a specific column change, and an execution order you can't control relative to plugins and other flows. When this becomes a bottleneck, it pays to understand how Dataverse actually triggers automations and where registering a step via the plugin framework comes in as an alternative.

**How the native trigger really works**

What many treat as a "magic trigger" is in fact a registration in the same event framework that powers plugins. When you create an automated flow with the Dataverse trigger, under the hood the platform registers an **SdkMessageProcessingStep** pointing to the internal workflow service. That step fires at a specific pipeline stage (typically post-operation, asynchronous) and invokes the flow.

The problem is that the maker UI exposes very little of this registration. You pick the table, the scope (organization, business unit, user) and the filtering columns, but you don't get fine-grained access to the stage, pre/post images or the execution rank relative to other steps. In critical scenarios, that opacity is expensive.

**The limits that surface at scale**

* **Imprecise column filtering.** The "Select columns" field filters the trigger, but change combinations (e.g. fire only when status changes AND the value is greater than X) require conditions inside the flow, wasting runs.
* **No stage control.** You don't decide whether the automation runs at pre-validation, pre-operation or post-operation. To react to an already-persisted record with final values, asynchronous post-operation works; to validate/abort a transaction, the native trigger is of no use.
* **Undefined execution order.** If a synchronous plugin modifies the record and you need the flow to see the final result, the lack of rank control produces non-deterministic outcomes.
* **Limited images.** The trigger delivers the row, but reliably accessing a column's previous value (pre-image) is cumbersome \u2014 you usually end up querying Dataverse again inside the flow.

**The pattern: registering the step manually**

The alternative is to use the **Plugin Registration Tool** (or the advanced process configuration) to register the step that triggers the flow with full control. The flow itself is still a Power Automate flow inside a solution, but the trigger registration becomes explicit:

1. Build the flow with a manual/HTTP trigger or a generic Dataverse trigger and add it to a managed solution.
2. In the Plugin Registration Tool, connect to the environment and locate the step generated by the flow.
3. Adjust **stage**, **execution mode** (synchronous vs asynchronous), **filtering attributes** and **rank**.
4. Configure a **pre-image** and **post-image** so the flow receives the before and after values with no extra round-trip to Dataverse.

With this you eliminate redundant queries, ensure the flow only fires on the right change combination, and pin its order relative to existing plugins.

**When NOT to use this approach**

Fine-grained control comes with a governance cost. Registering steps manually departs from what the maker UI shows, which complicates troubleshooting for anyone unfamiliar with the Plugin Registration Tool. Before going down this path, confirm that:

* The native trigger genuinely falls short \u2014 often a well-crafted condition at the start of the flow solves it without extra complexity.
* The logic shouldn't actually live in a real plugin. If you need synchronous, transactional execution with rollback, that's a C# plugin, not a flow. A synchronous flow coupled to the pipeline adds latency to the user transaction and has an aggressive timeout.
* The registered step is documented and versioned in the solution, so it doesn't turn into phantom configuration nobody understands later.

**Decision guide**

* Simple change, asynchronous reaction, no order dependency \u2192 **native trigger**.
* Filtering by column combinations, need for pre/post images, order relative to plugins \u2192 **manually registered step pointing to the flow**.
* Transactional validation, rollback, mandatory low latency \u2192 **C# plugin**, not a flow.

Architecting critical automations on Dataverse requires understanding the event framework behind the connector, not just the maker UI. If your company runs mission-critical solutions on Power Platform and needs deterministic, auditable automations with proper ALM governance, Dynamic Solucoes can help design that architecture and keep it all under a continuous support plan.
