---
title: "Model-driven vs Canvas app: como decidir a arquitetura certa"
description: "Escolher entre model-driven e canvas app define a escalabilidade do seu projeto. Veja critérios técnicos de decisão, cenários híbridos e armadilhas de custo."
date: '2026-07-21 15:03:05'
---
Uma das decisões mais subestimadas em projetos de Power Apps é a escolha entre **model-driven app** e **canvas app**. Muitos times decidem por hábito — usam canvas porque é o que conhecem — e só percebem o erro quando o app cresce, o número de telas explode e a manutenção vira um pesadelo. A escolha errada nesse ponto compromete escalabilidade, governança e custo por anos.

Este post não é um "o que é cada um", e sim um guia de decisão para quem já constrói apps em escala e precisa justificar a arquitetura tecnicamente.

**A diferença de paradigma que importa**

A distinção fundamental não é visual, é de origem dos dados. O **model-driven app** é gerado a partir do modelo de dados do Dataverse: você define tabelas, colunas, relacionamentos, formulários e views, e a interface é renderizada automaticamente sobre esse metadata. Você descreve *o que* os dados são, não *como* eles aparecem pixel a pixel.

O **canvas app** é o oposto: você tem controle total sobre o layout, arrasta cada controle, posiciona cada botão e escreve fórmulas Power Fx que ligam esses controles a qualquer fonte de dados (SharePoint, SQL, Dataverse, conectores premium). É liberdade de design em troca de responsabilidade sobre cada detalhe.

Essa diferença de origem determina quase todas as outras propriedades: consistência, esforço de manutenção, integração com segurança e limites de escala.

**Quando o model-driven é a escolha certa**

* **Processos de negócio complexos e orientados a dados** — CRM, gestão de casos, cadeias de aprovação com muitas entidades relacionadas. Se o coração do app é um modelo relacional rico, o model-driven entrega isso quase sem código.
* **Segurança granular** — model-driven herda diretamente o modelo de segurança do Dataverse: security roles, business units, row-level e column-level security. Você não reimplementa permissões na camada de UI.
* **Volume alto de registros** — as views e grids do model-driven lidam nativamente com paginação e grandes volumes, sem esbarrar nos limites de delegation que atormentam canvas apps.
* **Consistência corporativa** — todos os formulários seguem o mesmo padrão automaticamente. Não há divergência de UX entre telas construídas por pessoas diferentes.
* **Base para Dynamics 365** — se há chance de o projeto evoluir para módulos de Sales, Customer Service ou Field Service, o model-driven já está no mesmo trilho.

**Quando o canvas app faz mais sentido**

* **Experiência de UI específica e pixel-perfect** — apps mobile para operadores de chão de fábrica, telas com layout de marca forte, fluxos guiados em kiosk.
* **Múltiplas fontes de dados fora do Dataverse** — se os dados vivem em SharePoint, SQL Azure ou APIs diversas e não há motivo para migrar tudo para o Dataverse.
* **Dispositivos e recursos nativos** — câmera, GPS, código de barras, uso offline. O canvas expõe esses recursos diretamente.
* **Interações não tabulares** — dashboards operacionais, formulários com lógica condicional visual intensa, wizards de várias etapas.

**O padrão híbrido: o melhor dos dois mundos**

A maturidade real aparece quando o time para de tratar a escolha como binária. Dois padrões híbridos resolvem a maioria dos cenários:

1. **Canvas embutido dentro de model-driven** — você usa um **custom page** (a evolução do embedded canvas app) para entregar uma tela com UX customizada dentro de um app model-driven que cuida da navegação, segurança e do grosso dos formulários. Ideal quando 90% do app é CRUD sobre Dataverse, mas uma tela específica precisa de layout diferenciado.
2. **Dataverse como backend do canvas** — mesmo em um canvas app, usar o Dataverse como fonte de dados (em vez de SharePoint) traz delegation robusta, segurança por roles e integração com o resto da plataforma, sem abrir mão do controle de UI.

Essa combinação costuma ser a recomendação em projetos corporativos: Dataverse como camada de dados e segurança, model-driven para o miolo transacional, e canvas/custom pages onde a experiência exige.

**O fator custo e licenciamento**

Aqui há uma armadilha comum. Ambos os tipos de app rodando sobre Dataverse exigem licença **Power Apps Premium** (per app ou per user) para os usuários — não estão cobertos pelas licenças de Microsoft 365. A ilusão de que "canvas com SharePoint é de graça" desaparece no momento em que você adota o Dataverse ou qualquer conector premium.

A recomendação prática: decida a arquitetura de dados primeiro (Dataverse ou não), porque isso define tanto o tipo de app quanto o custo de licenciamento. Escolher canvas apenas para "economizar licença" e reconstruir segurança e delegation na mão quase sempre sai mais caro no total de propriedade.

**Como decidir na prática**

Antes de abrir o Power Apps Studio, responda:

* O núcleo do app é um modelo relacional complexo? → model-driven.
* A segurança precisa ser granular por linha/coluna? → Dataverse + model-driven.
* A UI precisa ser altamente customizada ou mobile-first? → canvas (ou custom page dentro de model-driven).
* Os dados já estão fora do Dataverse e não há razão para migrar? → canvas.
* O projeto pode virar Dynamics 365 amanhã? → model-driven desde o início.

Escolher a arquitetura certa no começo é o que separa um app que escala de um projeto que precisa ser reescrito em dois anos. Na Dynamic Soluções, ajudamos empresas a desenhar essa decisão com base em dados reais de uso, volume e roadmap — evitando tanto o retrabalho quanto o desperdício de licenciamento. Se sua equipe está prestes a iniciar um projeto de porte na Power Platform, vale começar pela arquitetura, não pela primeira tela.



One of the most underestimated decisions in Power Apps projects is choosing between a **model-driven app** and a **canvas app**. Many teams decide out of habit — they use canvas because it's what they know — and only realize the mistake when the app grows, the number of screens explodes, and maintenance becomes a nightmare. The wrong choice here compromises scalability, governance, and cost for years.

This post isn't a "what each one is"; it's a decision guide for people who already build apps at scale and need to justify the architecture technically.

**The paradigm difference that matters**

The fundamental distinction isn't visual, it's about where the data comes from. The **model-driven app** is generated from the Dataverse data model: you define tables, columns, relationships, forms, and views, and the interface is rendered automatically over that metadata. You describe *what* the data is, not *how* it looks pixel by pixel.

The **canvas app** is the opposite: you have full control over the layout, drag each control, position each button, and write Power Fx formulas that bind those controls to any data source (SharePoint, SQL, Dataverse, premium connectors). It's design freedom in exchange for responsibility over every detail.

This difference in origin determines almost all the other properties: consistency, maintenance effort, security integration, and scale limits.

**When model-driven is the right choice**

* **Complex, data-driven business processes** — CRM, case management, approval chains with many related entities. If the heart of the app is a rich relational model, model-driven delivers it with almost no code.
* **Granular security** — model-driven inherits the Dataverse security model directly: security roles, business units, row-level and column-level security. You don't reimplement permissions at the UI layer.
* **High record volume** — model-driven views and grids handle paging and large volumes natively, without hitting the delegation limits that plague canvas apps.
* **Corporate consistency** — all forms follow the same pattern automatically. There's no UX divergence between screens built by different people.
* **Foundation for Dynamics 365** — if there's a chance the project evolves into Sales, Customer Service, or Field Service modules, model-driven is already on the same track.

**When a canvas app makes more sense**

* **Specific, pixel-perfect UI experience** — mobile apps for shop-floor operators, screens with strong brand layout, guided kiosk flows.
* **Multiple data sources outside Dataverse** — if the data lives in SharePoint, Azure SQL, or various APIs and there's no reason to migrate everything to Dataverse.
* **Native devices and features** — camera, GPS, barcode, offline use. Canvas exposes these directly.
* **Non-tabular interactions** — operational dashboards, forms with heavy visual conditional logic, multi-step wizards.

**The hybrid pattern: the best of both worlds**

Real maturity shows when the team stops treating the choice as binary. Two hybrid patterns solve most scenarios:

1. **Canvas embedded inside model-driven** — you use a **custom page** (the evolution of the embedded canvas app) to deliver a screen with custom UX inside a model-driven app that handles navigation, security, and the bulk of the forms. Ideal when 90% of the app is CRUD over Dataverse, but one specific screen needs a differentiated layout.
2. **Dataverse as the canvas backend** — even in a canvas app, using Dataverse as the data source (instead of SharePoint) brings robust delegation, role-based security, and integration with the rest of the platform, without giving up UI control.

This combination is usually the recommendation in corporate projects: Dataverse as the data and security layer, model-driven for the transactional core, and canvas/custom pages where the experience demands it.

**The cost and licensing factor**

Here's a common trap. Both app types running over Dataverse require a **Power Apps Premium** license (per app or per user) for users — they're not covered by Microsoft 365 licenses. The illusion that "canvas with SharePoint is free" vanishes the moment you adopt Dataverse or any premium connector.

Practical recommendation: decide the data architecture first (Dataverse or not), because that defines both the app type and the licensing cost. Choosing canvas just to "save on licensing" and rebuilding security and delegation by hand almost always costs more in total ownership.

**How to decide in practice**

Before opening Power Apps Studio, answer:

* Is the core of the app a complex relational model? → model-driven.
* Does security need to be granular per row/column? → Dataverse + model-driven.
* Does the UI need to be highly customized or mobile-first? → canvas (or a custom page inside model-driven).
* Is the data already outside Dataverse with no reason to migrate? → canvas.
* Could the project become Dynamics 365 tomorrow? → model-driven from the start.

Choosing the right architecture at the start is what separates an app that scales from a project that has to be rewritten in two years. At Dynamic Soluções, we help companies design this decision based on real usage data, volume, and roadmap — avoiding both rework and licensing waste. If your team is about to start a sizeable Power Platform project, it's worth starting with the architecture, not the first screen.
