---
title: "Power BI: RLS dinâmica com Dataverse e USERPRINCIPALNAME"
description: "Como implementar Row-Level Security dinâmica no Power BI usando USERPRINCIPALNAME e tabelas de mapeamento, evitando roles estáticas que não escalam em ambientes corporativos."
date: '2026-07-18 14:19:40'
---
Quando um relatório do Power BI sai do piloto e passa a atender centenas de usuários com visões diferentes dos mesmos dados, o modelo de segurança vira o gargalo. É comum ver times criando uma role estática para cada gerente, cada região ou cada unidade de negócio — e depois passando meses editando roles manualmente a cada mudança de organograma. Row-Level Security (RLS) **dinâmica** resolve isso movendo a lógica de permissão para dentro do modelo de dados, em vez de espalhá-la em dezenas de roles.

**RLS estática vs. dinâmica: qual o problema real**

Na RLS estática você define uma role por recorte de dados ("Vendas Sul", "Vendas Norte") e associa manualmente os usuários a cada role no Power BI Service. Funciona para poucos recortes, mas não escala: cada nova região vira uma role nova, cada troca de gestor vira edição manual, e a auditoria de quem enxerga o quê fica dispersa entre o modelo e a tela de segurança do workspace.

A RLS dinâmica usa **uma única role** cuja expressão DAX filtra as linhas com base na identidade do usuário logado, resolvida em tempo de execução. A regra de negócio (quem vê o quê) passa a viver em uma tabela de dados — que você pode alimentar a partir do Dataverse, do RH ou de qualquer fonte de verdade — em vez de estar codificada em roles.

**As funções DAX que sustentam a RLS dinâmica**

Duas funções fazem o trabalho pesado:

* `USERPRINCIPALNAME()` retorna o UPN (geralmente o e-mail corporativo) do usuário autenticado no Power BI Service. É o valor que você deve usar em produção — `USERNAME()` retorna `DOMÍNIO\usuário` no desktop e pode divergir do que chega no Service.
* `LOOKUPVALUE()` ou uma relação no modelo permite cruzar esse UPN com uma tabela de mapeamento usuário → escopo.

O padrão mais robusto é ter uma tabela de segurança (por exemplo `dimSeguranca` com colunas `UPN` e `UnidadeNegocio`), relacioná-la à dimensão correspondente e aplicar o filtro na role. A expressão da role fica simplesmente:

`[UPN] = USERPRINCIPALNAME()`

na tabela de segurança, e a propagação pela relação faz o resto.

**Integração com Dataverse: a fonte de verdade das permissões**

Em ambientes que já rodam Power Platform, o Dataverse costuma ser o lugar certo para manter o mapeamento de acesso. Em vez de manter uma planilha paralela, você modela uma tabela no Dataverse que relaciona cada usuário (ou security role / business unit) aos escopos de dados que ele pode ver, e importa essa tabela para o modelo do Power BI via conector Dataverse.

Vantagens práticas:

1. A mesma governança de acesso que já rege os apps model-driven passa a alimentar o BI, evitando divergência entre "o que o app deixa fazer" e "o que o relatório deixa ver".
2. Mudanças de organograma atualizadas no Dataverse refletem no relatório no próximo refresh, sem tocar em role nenhuma.
3. É possível reaproveitar a hierarquia de business units para montar visões em cascata (um gestor vê a própria unidade e as subordinadas), usando uma tabela de hierarquia (path) no modelo.

**Hierarquias e o caso do gestor que vê o time inteiro**

O cenário mais comum e mais mal resolvido é o gerente que precisa ver os próprios dados mais os de todos os subordinados. Resolver isso com RLS estática é inviável. Com RLS dinâmica, você monta uma tabela de hierarquia onde cada linha lista um usuário e todos os "ancestrais" que têm direito de vê-lo (padrão de bridge/ponte). O filtro `USERPRINCIPALNAME()` bate na coluna do ancestral, e a relação propaga o acesso para todas as linhas subordinadas. Manter essa tabela derivada do organograma do Dataverse é o que torna a solução sustentável.

**Erros que quebram RLS dinâmica em produção**

* **Testar só no Desktop.** O DAX de RLS deve ser validado com "Exibir como" (View as) informando um UPN real; o comportamento no Service é o que vale.
* **Divergência de UPN.** Se a tabela de mapeamento guarda o e-mail em formato diferente do UPN do Entra ID (maiúsculas, alias antigo, domínio secundário), o filtro devolve zero linhas silenciosamente. Padronize e considere `LOWER()` nas comparações.
* **Relações bidirecionais mal configuradas** entre fato e segurança podem vazar linhas ou degradar performance. Prefira filtro unidirecional da tabela de segurança para as dimensões.
* **RLS não protege medidas sensíveis por si só** — ela filtra linhas, não colunas. Para mascarar colunas específicas é preciso Object-Level Security (OLS) ou lógica de medida.
* **Composite models e Direct Lake** têm particularidades: em cenários DirectQuery/Direct Lake, valide o desempenho do filtro dinâmico contra o volume real, porque cada consulta passa a carregar a resolução de segurança.

**Quando vale a pena**

RLS dinâmica compensa a partir do momento em que o número de recortes de acesso cresce ou muda com frequência. Para dois ou três públicos fixos, roles estáticas ainda são mais simples de auditar. Para dezenas de unidades, hierarquias de gestão e integração com a governança já existente no Dataverse, a versão dinâmica é a única que não vira dívida técnica.

Estruturar RLS dinâmica confiável exige modelagem cuidadosa, alinhamento com a segurança do Dataverse e testes que refletem o comportamento no Service, não só no Desktop. Se sua empresa está escalando relatórios corporativos e precisa garantir que cada usuário veja exatamente o que deve — nem mais, nem menos — a Dynamic Soluções pode ajudar a desenhar e implementar esse modelo de ponta a ponta.



When a Power BI report leaves the pilot stage and starts serving hundreds of users who need different views of the same data, the security model becomes the bottleneck. It's common to see teams creating a static role for each manager, each region or each business unit — then spending months manually editing roles every time the org chart changes. **Dynamic** Row-Level Security (RLS) solves this by moving the permission logic into the data model instead of scattering it across dozens of roles.

**Static vs. dynamic RLS: the real problem**

With static RLS you define one role per data slice ("Sales South", "Sales North") and manually assign users to each role in the Power BI Service. It works for a handful of slices, but it doesn't scale: each new region becomes a new role, each manager change becomes a manual edit, and auditing who sees what gets split between the model and the workspace security screen.

Dynamic RLS uses **a single role** whose DAX expression filters rows based on the identity of the logged-in user, resolved at runtime. The business rule (who sees what) now lives in a data table — which you can feed from Dataverse, HR or any source of truth — instead of being hardcoded into roles.

**The DAX functions behind dynamic RLS**

Two functions do the heavy lifting:

* `USERPRINCIPALNAME()` returns the UPN (usually the corporate email) of the user authenticated in the Power BI Service. This is the value you should use in production — `USERNAME()` returns `DOMAIN\user` on the desktop and may differ from what arrives in the Service.
* `LOOKUPVALUE()` or a model relationship lets you cross that UPN against a user → scope mapping table.

The most robust pattern is to have a security table (for example `dimSecurity` with `UPN` and `BusinessUnit` columns), relate it to the corresponding dimension and apply the filter in the role. The role expression is simply:

`[UPN] = USERPRINCIPALNAME()`

on the security table, and propagation through the relationship handles the rest.

**Dataverse integration: the source of truth for permissions**

In environments already running Power Platform, Dataverse is usually the right place to keep the access mapping. Instead of maintaining a parallel spreadsheet, you model a Dataverse table relating each user (or security role / business unit) to the data scopes they can see, and import that table into the Power BI model via the Dataverse connector.

Practical advantages:

1. The same access governance that already rules the model-driven apps now feeds the BI, avoiding divergence between "what the app lets you do" and "what the report lets you see".
2. Org chart changes updated in Dataverse are reflected in the report on the next refresh, without touching a single role.
3. You can reuse the business unit hierarchy to build cascading views (a manager sees their own unit and the subordinate ones), using a hierarchy (path) table in the model.

**Hierarchies and the manager who sees the whole team**

The most common and worst-handled scenario is the manager who needs to see their own data plus that of all subordinates. Solving this with static RLS is unfeasible. With dynamic RLS, you build a hierarchy table where each row lists a user and all the "ancestors" entitled to see them (a bridge pattern). The `USERPRINCIPALNAME()` filter matches the ancestor column, and the relationship propagates access to all subordinate rows. Keeping this table derived from the Dataverse org chart is what makes the solution sustainable.

**Mistakes that break dynamic RLS in production**

* **Testing only in Desktop.** RLS DAX must be validated with "View as" supplying a real UPN; the Service behavior is what counts.
* **UPN mismatch.** If the mapping table stores email in a different format than the Entra ID UPN (uppercase, old alias, secondary domain), the filter silently returns zero rows. Standardize and consider `LOWER()` in comparisons.
* **Poorly configured bidirectional relationships** between fact and security can leak rows or degrade performance. Prefer a one-directional filter from the security table to the dimensions.
* **RLS alone does not protect sensitive measures** — it filters rows, not columns. To mask specific columns you need Object-Level Security (OLS) or measure logic.
* **Composite models and Direct Lake** have quirks: in DirectQuery/Direct Lake scenarios, validate the dynamic filter's performance against real volume, since each query now carries the security resolution.

**When it's worth it**

Dynamic RLS pays off once the number of access slices grows or changes frequently. For two or three fixed audiences, static roles are still simpler to audit. For dozens of units, management hierarchies and integration with existing Dataverse governance, the dynamic version is the only one that doesn't turn into technical debt.

Structuring reliable dynamic RLS requires careful modeling, alignment with Dataverse security and tests that reflect Service behavior, not just Desktop. If your company is scaling corporate reports and needs to ensure each user sees exactly what they should — no more, no less — Dynamic Soluções can help design and implement this model end to end.
