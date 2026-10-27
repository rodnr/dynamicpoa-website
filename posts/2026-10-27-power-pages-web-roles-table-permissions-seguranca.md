---
title: "Power Pages: web roles e table permissions sem brecha de seguranca"
description: "Como estruturar autorizacao em portais Power Pages combinando web roles, table permissions e os quatro escopos de acesso, evitando vazamento de dados externos."
date: '2026-10-27 18:38:45'
---
Em um portal Power Pages, o modelo de seguranca do Dataverse (business units, security roles, hierarquia) **nao se aplica** aos visitantes. Um usuario externo autenticado nao tem uma security role do Dataverse; ele acessa dados por uma camada propria de autorizacao do portal, composta por **web roles** e **table permissions**. Entender como essas duas pecas se encaixam e a diferenca entre acertar a seguranca de um portal e expor a base inteira para a internet.

**Web roles: a identidade de autorizacao do portal**

Web role e o equivalente, no portal, a uma role de aplicacao. Todo contato autenticado recebe uma ou mais web roles, e e sobre elas que as table permissions sao concedidas. Dois pontos criticos de configuracao:

* Existe uma web role marcada como **Authenticated Users Role** e outra como **Anonymous Users Role**. Essas duas sao especiais: a primeira e atribuida automaticamente a todo contato que faz login; a segunda vale para quem nao autenticou. Table permissions ligadas a web role anonima ficam visiveis para a internet publica.
* Web roles sao cumulativas. Se um contato tem tres web roles, ele recebe a uniao de todas as table permissions concedidas a elas. Nao existe "deny" que sobreponha um "allow" de outra role, entao conceder permissao ampla em uma role generica e dificil de revogar depois.

**Table permissions e os quatro escopos de acesso**

A table permission e onde voce autoriza, de fato, uma web role a ler/criar/escrever/apagar linhas de uma tabela. O campo mais importante e o **Access Type (scope)**, que define *quais* linhas a permissao cobre:

1. **Global** — todas as linhas da tabela. Poderoso e perigoso: usado por engano em uma tabela de pedidos, expoe os pedidos de todos os clientes para qualquer usuario daquela web role.
2. **Contact** — apenas linhas relacionadas ao contato logado, via um relacionamento lookup ate a tabela Contact. E o escopo correto para "meus dados".
3. **Account** — linhas relacionadas a conta (empresa) do contato, via o relacionamento parent customer. Serve para cenarios B2B onde varios usuarios da mesma empresa compartilham dados.
4. **Self** — a propria linha de contato do usuario, para ele editar o proprio cadastro.

Alem desses, ha o escopo por **relacionamento filho** (child table permission), em que uma permissao herda o escopo da permissao pai atraves de um relacionamento. E assim que voce libera, por exemplo, os itens de um pedido sem reconfigurar o escopo em cada tabela filha.

**O ponto que derruba portais: permissao nao e opcional, e deny by default**

Diferente de uma lista do SharePoint, no Power Pages **nenhuma linha e exibida sem uma table permission explicita**. Isso e bom para seguranca, mas gera o sintoma classico: "minha pagina nao mostra nada". A causa quase sempre e uma dessas:

* Falta uma table permission para a tabela, ou ela nao esta ligada a web role certa.
* O escopo Contact foi escolhido, mas o relacionamento lookup ate o Contact nao esta configurado no campo da permissao, entao nenhuma linha casa.
* A pagina usa uma lista/formulario que depende de uma tabela filha sem a child table permission correspondente.

Ha ainda a configuracao global **Table Permissions** no site: quando ligada (padrao em sites modernos), o deny by default vale. Em sites antigos migrados, se essa chave estiver desligada, o portal pode exibir dados *sem* respeitar table permissions — um risco grave que deve ser auditado em qualquer herdeiro de portal legado.

**Column security e a camada que table permission nao cobre**

Table permission controla *linhas* e *operacoes*, mas nao esconde colunas sensiveis dentro de uma linha que o usuario legitimamente ve. Para isso, o portal respeita **column-level security** do Dataverse: colunas em um field security profile so aparecem se o perfil permitir. O cuidado e que a aplicacao disso no portal depende de configuracao e nem toda camada de acesso (Liquid vs Web API) a trata de forma identica — mascarar dado sensivel so na tela nunca substitui a seguranca de coluna no servidor.

**Roteiro de hardening de um portal Power Pages**

1. Comece com a Anonymous Users Role sem nenhuma table permission de leitura alem do estritamente publico (catalogo, paginas institucionais).
2. Use escopo **Contact/Account** como padrao para dados transacionais; reserve **Global** para dados genuinamente publicos ou catalogos somente leitura.
3. Modele os relacionamentos filhos com child table permissions em vez de repetir escopo Global nas tabelas de detalhe.
4. Confirme que a chave global de Table Permissions do site esta **ligada**, principalmente em portais migrados.
5. Adicione column security para campos sensiveis (documentos, valores internos) e valide pela Web API, nao so pela renderizacao Liquid.
6. Teste cada pagina com um contato de cada web role, incluindo um nao autenticado, antes de publicar.

Portais externos sao, por definicao, superficie de ataque exposta a internet. Em projetos de Power Pages integrados ao Dataverse, a Dynamic Solucoes modela web roles, table permissions e column security junto com o desenho de dados — e os planos de suporte continuo mantem essa configuracao auditada a cada evolucao do portal, para que uma nova pagina nunca abra uma brecha que ninguem percebeu.



In a Power Pages portal, the Dataverse security model (business units, security roles, hierarchy) **does not apply** to visitors. An authenticated external user has no Dataverse security role; they reach data through the portal's own authorization layer, made of **web roles** and **table permissions**. Understanding how these two pieces fit together is the difference between securing a portal properly and exposing your entire database to the internet.

**Web roles: the portal's authorization identity**

A web role is the portal equivalent of an application role. Every authenticated contact gets one or more web roles, and table permissions are granted against them. Two critical configuration points:

* One web role is flagged as the **Authenticated Users Role** and another as the **Anonymous Users Role**. These two are special: the first is assigned automatically to every contact who logs in; the second covers unauthenticated visitors. Table permissions tied to the anonymous web role are visible to the public internet.
* Web roles are cumulative. If a contact has three web roles, they get the union of all table permissions granted to them. There is no "deny" that overrides an "allow" from another role, so granting broad access on a generic role is hard to walk back later.

**Table permissions and the four access scopes**

The table permission is where you actually authorize a web role to read/create/write/delete rows of a table. The most important field is the **Access Type (scope)**, which defines *which* rows the permission covers:

1. **Global** — all rows in the table. Powerful and dangerous: used by mistake on an orders table, it exposes every customer's orders to any user in that web role.
2. **Contact** — only rows related to the logged-in contact, via a lookup relationship to the Contact table. This is the correct scope for "my data".
3. **Account** — rows related to the contact's account (company), via the parent customer relationship. It fits B2B scenarios where multiple users from the same company share data.
4. **Self** — the user's own contact row, so they can edit their own profile.

Beyond those, there is the **child relationship** scope (child table permission), where a permission inherits the scope of its parent permission through a relationship. That is how you release, for example, the line items of an order without reconfiguring scope on every child table.

**The thing that breaks portals: permission is not optional, it's deny by default**

Unlike a SharePoint list, in Power Pages **no row is shown without an explicit table permission**. That is good for security, but it produces the classic symptom: "my page shows nothing". The cause is almost always one of these:

* A table permission is missing, or it isn't tied to the right web role.
* The Contact scope was chosen, but the lookup relationship to Contact isn't set on the permission, so no row matches.
* The page uses a list/form that depends on a child table without the corresponding child table permission.

There is also the global **Table Permissions** site setting: when enabled (default on modern sites), deny by default applies. On old migrated sites, if that toggle is off, the portal may display data *without* respecting table permissions — a serious risk that must be audited in any legacy portal you inherit.

**Column security and the layer table permission doesn't cover**

Table permission controls *rows* and *operations*, but it doesn't hide sensitive columns inside a row the user legitimately sees. For that, the portal respects Dataverse **column-level security**: columns in a field security profile only appear if the profile allows it. The caveat is that its enforcement in the portal depends on configuration, and not every access layer (Liquid vs Web API) treats it identically — masking sensitive data only on screen never replaces column security on the server.

**A hardening checklist for a Power Pages portal**

1. Start the Anonymous Users Role with no read table permission beyond the strictly public (catalog, institutional pages).
2. Use **Contact/Account** scope as the default for transactional data; reserve **Global** for genuinely public data or read-only catalogs.
3. Model child relationships with child table permissions instead of repeating Global scope on detail tables.
4. Confirm the site's global Table Permissions toggle is **on**, especially on migrated portals.
5. Add column security for sensitive fields (documents, internal amounts) and validate through the Web API, not just Liquid rendering.
6. Test every page with a contact from each web role, including an unauthenticated one, before publishing.

External portals are, by definition, an attack surface exposed to the internet. In Power Pages projects integrated with Dataverse, Dynamic Solucoes models web roles, table permissions and column security alongside the data design — and the ongoing support plans keep that configuration audited at every portal evolution, so a new page never opens a gap nobody noticed.
