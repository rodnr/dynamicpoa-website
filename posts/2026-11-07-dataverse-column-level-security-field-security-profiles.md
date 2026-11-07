---
title: "Dataverse: column-level security e field security profiles na prática"
description: "Como proteger campos sensíveis no Dataverse sem fragmentar security roles: o que o field security ativa, como funcionam os profiles e os limites em escala."
date: '2026-11-07 17:59:21'
---
No Dataverse, a maioria das discussões sobre segurança gira em torno de security roles, business units e sharing — ou seja, **quem enxerga quais registros**. Mas existe uma camada que opera em outra dimensão e costuma ser esquecida até a primeira auditoria de LGPD: a segurança por coluna (column-level security). Ela responde a uma pergunta diferente: dentro de um registro que o usuário já pode ler, **quais campos específicos ele pode ver, editar ou nem saber que existem**.

Este post cobre como o column-level security funciona de verdade, como os field security profiles se encaixam no modelo cumulativo de roles, e onde ele tem limites que você precisa conhecer antes de prometer conformidade para o compliance.

**O que o column-level security realmente controla**

Quando você habilita Enable column security em uma coluna (via maker portal ou metadados), ela sai do controle das security roles tradicionais e passa a ser governada exclusivamente por field security profiles. A partir daí, três permissões independentes passam a valer por coluna:

* **Read** — se o usuário pode ver o valor. Sem read, o campo aparece mascarado (`********`) no formulário e nas views.
* **Update** — se o usuário pode gravar valor na coluna.
* **Create** — se o usuário pode informar valor no momento da criação do registro.

O ponto crítico: **sem um field security profile que conceda a permissão, ninguém vê o campo — nem quem tem security role de System Administrator**. O admin precisa ser adicionado explicitamente ao profile (ou usar o profile padrão System Administrator, que vem com acesso total). Isso surpreende muita gente que assume que "admin vê tudo" como no resto da plataforma.

**Field security profiles: o container de permissões**

Um field security profile é um objeto que agrupa:

1. **Usuários e teams** associados ao profile.
2. **As colunas seguras** e, para cada uma, o conjunto Read/Update/Create.

Assim como security roles, os profiles são **cumulativos**: se um usuário está em dois profiles e um concede Read e o outro não, o usuário acaba com Read. Não existe negação explícita — a ausência de concessão é que nega. Isso tem uma consequência prática importante: você não "tira" acesso de alguém removendo uma permissão de um profile isolado; precisa garantir que **nenhum** profile ao qual ele pertence concede aquela coluna.

Na prática, o padrão que funciona bem é associar profiles a **owner teams** alinhados a cargos (ex.: "RH - Dados Sensíveis", "Financeiro - Remuneração") em vez de usuário por usuário, pela mesma razão que você usa teams para roles: manutenção e previsibilidade.

**Mascaramento: além do all-or-nothing**

Versões mais recentes trouxeram column masking, que permite exibir o valor parcialmente em vez de esconder por completo. Em vez de `********`, você pode mostrar `***-**-1234` para um documento, por exemplo. Isso é configurado por tipo de mascaramento na coluna e respeita o perfil: quem tem Read vê o valor cheio, quem não tem vê a versão mascarada em vez de bloqueio total. É útil para casos de suporte, onde o atendente precisa confirmar os últimos dígitos sem acessar o dado completo.

**Onde o column-level security tem limites**

Esta é a parte que separa quem configura de quem desenha arquitetura de conformidade:

* **Não é filtro de linha.** Column security não impede o usuário de ver o *registro* — só esconde campos. Se a regra de negócio é "esse usuário não pode nem saber que esse contato existe", column security não resolve; isso é business unit/sharing.
* **Plugins e flows em contexto de sistema ignoram.** Código rodando como service principal ou plugin em contexto de sistema lê a coluna normalmente. A segurança é aplicada na borda da API para o usuário chamador, não no armazenamento. Uma integração mal desenhada pode vazar o campo que você "escondeu" na UI.
* **Impacto em busca e ordenação.** Campos seguros têm comportamento restrito em quick find, advanced find e ordenação para quem não tem Read — e isso pode confundir usuários que esperam filtrar por um campo que não enxergam.
* **Rollup e calculated columns.** Um rollup ou calculated que depende de uma coluna segura pode expor indiretamente o valor agregado. Modele a dependência com cuidado.
* **Power BI e exportação.** O respeito à column security depende de como o dado é consumido. Exportações e conexões diretas ao TDS endpoint aplicam a segurança do usuário conectado; pipelines que usam service principal, não. Reveja isso antes de assumir que o campo está protegido no relatório.
* **Custo de manutenção em escala.** Cada coluna segura multiplica a matriz profiles × colunas. Dezenas de campos sensíveis com dezenas de perfis viram um emaranhado difícil de auditar. Seja cirúrgico: proteja só o que a regulação/compliance realmente exige.

**Um roteiro de decisão prático**

1. A restrição é sobre **quais registros** o usuário vê? Use business unit, security role por nível de acesso ou sharing — não column security.
2. A restrição é sobre **campos específicos dentro de registros que ele já acessa** (salário, CPF, dados de saúde)? Aí sim, column security.
3. O usuário precisa ver uma **versão parcial** do campo? Use column masking em vez de bloqueio total.
4. Alguma **integração, plugin ou pipeline de dados** toca essa coluna em contexto de sistema? Trate a proteção também nessa camada — a UI não é suficiente.
5. A matriz profiles × colunas está ficando grande? Consolide em poucos profiles alinhados a owner teams por cargo e documente o que cada um libera.

Column-level security é uma das ferramentas mais subutilizadas e, ao mesmo tempo, mais mal compreendidas do Dataverse. Quando bem aplicada, resolve de forma limpa aquele requisito de "o analista vê o cadastro do funcionário mas não a remuneração" — sem duplicar formulários nem criar tabelas paralelas. Quando mal aplicada, gera falsa sensação de conformidade com campos vazando por integrações.

Se sua empresa precisa estruturar segurança de dados sensíveis no Dataverse com rastreabilidade para auditoria, a Dynamic Soluções pode ajudar a desenhar o modelo de roles, business units e field security profiles de ponta a ponta — incluindo as camadas de integração e Power BI que costumam ficar de fora do checklist de conformidade.



In Dataverse, most security discussions revolve around security roles, business units, and sharing — that is, **who can see which records**. But there is a layer that operates on a different axis and tends to be forgotten until the first data-protection audit: column-level security. It answers a different question: within a record the user can already read, **which specific fields can they see, edit, or not even know exist**.

This post covers how column-level security actually works, how field security profiles fit into the cumulative role model, and where it has limits you need to understand before promising compliance.

**What column-level security really controls**

When you Enable column security on a column (via the maker portal or metadata), it leaves the control of traditional security roles and becomes governed exclusively by field security profiles. From then on, three independent permissions apply per column:

* **Read** — whether the user can see the value. Without read, the field appears masked (`********`) on forms and views.
* **Update** — whether the user can write a value to the column.
* **Create** — whether the user can supply a value when the record is created.

The critical point: **without a field security profile granting the permission, nobody sees the field — not even someone with a System Administrator security role**. The admin must be explicitly added to the profile (or use the default System Administrator profile, which ships with full access). This surprises many people who assume "admin sees everything" as elsewhere on the platform.

**Field security profiles: the permission container**

A field security profile is an object that groups:

1. **Users and teams** associated with the profile.
2. **The secured columns** and, for each one, the Read/Update/Create set.

Like security roles, profiles are **cumulative**: if a user is in two profiles and one grants Read while the other doesn't, the user ends up with Read. There is no explicit deny — it's the absence of a grant that denies. This has an important practical consequence: you don't "remove" someone's access by taking a permission out of a single profile; you must ensure **no** profile they belong to grants that column.

In practice, the pattern that works well is associating profiles with **owner teams** aligned to job roles (e.g., "HR - Sensitive Data", "Finance - Compensation") rather than user by user — for the same reason you use teams for roles: maintainability and predictability.

**Masking: beyond all-or-nothing**

More recent versions introduced column masking, which lets you display the value partially instead of hiding it entirely. Instead of `********`, you can show `***-**-1234` for a document number, for example. This is configured per masking type on the column and respects the profile: users with Read see the full value, those without see the masked version instead of a full block. It's useful for support scenarios, where an agent needs to confirm the last digits without accessing the full data.

**Where column-level security has limits**

This is the part that separates those who configure from those who design compliance architecture:

* **It's not a row filter.** Column security doesn't stop the user from seeing the *record* — it only hides fields. If the business rule is "this user can't even know this contact exists," column security doesn't solve it; that's business unit/sharing.
* **Plugins and flows in system context ignore it.** Code running as a service principal or a plugin in system context reads the column normally. Security is applied at the API edge for the calling user, not at storage. A poorly designed integration can leak the field you "hid" in the UI.
* **Impact on search and sorting.** Secured fields behave in a restricted way in quick find, advanced find, and sorting for those without Read — and this can confuse users who expect to filter by a field they can't see.
* **Rollup and calculated columns.** A rollup or calculated column that depends on a secured column can indirectly expose the aggregated value. Model the dependency carefully.
* **Power BI and exports.** Respecting column security depends on how the data is consumed. Exports and direct connections to the TDS endpoint apply the connected user's security; pipelines using a service principal do not. Review this before assuming the field is protected in the report.
* **Maintenance cost at scale.** Each secured column multiplies the profiles × columns matrix. Dozens of sensitive fields across dozens of profiles become a tangle that's hard to audit. Be surgical: protect only what regulation/compliance actually requires.

**A practical decision guide**

1. Is the restriction about **which records** the user sees? Use business unit, access-level security roles, or sharing — not column security.
2. Is the restriction about **specific fields within records they already access** (salary, tax ID, health data)? Then yes, column security.
3. Does the user need to see a **partial version** of the field? Use column masking instead of a full block.
4. Does any **integration, plugin, or data pipeline** touch this column in system context? Handle protection at that layer too — the UI alone isn't enough.
5. Is the profiles × columns matrix growing large? Consolidate into a few profiles aligned to owner teams by job role and document what each one unlocks.

Column-level security is one of the most underused and, at the same time, most misunderstood tools in Dataverse. When applied well, it cleanly solves that "the analyst sees the employee record but not the compensation" requirement — without duplicating forms or creating parallel tables. When applied poorly, it creates a false sense of compliance with fields leaking through integrations.

If your company needs to structure sensitive-data security in Dataverse with audit traceability, Dynamic Soluções can help design the roles, business units, and field security profiles model end to end — including the integration and Power BI layers that often get left out of the compliance checklist.
