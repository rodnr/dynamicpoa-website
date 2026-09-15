---
title: "Power Apps Component Framework: reuso de UI corporativa com PCF"
description: "Construir controles PCF vai muito além de estilizar campos: entenda o ciclo de vida do componente, dataset vs field controls, empacotamento e ALM para reusar UI em toda a organização."
date: '2026-09-15 17:38:08'
---
O Power Apps Component Framework (PCF) costuma ser lembrado como "aquele jeito de deixar um campo mais bonito". Mas quando uma organização tem dezenas de model-driven apps e formulários compartilhando os mesmos padrões de interface — um seletor de status com cores, um mapa, um grid customizado com edição inline — o PCF deixa de ser cosmético e vira uma estratégia de reuso de UI de verdade. Este post foca no que muda quando você trata code components como um ativo de plataforma, e não como um hack pontual em um formulário.

**Field control vs dataset control: a decisão que define tudo**

Antes de escrever qualquer linha de TypeScript, você escolhe o tipo de componente no manifest (`ControlManifest.Input.xml`), e essa escolha condiciona toda a arquitetura:

* **Field control** — vinculado a uma única coluna do formulário. O componente recebe e devolve um valor (`context.parameters.<campo>`), e é o caso do slider, do color picker, do input mascarado. Simples, mas limitado a um dado por vez.
* **Dataset control** — vinculado a uma view ou subgrid, recebe uma coleção de registros com paginação, ordenação e filtros. É o que permite substituir o grid nativo por uma renderização própria (kanban, calendário, timeline) mantendo as capacidades de dados do Dataverse.

O erro clássico é começar um field control e, no meio do caminho, perceber que o requisito era sobre múltiplos registros — o que obriga a refazer o manifest e boa parte da lógica. Defina isso primeiro.

**O ciclo de vida é o contrato que você precisa respeitar**

Um code component não é um componente React solto: ele obedece a um ciclo de vida que o host (o formulário ou o canvas app) controla. Os quatro métodos do `index.ts` importam:

1. `init` — recebe o `context`, o callback `notifyOutputChanged` e o container DOM. É onde você monta a estrutura inicial. Não faça chamadas pesadas aqui.
2. `updateView` — chamado toda vez que qualquer parâmetro muda (dado, tamanho do container, modo de leitura). É o coração do componente e precisa ser idempotente: renderizar sempre a partir do `context` atual, sem acumular estado escondido.
3. `getOutputs` — devolve ao host os valores que o componente alterou; só é chamado depois de você invocar `notifyOutputChanged`.
4. `destroy` — libera listeners, timers e instâncias. Ignorar isso em componentes que entram e saem da tela (subgrids, quick view forms) causa memory leaks silenciosos.

Quem vem de React puro tende a tratar `updateView` como um `useEffect` qualquer e esquece que o framework pode chamá-lo com muito mais frequência do que espera. Renderizações caras precisam de guarda por comparação de valores relevantes.

**Acesso a dados: use as APIs do context, não fetch direto**

A tentação de disparar um `fetch` para a Web API a partir do componente é grande, mas o framework oferece `context.webAPI` justamente para respeitar segurança, business units e o token da sessão. Além disso:

* `context.webAPI.retrieveMultipleRecords` respeita as security roles do usuário — um fetch manual com URL montada na mão pode quebrar em ambientes com column security ou expor chamadas fora do padrão de auditoria.
* Para dataset controls, prefira consumir o próprio dataset paginado (`context.parameters.<dataset>.paging`) em vez de recarregar tudo — você herda os filtros da view e o comportamento de scroll.
* Chamadas assíncronas devem sempre revalidar contra o `context` no retorno, porque o registro em foco pode ter mudado enquanto a promise resolvia.

**Empacotamento e ALM: onde a maioria dos projetos tropeça**

Um PCF só vira ativo corporativo quando entra no ciclo de ALM da plataforma. Isso significa:

* Buildar o componente e importá-lo dentro de uma **solução gerenciada**, não fazer `pac pcf push` direto em produção (esse comando é para o loop de desenvolvimento, não para deploy).
* Versionar o componente no manifest com disciplina, porque atualizações de code component são globais — subir uma versão nova reflete em todos os formulários que o usam. Uma regressão vira incidente em vários apps ao mesmo tempo.
* Habilitar o feature de code components no ambiente (Power Apps component framework precisa estar ligado nas configurações do ambiente para model-driven, e é obrigatório para canvas).
* Tratar o repositório do PCF como código de verdade: pipeline com `npm run build`, lint, e a geração do `.zip` da solução automatizada, integrando aos Power Platform Pipelines ou ao Azure DevOps.

**Quando NÃO usar PCF**

Code component é poderoso, mas carrega custo de manutenção (build, versionamento, testes de compatibilidade a cada release da plataforma). Pense duas vezes se:

* O requisito se resolve com business rules, colunas de formatação nativa ou um formulário bem desenhado — não crie um controle para o que a plataforma já faz.
* A lógica é de negócio (validação, cálculo), que pertence a plugin ou business rule no servidor, não à camada de UI.
* O componente seria usado uma única vez em um único formulário — o ROI raramente compensa contra client scripting em JavaScript para casos pontuais.

O ganho real do PCF aparece na escala: um controle bem construído e governado por solução, reaproveitado em dezenas de telas, com identidade visual consistente e comportamento previsível.

Estruturar code components como ativos de plataforma — com manifest correto, ciclo de vida respeitado e ALM disciplinado — é o tipo de decisão de arquitetura que separa um Power Apps que escala de uma coleção de gambiarras de UI. Se a sua empresa está ampliando o uso de model-driven apps e quer padronizar a experiência com componentes reutilizáveis e governados, a equipe da Dynamic Soluções pode ajudar a desenhar essa camada e integrá-la ao seu ciclo de ALM.



The Power Apps Component Framework (PCF) is usually remembered as "that way to make a field look nicer." But when an organization runs dozens of model-driven apps and forms sharing the same interface patterns — a color-coded status picker, a map, a custom grid with inline editing — PCF stops being cosmetic and becomes a real UI reuse strategy. This post focuses on what changes when you treat code components as a platform asset rather than a one-off hack on a single form.

**Field control vs dataset control: the decision that defines everything**

Before writing a single line of TypeScript, you choose the component type in the manifest (`ControlManifest.Input.xml`), and that choice shapes the entire architecture:

* **Field control** — bound to a single form column. The component receives and returns a value (`context.parameters.<field>`), and this is the case for a slider, a color picker, a masked input. Simple, but limited to one piece of data at a time.
* **Dataset control** — bound to a view or subgrid, it receives a collection of records with paging, sorting and filters. This is what lets you replace the native grid with your own rendering (kanban, calendar, timeline) while keeping Dataverse's data capabilities.

The classic mistake is starting a field control and, midway through, realizing the requirement was about multiple records — which forces you to rebuild the manifest and much of the logic. Decide this first.

**The lifecycle is a contract you have to honor**

A code component isn't a loose React component: it follows a lifecycle controlled by the host (the form or canvas app). The four methods in `index.ts` matter:

1. `init` — receives the `context`, the `notifyOutputChanged` callback and the DOM container. This is where you build the initial structure. Don't make heavy calls here.
2. `updateView` — called every time any parameter changes (data, container size, read mode). It's the heart of the component and must be idempotent: always render from the current `context`, without accumulating hidden state.
3. `getOutputs` — returns to the host the values the component changed; it's only called after you invoke `notifyOutputChanged`.
4. `destroy` — releases listeners, timers and instances. Ignoring this in components that enter and leave the screen (subgrids, quick view forms) causes silent memory leaks.

People coming from plain React tend to treat `updateView` like any `useEffect` and forget that the framework may call it far more often than expected. Expensive renders need guards based on comparing the relevant values.

**Data access: use the context APIs, not raw fetch**

The temptation to fire a `fetch` at the Web API from within the component is strong, but the framework offers `context.webAPI` precisely to respect security, business units and the session token. On top of that:

* `context.webAPI.retrieveMultipleRecords` respects the user's security roles — a hand-built manual fetch may break in environments with column security or expose calls outside the audit standard.
* For dataset controls, prefer consuming the paged dataset itself (`context.parameters.<dataset>.paging`) instead of reloading everything — you inherit the view's filters and scroll behavior.
* Async calls should always revalidate against the `context` on return, because the record in focus may have changed while the promise was resolving.

**Packaging and ALM: where most projects stumble**

A PCF only becomes a corporate asset when it enters the platform's ALM cycle. That means:

* Building the component and importing it inside a **managed solution**, not running `pac pcf push` straight into production (that command is for the development loop, not deployment).
* Versioning the component in the manifest with discipline, because code component updates are global — pushing a new version reflects across every form using it. A regression becomes an incident in several apps at once.
* Enabling the code components feature in the environment (Power Apps component framework must be turned on in the environment settings for model-driven, and it's mandatory for canvas).
* Treating the PCF repository as real code: a pipeline with `npm run build`, lint, and automated generation of the solution `.zip`, integrated into Power Platform Pipelines or Azure DevOps.

**When NOT to use PCF**

Code components are powerful, but they carry a maintenance cost (build, versioning, compatibility testing on every platform release). Think twice if:

* The requirement is solved with business rules, native formatting columns or a well-designed form — don't build a control for what the platform already does.
* The logic is business logic (validation, calculation), which belongs in a plugin or server-side business rule, not in the UI layer.
* The component would be used just once on a single form — the ROI rarely beats plain JavaScript client scripting for point cases.

PCF's real payoff shows up at scale: a well-built control governed by a solution, reused across dozens of screens, with consistent visual identity and predictable behavior.

Structuring code components as platform assets — with the right manifest, a respected lifecycle and disciplined ALM — is the kind of architecture decision that separates a Power Apps that scales from a collection of UI workarounds. If your company is expanding its use of model-driven apps and wants to standardize the experience with reusable, governed components, the Dynamic Soluções team can help design that layer and integrate it into your ALM cycle.
