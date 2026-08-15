---
title: "Power BI Embedded: como escolher a capacidade e o modelo de app"
description: "Entenda como incorporar relatórios Power BI em aplicações próprias: diferenças entre App Owns Data e User Owns Data, capacidades A/EM/F, service principal e controle de custo."
date: '2026-08-15 13:36:26'
---
Incorporar relatórios do Power BI dentro de uma aplicação própria — um portal SaaS, um sistema interno em .NET ou um Power Pages — é uma demanda recorrente em projetos de médio e grande porte. Mas o Power BI Embedded costuma ser mal entendido: muita gente confunde "embutir um relatório num iframe" com a arquitetura real do embedding, e a conta de licenciamento chega errada no fim do projeto. Este post organiza as decisões de arquitetura e custo que você precisa fechar **antes** de escrever a primeira linha de código de embed.

**App Owns Data vs. User Owns Data: a decisão que define tudo**

Existem dois cenários de embedding, e eles não são intercambiáveis:

* **User Owns Data (embed for your organization)** — cada usuário final tem sua própria licença Power BI (Pro ou PPU) e faz login com a conta corporativa dele no Entra ID. O relatório aparece dentro do seu app, mas quem autentica e é cobrado é o usuário. Serve para cenários internos, onde todos os consumidores já têm conta e licença. Não precisa de capacidade dedicada se os usuários forem Pro/PPU.
* **App Owns Data (embed for your customers)** — os usuários finais **não** têm conta no Power BI nem no seu tenant. Sua aplicação usa uma identidade de serviço (service principal ou uma master user) para autenticar contra o Power BI, gera um *embed token* e entrega o relatório. É o modelo para SaaS externo, portais de clientes e produtos comerciais. Aqui a capacidade dedicada (A/EM/F SKU) é **obrigatória**.

Escolher errado entre os dois é a causa número um de retrabalho: começar em User Owns Data e descobrir na homologação que os clientes externos não têm — e nunca terão — conta no tenant significa refazer toda a camada de autenticação.

**Qual capacidade contratar: A, EM ou F**

Para App Owns Data você precisa de uma capacidade que suporte embedding:

1. **A SKUs (Power BI Embedded no Azure)** — pagos por hora, com pause/resume. É o modelo clássico para ISVs: você liga a capacidade quando precisa e pausa fora do horário de pico para economizar. A1 a A6 escalam v-cores e memória.
2. **EM SKUs** — compra mensal/anual via contrato, sem pause/resume. Fazem sentido só em cenários específicos de compromisso.
3. **F SKUs (Microsoft Fabric)** — a direção atual. As capacidades Fabric (F2, F4, F8...) incluem a carga de trabalho Power BI e suportam embedding, além de pause/resume no F. Se o projeto vive num contexto de dados moderno (Lakehouse, Direct Lake, Dataflows Gen2), consolidar tudo numa F SKU costuma ser mais coerente do que manter uma A SKU isolada.

O dimensionamento não é sobre número de usuários e sim sobre **carga concorrente de renderização**: número de page loads simultâneos, complexidade dos visuais e volume de queries por segundo. Comece medindo com o cenário real e use as métricas da própria capacidade para subir/descer de SKU — superprovisionar "por garantia" é dinheiro parado.

**Service principal em vez de master user**

Um erro comum em provas de conceito é autenticar com uma *master user* — uma conta Pro real, com usuário e senha, usada pela aplicação. Funciona, mas é frágil: quebra quando a senha expira, exige exceção de MFA e some quando a pessoa dona da conta sai da empresa.

O padrão correto para produção é o **service principal**: um app registration no Entra ID, com um secret ou certificado guardado no Azure Key Vault, habilitado nas configurações de administração do Power BI ("Allow service principals to use Power BI APIs") e adicionado como membro do workspace. Ele não consome licença de usuário, não expira do mesmo jeito e é auditável. Toda a geração de embed token passa por ele.

**Embed token, RLS e segurança**

O *embed token* é o que sua aplicação gera no backend e entrega ao frontend para renderizar o relatório. Alguns pontos que separam um embed seguro de um vazamento de dados:

* Nunca gere o token no cliente — ele nasce no seu servidor, com o service principal, e tem validade curta.
* Em App Owns Data, o Power BI não sabe quem é o usuário final. A segregação de dados por cliente é responsabilidade sua, via **RLS aplicada no embed token**: você passa a role e a identidade efetiva (`EffectiveIdentity`) na geração do token, e o modelo filtra os dados. Se um cliente não pode ver os dados de outro, isso tem que estar no token, não só no filtro visual.
* Filtro de visual (`JavaScript filters`) é conveniência de UX, não segurança — dá para burlar. Segurança de linha vive no modelo com RLS.

**Custo: onde o projeto estoura**

O Power BI Embedded surpreende no orçamento por três motivos:

* A capacidade é cobrada **enquanto está ligada**, independentemente de ter um único acesso. Sem pause/resume automatizado fora do horário comercial, você paga 24x7 por uma capacidade que usa 8x5.
* Autores de relatório e desenvolvedores que publicam conteúdo ainda precisam de licença **Pro ou PPU** — a capacidade cobre o consumo embedado, não a autoria.
* Escalar de SKU por causa de picos pontuais é caro; muitas vezes o gargalo é modelagem ruim (cardinalidade, DAX pesado, falta de star schema), e otimizar o modelo evita a subida de capacidade.

Um bom projeto de embedding trata a capacidade como recurso elástico: automação de pause/resume via Azure, alertas nas métricas da capacidade e revisão periódica do SKU contra a carga real.

**Fechando**

Power BI Embedded é poderoso, mas exige que você feche duas decisões de arquitetura logo no começo: o modelo de embed (App Owns Data vs. User Owns Data) e o tipo de capacidade (A, EM ou F/Fabric), sempre com service principal e RLS no token para segurança. Errar isso significa refazer autenticação em homologação ou receber uma fatura de capacidade três vezes maior que o necessário.

Se sua empresa está avaliando incorporar Power BI num produto ou portal e quer dimensionar a capacidade certa, estruturar o service principal e a segurança de dados sem retrabalho, a Dynamic Soluções pode ajudar tanto no desenho da arquitetura quanto no licenciamento Microsoft e no suporte contínuo da solução.



Embedding Power BI reports inside your own application — a SaaS portal, an internal .NET system, or Power Pages — is a recurring requirement in mid to large projects. Yet Power BI Embedded is often misunderstood: many people confuse "dropping a report into an iframe" with the actual embedding architecture, and the licensing bill lands wrong at the end of the project. This post lays out the architecture and cost decisions you need to settle **before** writing the first line of embed code.

**App Owns Data vs. User Owns Data: the decision that drives everything**

There are two embedding scenarios, and they are not interchangeable:

* **User Owns Data (embed for your organization)** — each end user has their own Power BI license (Pro or PPU) and signs in with their corporate Entra ID account. The report shows up inside your app, but the user is the one authenticating and being billed. This fits internal scenarios where every consumer already has an account and a license. You don't need dedicated capacity if the users are Pro/PPU.
* **App Owns Data (embed for your customers)** — the end users have **no** account in Power BI or in your tenant. Your application uses a service identity (a service principal or a master user) to authenticate against Power BI, generates an *embed token*, and serves the report. This is the model for external SaaS, customer portals, and commercial products. Here dedicated capacity (A/EM/F SKU) is **mandatory**.

Picking the wrong one is the number one cause of rework: starting with User Owns Data and discovering during UAT that external customers don't — and never will — have an account in the tenant means rebuilding the entire authentication layer.

**Which capacity to buy: A, EM, or F**

For App Owns Data you need a capacity that supports embedding:

1. **A SKUs (Power BI Embedded in Azure)** — billed hourly, with pause/resume. This is the classic ISV model: you turn capacity on when needed and pause it off-peak to save money. A1 through A6 scale v-cores and memory.
2. **EM SKUs** — monthly/annual purchase through a contract, no pause/resume. They only make sense in specific commitment scenarios.
3. **F SKUs (Microsoft Fabric)** — the current direction. Fabric capacities (F2, F4, F8...) include the Power BI workload and support embedding, plus pause/resume on F. If the project lives in a modern data context (Lakehouse, Direct Lake, Dataflows Gen2), consolidating everything into an F SKU is usually more coherent than keeping an isolated A SKU.

Sizing isn't about the number of users but about **concurrent rendering load**: simultaneous page loads, visual complexity, and queries per second. Start by measuring with the real scenario and use the capacity's own metrics to move up or down a SKU — over-provisioning "just to be safe" is money left on the table.

**Service principal instead of a master user**

A common mistake in proofs of concept is authenticating with a *master user* — a real Pro account, with username and password, used by the application. It works, but it's fragile: it breaks when the password expires, requires an MFA exception, and vanishes when the account owner leaves the company.

The correct production pattern is the **service principal**: an app registration in Entra ID, with a secret or certificate stored in Azure Key Vault, enabled in the Power BI admin settings ("Allow service principals to use Power BI APIs") and added as a workspace member. It consumes no user license, doesn't expire the same way, and is auditable. All embed token generation flows through it.

**Embed token, RLS, and security**

The *embed token* is what your application generates in the backend and hands to the frontend to render the report. A few points that separate secure embedding from a data leak:

* Never generate the token on the client — it's created on your server, with the service principal, and has a short lifetime.
* In App Owns Data, Power BI doesn't know who the end user is. Data segregation per customer is your responsibility, via **RLS applied in the embed token**: you pass the role and the effective identity (`EffectiveIdentity`) when generating the token, and the model filters the data. If one customer must not see another's data, that has to live in the token, not just in a visual filter.
* Visual filters (`JavaScript filters`) are a UX convenience, not security — they can be bypassed. Row-level security lives in the model with RLS.

**Cost: where the project blows up**

Power BI Embedded surprises budgets for three reasons:

* Capacity is billed **while it's running**, whether or not there was a single access. Without automated pause/resume outside business hours, you pay 24x7 for a capacity used 8x5.
* Report authors and developers who publish content still need a **Pro or PPU** license — capacity covers embedded consumption, not authoring.
* Scaling up a SKU because of occasional spikes is expensive; often the bottleneck is poor modeling (cardinality, heavy DAX, no star schema), and optimizing the model avoids the capacity bump.

A good embedding project treats capacity as an elastic resource: pause/resume automation via Azure, alerts on capacity metrics, and periodic SKU review against the real load.

**Wrapping up**

Power BI Embedded is powerful, but it demands that you settle two architecture decisions right at the start: the embed model (App Owns Data vs. User Owns Data) and the capacity type (A, EM, or F/Fabric), always with a service principal and RLS in the token for security. Getting this wrong means reworking authentication during UAT or receiving a capacity bill three times bigger than needed.

If your company is evaluating embedding Power BI into a product or portal and wants to size the right capacity, structure the service principal and data security without rework, Dynamic Soluções can help with both the architecture design and the Microsoft licensing and ongoing support of the solution.
