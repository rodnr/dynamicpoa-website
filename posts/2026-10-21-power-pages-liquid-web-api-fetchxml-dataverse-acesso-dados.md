---
title: "Power Pages: Liquid vs Web API vs FetchXML para acessar Dataverse"
description: "Entenda os tres caminhos de acesso ao Dataverse em Power Pages: Liquid server-side, Portal Web API no browser e FetchXML, com seguranca, performance e decisao."
date: '2026-10-21 17:58:20'
---
Quando um portal Power Pages precisa ler e gravar dados no Dataverse, a pergunta nao e *se* da pra fazer, e *por qual camada*. O mesmo registro pode ser renderizado via Liquid no servidor, consultado via Portal Web API no browser ou extraido via FetchXML. Cada caminho tem um modelo de seguranca, um custo de performance e um ponto de falha diferente. Escolher errado produz portais lentos, vazamento de dados ou codigo que trava quando o volume cresce.

**Liquid: renderizacao server-side, antes da pagina chegar ao cliente**

Liquid e a linguagem de template que o Power Pages avalia no servidor, durante o render da pagina. Tudo que voce monta com `{% fetchxml %}`, `entityview`, `entitylist` ou os objetos globais (`user`, `website`, `page`) acontece *antes* do HTML ser enviado ao browser. Isso tem consequencias praticas:

* **O dado ja chega renderizado** — bom para SEO, porque o conteudo esta no HTML inicial, nao depende de JavaScript.
* **As table permissions sao aplicadas automaticamente** quando voce usa `entitylist`/`entityview`. Com a tag `{% fetchxml %}` crua tambem ha enforcement, mas e mais facil escrever uma query que ignora o contexto do usuario se nao tomar cuidado.
* **Nao ha interatividade** — cada mudanca exige recarregar a pagina. Liquid e para *exibir*, nao para montar telas dinamicas.

Use Liquid para listas, detalhes, blocos de conteudo e qualquer coisa que precise aparecer no HTML por SEO ou por simplicidade. Evite montar logica de negocio complexa em Liquid — a linguagem e limitada de proposito.

**Portal Web API: CRUD no browser, com table permissions aplicadas**

A Portal Web API (distinta da Dataverse Web API de back-office) e o endpoint `/_api/<entityset>` que o portal expoe para chamadas AJAX autenticadas. E o caminho para interatividade: filtrar uma grid sem recarregar, salvar um formulario via fetch, atualizar um campo inline.

Pontos criticos de arquitetura:

* **As table permissions continuam valendo** — a Portal Web API respeita o mesmo modelo de web roles e escopos (Global, Contact, Account, Self) do resto do portal. Nao e um bypass de seguranca; e seguranca aplicada em outra camada.
* **Cada tabela e cada operacao (create/read/update/delete) precisam ser habilitadas explicitamente** em Site Settings (`Webapi/<table>/enabled` e `fields`). Se nao estiver ligado, a chamada retorna 403 — por design.
* **O dado NAO aparece no HTML inicial** — e carregado por JavaScript depois. Pessimo para SEO de conteudo publico, otimo para areas autenticadas dinamicas.
* **Suporta OData** (`$filter`, `$select`, `$expand`, `$top`), o que da paginacao e projecao de colunas no proprio request.

Use a Portal Web API para tudo que e interativo e pos-login. Nao a use para montar paginas publicas indexaveis.

**FetchXML: a linguagem de query por tras das duas**

FetchXML nao e exatamente uma terceira camada de acesso — e a linguagem de consulta que alimenta o Liquid (`{% fetchxml %}`) e os `entitylist`/`entityview`. Entender FetchXML e o que separa um portal que consulta bem de um que faz N+1 e estoura o tempo de render:

* **Selecione so as colunas necessarias** (`<attribute name="..."/>`), nunca a tabela inteira. Cada coluna a mais e peso no payload e no plano de execucao.
* **Pagine** com `count` e `page` / paging cookie. Listas sem limite que crescem com o tempo sao a causa numero um de portais que degradam em producao.
* **Cuidado com link-entity em cadeia** — joins profundos em FetchXML renderizado a cada hit de pagina custam caro. Se a agregacao e pesada, materialize no Dataverse (rollup, coluna calculada ou um registro de resumo via plugin) em vez de recalcular no portal.
* **As table permissions ainda filtram o resultado** do FetchXML em Liquid — mas uma query mal escrita pode tentar trazer muito e ser cortada de forma confusa. Teste sempre com um usuario de role restrita, nunca so com admin.

**Um roteiro de decisao**

1. **O conteudo e publico e precisa de SEO?** Liquid server-side, com FetchXML enxuto e paginado. O HTML tem que sair pronto.
2. **E area autenticada com interatividade (filtros, salvar sem recarregar)?** Portal Web API via AJAX, com as tabelas e operacoes habilitadas em Site Settings e table permissions por web role.
3. **E uma regra de negocio com efeito colateral (validacao server-side, integracao, transacao)?** Nenhum dos tres sozinho — chame um Power Automate ou plugin no Dataverse a partir do formulario, e deixe o portal so apresentar o resultado.
4. **A consulta ja esta lenta no render?** Antes de trocar de camada, revise o FetchXML: colunas, paginacao, link-entity e cache (object cache do Power Pages ajuda muito em listas que mudam pouco).

O erro mais comum em portais Power Pages nao e escolher a camada errada de forma obvia — e assumir que table permissions "estao ligadas por padrao". Nao estao: sem permissao configurada, usuario autenticado nao ve nada, e usuario anonimo muito menos. E o inverso tambem acontece: habilitar a Portal Web API em uma tabela sensivel sem restringir campos expoe dados que nunca deveriam sair do back-office.

Estruturar o acesso a dados de um portal externo com a seguranca e a performance certas e exatamente o tipo de decisao que pesa quando o portal vai para producao com usuarios reais. Se sua empresa esta construindo ou revisando um portal Power Pages integrado ao Dataverse, a Dynamic Solucoes ajuda a desenhar essa arquitetura — da modelagem de table permissions ao tuning de FetchXML — pela nossa consultoria e pelos planos de suporte continuo.



When a Power Pages portal needs to read and write Dataverse data, the question isn't *whether* it's possible — it's *through which layer*. The same record can be rendered via server-side Liquid, queried via Portal Web API in the browser, or pulled via FetchXML. Each path has a different security model, a different performance cost, and a different failure point. Choosing wrong produces slow portals, data leakage, or code that breaks when volume grows.

**Liquid: server-side rendering, before the page reaches the client**

Liquid is the templating language Power Pages evaluates on the server, during page render. Everything you build with `{% fetchxml %}`, `entityview`, `entitylist` or the global objects (`user`, `website`, `page`) happens *before* the HTML is sent to the browser. That has practical consequences:

* **The data arrives already rendered** — good for SEO, because the content is in the initial HTML and doesn't depend on JavaScript.
* **Table permissions are applied automatically** when you use `entitylist`/`entityview`. The raw `{% fetchxml %}` tag also enforces them, but it's easier to write a query that ignores the user context if you're not careful.
* **There's no interactivity** — every change requires a page reload. Liquid is for *displaying*, not for building dynamic screens.

Use Liquid for lists, detail views, content blocks and anything that needs to appear in the HTML for SEO or simplicity. Avoid putting complex business logic in Liquid — the language is deliberately limited.

**Portal Web API: browser-side CRUD, with table permissions enforced**

The Portal Web API (distinct from the back-office Dataverse Web API) is the `/_api/<entityset>` endpoint the portal exposes for authenticated AJAX calls. It's the path to interactivity: filtering a grid without reloading, saving a form via fetch, updating a field inline.

Critical architecture points:

* **Table permissions still apply** — the Portal Web API respects the same web roles and scopes (Global, Contact, Account, Self) as the rest of the portal. It's not a security bypass; it's security enforced in another layer.
* **Each table and each operation (create/read/update/delete) must be explicitly enabled** in Site Settings (`Webapi/<table>/enabled` and `fields`). If it's not on, the call returns 403 — by design.
* **The data does NOT appear in the initial HTML** — it's loaded by JavaScript afterwards. Terrible for SEO of public content, excellent for dynamic authenticated areas.
* **It supports OData** (`$filter`, `$select`, `$expand`, `$top`), giving you paging and column projection in the request itself.

Use the Portal Web API for everything interactive and post-login. Don't use it to build public, indexable pages.

**FetchXML: the query language behind both**

FetchXML isn't exactly a third access layer — it's the query language that feeds Liquid (`{% fetchxml %}`) and `entitylist`/`entityview`. Understanding FetchXML is what separates a portal that queries well from one that does N+1 and blows the render budget:

* **Select only the columns you need** (`<attribute name="..."/>`), never the whole table. Every extra column is weight on the payload and the execution plan.
* **Paginate** with `count` and `page` / paging cookie. Unbounded lists that grow over time are the number-one cause of portals that degrade in production.
* **Watch out for chained link-entity** — deep joins in FetchXML rendered on every page hit are expensive. If the aggregation is heavy, materialize it in Dataverse (rollup, calculated column, or a summary record via plugin) instead of recomputing it in the portal.
* **Table permissions still filter the FetchXML result** in Liquid — but a badly written query can try to pull too much and get cut off in confusing ways. Always test with a restricted-role user, never just as admin.

**A decision checklist**

1. **Is the content public and does it need SEO?** Server-side Liquid, with lean, paginated FetchXML. The HTML has to come out ready.
2. **Is it an authenticated area with interactivity (filters, save without reload)?** Portal Web API via AJAX, with the tables and operations enabled in Site Settings and table permissions per web role.
3. **Is it a business rule with side effects (server-side validation, integration, transaction)?** None of the three alone — call a Power Automate flow or a Dataverse plugin from the form, and let the portal just present the result.
4. **Is the query already slow at render?** Before switching layers, review the FetchXML: columns, pagination, link-entity, and cache (Power Pages object cache helps a lot on lists that change little).

The most common mistake in Power Pages portals isn't picking the wrong layer in an obvious way — it's assuming table permissions are "on by default". They aren't: without a configured permission, an authenticated user sees nothing, and an anonymous user even less. And the reverse happens too: enabling the Portal Web API on a sensitive table without restricting fields exposes data that should never leave the back-office.

Structuring an external portal's data access with the right security and performance is exactly the kind of decision that bites when the portal goes live with real users. If your company is building or reviewing a Power Pages portal integrated with Dataverse, Dynamic Solucoes helps design that architecture — from table permission modeling to FetchXML tuning — through our consulting and ongoing support plans.
