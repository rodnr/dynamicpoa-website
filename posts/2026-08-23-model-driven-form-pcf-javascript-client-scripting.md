---
title: "Model-driven apps: como estender o formulário com PCF e JavaScript"
description: "Quando usar PCF, quando usar JavaScript no client API e quando ficar no no-code para estender formulários de model-driven apps sem comprometer performance e ALM."
date: '2026-08-23 13:38:18'
---
Quem opera model-driven apps em escala cedo ou tarde chega ao limite do que a configuração declarativa oferece. Business rules resolvem validações simples, colunas calculadas cobrem parte da lógica, mas há requisitos de interface — um mapa embutido, um seletor customizado, um cálculo em tempo real na tela — que exigem código no formulário. As duas ferramentas para isso são o **PCF (PowerApps Component Framework)** e o **client scripting em JavaScript** sobre o Client API. Elas não competem: resolvem problemas diferentes, e escolher errado gera dívida técnica cara.

**O que cada abordagem realmente faz**

O client scripting em JavaScript roda no contexto do formulário e reage a eventos: OnLoad, OnSave, OnChange de coluna, OnLookupTagClick. Você usa a `formContext` para ler e escrever atributos, mostrar/ocultar seções, disparar notificações e chamar a Web API. É a ferramenta certa para *comportamento* — orquestrar o formulário, validar antes de salvar, popular campos dependentes.

O PCF é outra categoria: você substitui a renderização de um controle (uma coluna ou até um grid inteiro) por um componente próprio em TypeScript/React. É a ferramenta certa para *apresentação* — quando o controle nativo não existe ou não atende, e você precisa de um slider, um card visual, um input mascarado, um mapa. O PCF recebe o valor via `context.parameters` e devolve mudanças pelo `notifyOutputChanged`, mantendo o dado no Dataverse como fonte da verdade.

**Quando NÃO escrever código**

Antes de abrir o VS Code, confirme que o requisito não cabe em configuração:

* Validação condicional simples e mostrar/ocultar campos → **business rules** (funcionam também em canvas e são portáveis).
* Agregação de filhos, cálculo determinístico → **rollup / formula columns** em Power Fx.
* Formatação de coluna de escolha, rating, progress bar → muitos **controles modernos nativos** já existem sem PCF.

Código só se justifica quando o no-code não alcança. Cada linha de JavaScript ou componente PCF é algo que alguém vai ter que manter, testar em cada release e revalidar quando a Microsoft mexer no client.

**Boas práticas de client scripting que evitam dor**

1. **Nunca use `Xrm.Page`** — está deprecado. Receba `executionContext` no handler e obtenha a `formContext` a partir dele.
2. **Registre a função pela solução**, associada a um web resource, não cole código inline. Isso é o que torna o script versionável e transportável entre ambientes.
3. **OnSave assíncrono com cuidado**: se precisar validar via Web API antes de salvar, use `PreventDefault` e ressalve após a resposta — bloquear o save de forma síncrona degrada a experiência.
4. **Não chame Web API em loop** dentro de OnChange; agrupe requisições e trate erro com feedback visível (`setFormNotification`).

**PCF e o custo de ALM que ninguém conta**

O PCF é poderoso, mas tem custo operacional real:

* Precisa de **code components habilitados** no ambiente (setting que nem sempre está ligado em produção).
* Componente PCF vive dentro de uma **solução gerenciada** — build com `pac pcf`, empacotamento e deploy pela pipeline, não upload manual.
* O **bundle** carregado no formulário afeta o tempo de load; um React pesado em cada abertura de registro multiplica a latência percebida.
* Componentes de terceiros baixados do PCF Gallery devem passar por revisão de segurança — eles rodam no contexto autenticado do usuário.

Na prática: PCF para poucos controles de alto valor, bem versionados, e não como resposta padrão para toda customização de tela.

**Roteiro de decisão rápido**

* Preciso mudar *comportamento* do formulário (validar, orquestrar, popular)? → **JavaScript / Client API**.
* Preciso mudar *como um dado é exibido ou editado* e o controle nativo não existe? → **PCF**.
* Dá pra resolver com business rule, rollup, formula column ou controle moderno nativo? → **fique no no-code**.
* É lógica de negócio que precisa rodar mesmo fora do formulário (via API, integração, importação)? → não é client-side: é **plugin no Dataverse**.

Essa última linha é o erro mais comum que vemos: colocar regra crítica de negócio em JavaScript de formulário. Se o dado pode entrar por integração, importação ou outro app, o client script simplesmente não roda — a regra tem que estar no servidor.

Extensão de model-driven apps é onde arquitetura e governança de ALM se encontram: escolher entre no-code, client script, PCF e plugin define o custo de manutenção dos próximos anos. Se sua equipe está avaliando até onde ir com código na Power Platform, a Dynamic Soluções ajuda a definir a arquitetura, estruturar o ALM em soluções gerenciadas e sustentar o ambiente com nossos planos de suporte.



Anyone running model-driven apps at scale eventually hits the ceiling of what declarative configuration offers. Business rules handle simple validations, calculated columns cover part of the logic, but there are UI requirements — an embedded map, a custom picker, a real-time on-screen calculation — that require code on the form. The two tools for this are the **PCF (PowerApps Component Framework)** and **client scripting in JavaScript** over the Client API. They don't compete: they solve different problems, and picking the wrong one creates expensive technical debt.

**What each approach actually does**

JavaScript client scripting runs in the form context and reacts to events: OnLoad, OnSave, OnChange of a column, OnLookupTagClick. You use `formContext` to read and write attributes, show/hide sections, raise notifications and call the Web API. It's the right tool for *behavior* — orchestrating the form, validating before save, populating dependent fields.

PCF is a different category: you replace the rendering of a control (a column or even an entire grid) with your own component in TypeScript/React. It's the right tool for *presentation* — when the native control doesn't exist or doesn't fit, and you need a slider, a visual card, a masked input, a map. PCF receives the value via `context.parameters` and pushes changes back through `notifyOutputChanged`, keeping the data in Dataverse as the source of truth.

**When NOT to write code**

Before opening VS Code, confirm the requirement doesn't fit in configuration:

* Simple conditional validation and show/hide fields → **business rules** (they also work in canvas and are portable).
* Child aggregation, deterministic calculation → **rollup / formula columns** in Power Fx.
* Choice column formatting, rating, progress bar → many **modern native controls** already exist without PCF.

Code is only justified when no-code can't reach. Every line of JavaScript or PCF component is something someone will have to maintain, test on each release and revalidate whenever Microsoft changes the client.

**Client scripting best practices that avoid pain**

1. **Never use `Xrm.Page`** — it's deprecated. Receive `executionContext` in the handler and get `formContext` from it.
2. **Register the function through the solution**, tied to a web resource, don't paste inline code. That's what makes the script versionable and transportable across environments.
3. **Async OnSave with care**: if you need to validate via Web API before saving, use `PreventDefault` and re-save after the response — blocking the save synchronously degrades the experience.
4. **Don't call the Web API in a loop** inside OnChange; batch requests and handle errors with visible feedback (`setFormNotification`).

**PCF and the ALM cost nobody counts**

PCF is powerful, but it carries real operational cost:

* It needs **code components enabled** in the environment (a setting that isn't always turned on in production).
* A PCF component lives inside a **managed solution** — build with `pac pcf`, packaging and deploy through the pipeline, not manual upload.
* The **bundle** loaded on the form affects load time; a heavy React on every record open multiplies perceived latency.
* Third-party components pulled from the PCF Gallery must go through a security review — they run in the user's authenticated context.

In practice: PCF for a few high-value, well-versioned controls, not as the default answer for every screen customization.

**Quick decision guide**

* Do I need to change the form's *behavior* (validate, orchestrate, populate)? → **JavaScript / Client API**.
* Do I need to change *how a piece of data is displayed or edited* and the native control doesn't exist? → **PCF**.
* Can it be solved with a business rule, rollup, formula column or native modern control? → **stay no-code**.
* Is it business logic that must run even outside the form (via API, integration, import)? → it's not client-side: it's a **Dataverse plugin**.

That last line is the most common mistake we see: putting critical business rules in form JavaScript. If data can come in via integration, import or another app, the client script simply doesn't run — the rule has to be on the server.

Extending model-driven apps is where architecture and ALM governance meet: choosing between no-code, client script, PCF and plugin defines your maintenance cost for years to come. If your team is weighing how far to go with code on the Power Platform, Dynamic Soluções helps define the architecture, structure ALM in managed solutions and sustain the environment through our support plans.
