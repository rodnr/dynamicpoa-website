---
title: "Power Pages: autenticação com Entra ID External ID na prática"
description: "Configurar login externo em portais Power Pages vai além de ligar um provedor. Veja como estruturar autenticação com Entra External ID, table permissions e web roles."
date: '2026-07-22 15:03:01'
---
Quem coloca um portal Power Pages em produção descobre rápido que o login é só a ponta do iceberg. A pergunta que separa um portal seguro de um vazamento de dados não é "como o usuário faz login", e sim "o que esse usuário autenticado consegue ver e fazer no Dataverse depois de logar". Este post trata da camada de identidade e autorização de portais externos usando **Microsoft Entra External ID** (a evolução do Azure AD B2C), que é onde a maioria dos projetos erra.

**O fim do Azure AD B2C e o que muda com o External ID**

A Microsoft anunciou que o Azure AD B2C não recebe novos tenants desde 2025 e a estratégia recomendada para cenários customer-facing passou a ser o **Entra External ID** (external tenants). Na prática, para portais Power Pages isso significa:

* Um **tenant externo** separado do seu tenant corporativo (workforce), com seu próprio diretório de usuários (clientes, parceiros, fornecedores) que não consomem licenças internas.
* Suporte a self-service sign-up, social logins (Google, Facebook), one-time passcode por e-mail e MFA para usuários externos.
* Fluxos OpenID Connect padrão — o Power Pages consome via provedor OpenID Connect, não mais via a integração legada de B2C.

Se você ainda opera um portal com B2C existente, ele continua funcionando, mas qualquer projeto novo deve nascer em External ID. Não vale a pena investir arquitetura em algo que está em fim de linha.

**Identity provider não é autorização**

O erro conceitual mais comum: configurar o provedor de identidade (o "como faço login") e achar que o portal está seguro. External ID responde apenas "quem é você". A autorização — "o que você pode fazer" — mora inteiramente no Power Pages / Dataverse, em três camadas que precisam trabalhar juntas:

1. **Web roles** — papéis atribuídos ao contato autenticado (ex.: `Cliente`, `Gestor Parceiro`). Existe também a role anônima (visitante não logado) e a role de usuário autenticado padrão.
2. **Table permissions** — definem CRUD sobre tabelas do Dataverse, com escopo: Global, Contact (só os registros do próprio contato), Account (registros da conta relacionada), Self ou Parent. É aqui que se resolve o multi-tenant lógico: cada cliente vê só os seus pedidos.
3. **Page permissions e column security** — controle no nível de página web e de coluna.

Uma table permission sem web role associada simplesmente não faz efeito. E o escopo **Global** em uma table permission de dados sensíveis é a causa número um de exposição indevida em portais — todo usuário autenticado passa a enxergar todos os registros.

**O escopo Contact/Account é o coração do modelo**

Em portais B2B, o padrão robusto é amarrar cada usuário externo (um **Contact** no Dataverse) a uma **Account**. Com isso:

* Escopo **Contact** libera ao usuário apenas os registros onde ele é o dono/relacionado — ideal para "minhas solicitações".
* Escopo **Account** libera os registros de toda a empresa dele — útil quando um gestor precisa ver o que a equipe abriu.
* A relação de lookup entre a tabela de dados e Contact/Account precisa estar corretamente definida, senão a permission não consegue calcular o escopo e nada aparece (ou pior, aparece com Global mal configurado).

Modelar isso errado gera dois sintomas clássicos: o portal mostra tela em branco (permissão restritiva demais / relação faltando) ou mostra dados de outros clientes (Global onde deveria ser Contact).

**Licenciamento: o custo que aparece na fatura errada**

Power Pages mudou o modelo de licenciamento e isso impacta arquitetura. Hoje há duas lógicas principais:

* **Autenticado** — cobrado por usuário autenticado/mês ou por capacity pack de logins mensais. Ideal medir volume esperado de logins únicos antes de fechar o modelo.
* **Anônimo** — cobrado por visitantes anônimos em pacotes, para portais majoritariamente públicos.

O ponto de atenção: usar Power Apps (canvas/model-driven) para expor dados a usuários externos **não** é substituto barato de Power Pages — o licenciamento de usuários externos via Power Apps é restritivo e caro em escala. Para público externo real, Power Pages com o modelo de autenticados costuma ser mais previsível. Dimensione pelo pico de logins únicos mensais, não pela base total de cadastros.

**Checklist prático antes de ir para produção**

* Provedor OpenID Connect apontando para o tenant External ID (não B2C legado).
* Toda table permission de dados de negócio revisada — nenhum Global indevido.
* Web roles atribuídas e mapeadas às permissions correspondentes.
* Relação Contact → Account modelada e populada para escopos Contact/Account.
* Column security aplicada em campos sensíveis (documentos, valores, dados pessoais).
* Teste com um contato real de baixo privilégio, não com o admin — o admin enxerga tudo e mascara falhas de permissão.

Autenticação em Power Pages é menos sobre "qual botão de login" e mais sobre desenhar corretamente a malha web roles + table permissions + escopo Contact/Account sobre o Dataverse. É o tipo de camada que, mal configurada, passa despercebida até o dia em que um cliente vê o pedido de outro.

Se sua empresa está construindo ou revisando um portal externo com Power Pages e quer garantir que o modelo de autenticação e autorização esteja sólido — sem exposição de dados e sem surpresa no licenciamento — a Dynamic Soluções pode apoiar com consultoria especializada e planos de suporte contínuo.



Anyone who ships a Power Pages portal to production quickly learns that login is just the tip of the iceberg. The question that separates a secure portal from a data breach isn't "how does the user log in" but "what can this authenticated user see and do in Dataverse once logged in". This post covers the identity and authorization layer of external portals using **Microsoft Entra External ID** (the evolution of Azure AD B2C), which is where most projects go wrong.

**The end of Azure AD B2C and what changes with External ID**

Microsoft announced that Azure AD B2C stopped accepting new tenants in 2025, and the recommended strategy for customer-facing scenarios is now **Entra External ID** (external tenants). In practice, for Power Pages portals this means:

* A **separate external tenant** from your corporate (workforce) tenant, with its own directory of users (customers, partners, suppliers) that don't consume internal licenses.
* Support for self-service sign-up, social logins (Google, Facebook), one-time passcode via email, and MFA for external users.
* Standard OpenID Connect flows — Power Pages consumes it via an OpenID Connect provider, no longer through the legacy B2C integration.

If you still run an existing B2C-based portal, it keeps working, but any new project should start on External ID. It makes no sense to invest architecture in something that's being sunset.

**Identity provider isn't authorization**

The most common conceptual mistake: configuring the identity provider (the "how do I log in") and assuming the portal is secure. External ID answers only "who are you". Authorization — "what can you do" — lives entirely within Power Pages / Dataverse, across three layers that must work together:

1. **Web roles** — roles assigned to the authenticated contact (e.g., `Customer`, `Partner Manager`). There's also the anonymous role (non-logged-in visitor) and the default authenticated-user role.
2. **Table permissions** — define CRUD over Dataverse tables, with a scope: Global, Contact (only the contact's own records), Account (records of the related account), Self, or Parent. This is where logical multi-tenancy is solved: each customer sees only their own orders.
3. **Page permissions and column security** — control at the web page and column level.

A table permission with no associated web role simply has no effect. And the **Global** scope on a table permission for sensitive data is the number-one cause of undue exposure in portals — every authenticated user suddenly sees every record.

**The Contact/Account scope is the heart of the model**

In B2B portals, the robust pattern is to tie each external user (a **Contact** in Dataverse) to an **Account**. With that:

* **Contact** scope grants the user only records where they are the owner/related — ideal for "my requests".
* **Account** scope grants the records of their entire company — useful when a manager needs to see what the team submitted.
* The lookup relationship between the data table and Contact/Account must be correctly defined; otherwise the permission can't compute the scope and nothing shows up (or worse, shows up with a misconfigured Global).

Modeling this wrong produces two classic symptoms: the portal shows a blank screen (overly restrictive permission / missing relationship) or shows other customers' data (Global where it should be Contact).

**Licensing: the cost that lands on the wrong invoice**

Power Pages changed its licensing model, and that impacts architecture. Today there are two main logics:

* **Authenticated** — billed per authenticated user/month or per capacity pack of monthly logins. Best to measure the expected volume of unique logins before locking in the model.
* **Anonymous** — billed per anonymous visitor in packs, for mostly public portals.

The caveat: using Power Apps (canvas/model-driven) to expose data to external users is **not** a cheap substitute for Power Pages — external user licensing via Power Apps is restrictive and expensive at scale. For genuine external audiences, Power Pages with the authenticated model tends to be more predictable. Size it by the peak of monthly unique logins, not by the total registered base.

**Practical checklist before going to production**

* OpenID Connect provider pointing to the External ID tenant (not legacy B2C).
* Every business-data table permission reviewed — no improper Global.
* Web roles assigned and mapped to the corresponding permissions.
* Contact → Account relationship modeled and populated for Contact/Account scopes.
* Column security applied to sensitive fields (documents, amounts, personal data).
* Test with a real low-privilege contact, not with the admin — the admin sees everything and masks permission flaws.

Authentication in Power Pages is less about "which login button" and more about correctly designing the web roles + table permissions + Contact/Account scope mesh over Dataverse. It's the kind of layer that, when misconfigured, goes unnoticed until the day one customer sees another's order.

If your company is building or reviewing an external portal with Power Pages and wants to make sure the authentication and authorization model is solid — no data exposure and no licensing surprises — Dynamic Soluções can help with specialized consulting and ongoing support plans.
