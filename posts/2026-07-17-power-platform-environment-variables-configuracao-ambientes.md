---
title: "Environment variables no Power Platform: gestão de configs entre ambientes"
description: "Chumbar URLs, IDs e chaves dentro de flows e apps quebra o deploy entre ambientes. Veja como usar environment variables para parametrizar soluções sem editar nada na promoção."
date: '2026-07-17 14:42:44'
---
Quem já promoveu uma solução de Dev para Produção na Power Platform conhece a dor: o flow que apontava para o site SharePoint de homologação continua apontando para ele em produção, a conexão com a API de teste vai junto, e o app abre com a URL errada. O reflexo comum é abrir cada componente e editar à mão depois do deploy — exatamente o tipo de trabalho manual que quebra a promessa de um ALM confiável. As **environment variables** existem para eliminar isso.

**O que são environment variables**

Environment variables são componentes de solução armazenados no Dataverse que separam a *definição* de um valor do *valor em si*. Cada variável tem duas partes:

* **Definition** — o nome lógico, o tipo de dado e, opcionalmente, um valor padrão. Essa parte viaja dentro da solução gerenciada.
* **Value** — o valor concreto para aquele ambiente. Essa parte é específica de cada ambiente e não deve viajar entre eles.

Na prática, você referencia a variável dentro de um flow, app ou business rule, e cada ambiente resolve o valor apropriado em tempo de execução. O deploy deixa de exigir edição pós-import.

**Tipos suportados e o caso do Secret**

Os tipos disponíveis cobrem a maioria dos cenários de configuração:

* **Text** — URLs, nomes de sites, endpoints.
* **Number / Decimal** — limites, thresholds, timeouts.
* **Boolean** — feature flags (ligar/desligar comportamento por ambiente).
* **JSON** — objetos de configuração estruturados.
* **Data source** — referência a uma tabela/coluna.
* **Secret** — integrado ao **Azure Key Vault**, o tipo indicado para chaves de API, connection strings e tokens. O valor nunca fica armazenado em texto no Dataverse; a variável guarda apenas a referência ao secret no Key Vault, e o acesso é controlado por RBAC do Azure.

A regra de ouro: **credenciais e segredos vão sempre em environment variables do tipo Secret**, nunca chumbados em uma expressão de flow ou em uma variável de texto.

**Como usar em flows e apps**

No **Power Automate**, environment variables aparecem no seletor de conteúdo dinâmico dentro de uma solução. Ao invés de escrever `https://contoso-hml.sharepoint.com/sites/rh` numa ação, você referencia a variável `SiteRH`, e cada ambiente resolve para sua própria URL.

No **Power Apps (canvas)**, o acesso é via a função `LookUp` na tabela `Environment Variable Values`, ou de forma mais direta usando a fonte de dados de environment variables exposta no app. Em **model-driven apps** e business rules, a integração é nativa.

Um detalhe de performance importante em canvas apps: leia a variável uma vez no `OnStart` e guarde numa variável global (`Set`), em vez de fazer o `LookUp` repetidamente ao longo da tela.

**O erro clássico: valor default que vaza para produção**

O ponto que mais gera incidente é confundir *default value* com *current value*. Se você preenche o valor padrão na definition durante o desenvolvimento, esse valor viaja dentro da solução gerenciada. Ao importar em produção **sem** definir um current value específico, o ambiente cai no default — que costuma ser o valor de Dev.

Recomendação prática:

1. **Não preencha default values** com endpoints reais de Dev. Deixe a definition sem valor padrão (ou com um placeholder claramente inválido).
2. Defina o **current value** de cada ambiente de forma controlada: manualmente pela UI, via `deployment settings file` em pipelines, ou por script.
3. Em **Pipelines da Power Platform** e no Azure DevOps, use o arquivo de deployment settings (`--settings-file`) para injetar automaticamente o valor correto de cada ambiente durante o import da solução gerenciada.

**Environment variables e o pipeline de ALM**

É aqui que o recurso mostra seu valor real. Numa esteira Dev → Test → UAT → Prod, o mesmo pacote de solução gerenciada é promovido sem alteração. O que muda entre ambientes fica isolado no deployment settings, versionado no repositório. Isso significa deploys idempotentes, revisáveis em pull request e sem intervenção manual pós-import — o oposto do cenário de "abrir o flow e trocar a URL na mão".

Combine isso com **DLP policies** por ambiente e **connection references** (que seguem a mesma lógica de separar definição de valor, mas para conexões) e você tem uma base sólida de governança: nada de credenciais no código, nada de valor de Dev vazando para Produção, tudo auditável.

**Fechamento**

Parametrizar soluções com environment variables é um daqueles investimentos que parecem burocracia no começo e viram economia de horas a cada release. Se sua empresa opera Power Platform em escala e ainda depende de ajustes manuais a cada promoção de ambiente, a Dynamic Soluções pode ajudar a estruturar um pipeline de ALM completo — do desenho dos ambientes ao deployment settings automatizado —, seja por meio dos nossos planos de suporte ou de um projeto de consultoria dedicado.



Anyone who has ever promoted a Power Platform solution from Dev to Production knows the pain: the flow that pointed to the staging SharePoint site keeps pointing to it in production, the test API connection tags along, and the app opens with the wrong URL. The usual reflex is to open each component and edit it by hand after the deploy — exactly the kind of manual work that breaks the promise of a reliable ALM. **Environment variables** exist to eliminate that.

**What environment variables are**

Environment variables are solution components stored in Dataverse that separate the *definition* of a value from the *value itself*. Each variable has two parts:

* **Definition** — the logical name, the data type and, optionally, a default value. This part travels inside the managed solution.
* **Value** — the concrete value for that environment. This part is environment-specific and should not travel between environments.

In practice, you reference the variable inside a flow, app or business rule, and each environment resolves the appropriate value at runtime. Deployment no longer requires post-import editing.

**Supported types and the Secret case**

The available types cover most configuration scenarios:

* **Text** — URLs, site names, endpoints.
* **Number / Decimal** — limits, thresholds, timeouts.
* **Boolean** — feature flags (turn behavior on/off per environment).
* **JSON** — structured configuration objects.
* **Data source** — a reference to a table/column.
* **Secret** — integrated with **Azure Key Vault**, the right type for API keys, connection strings and tokens. The value is never stored as plain text in Dataverse; the variable only holds the reference to the secret in Key Vault, and access is controlled by Azure RBAC.

The golden rule: **credentials and secrets always go into Secret-type environment variables**, never hardcoded in a flow expression or in a text variable.

**How to use them in flows and apps**

In **Power Automate**, environment variables show up in the dynamic content picker inside a solution. Instead of writing `https://contoso-stg.sharepoint.com/sites/hr` in an action, you reference the `HRSite` variable, and each environment resolves it to its own URL.

In **Power Apps (canvas)**, access is via a `LookUp` against the `Environment Variable Values` table, or more directly using the environment variables data source exposed in the app. In **model-driven apps** and business rules, the integration is native.

An important canvas performance detail: read the variable once in `OnStart` and store it in a global variable (`Set`) instead of running the `LookUp` repeatedly across screens.

**The classic mistake: a default value leaking into production**

The most incident-prone point is confusing *default value* with *current value*. If you fill in the default value in the definition during development, that value travels inside the managed solution. When you import into production **without** setting a specific current value, the environment falls back to the default — which is usually the Dev value.

Practical recommendation:

1. **Do not populate default values** with real Dev endpoints. Leave the definition without a default value (or with a clearly invalid placeholder).
2. Set the **current value** for each environment in a controlled way: manually through the UI, via a `deployment settings file` in pipelines, or by script.
3. In **Power Platform Pipelines** and Azure DevOps, use the deployment settings file (`--settings-file`) to automatically inject the correct value for each environment during the managed solution import.

**Environment variables and the ALM pipeline**

This is where the feature proves its real worth. In a Dev → Test → UAT → Prod pipeline, the same managed solution package is promoted unchanged. What differs between environments stays isolated in the deployment settings, versioned in the repository. That means idempotent deployments, reviewable in a pull request, with no manual post-import intervention — the opposite of the "open the flow and swap the URL by hand" scenario.

Combine this with per-environment **DLP policies** and **connection references** (which follow the same logic of separating definition from value, but for connections) and you have a solid governance foundation: no credentials in code, no Dev values leaking into Production, everything auditable.

**Wrapping up**

Parameterizing solutions with environment variables is one of those investments that feel like bureaucracy at first and turn into hours saved on every release. If your company runs Power Platform at scale and still relies on manual tweaks for each environment promotion, Dynamic Soluções can help you build a complete ALM pipeline — from environment design to automated deployment settings — whether through our support plans or a dedicated consulting project.
