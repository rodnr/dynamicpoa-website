---
title: "Dataverse: segurança por roles e business units na prática"
description: "Modelar segurança no Dataverse vai muito além de dar acesso: entenda como roles, business units, teams e níveis de acesso definem quem enxerga o quê."
date: '2026-07-15 20:35:12'
---
Quando uma solução em Model-driven app ou Dynamics 365 cresce, a pergunta deixa de ser "como dou acesso ao usuário" e passa a ser "como garanto que cada pessoa enxergue exatamente os registros que deveria — nem mais, nem menos". No Dataverse, essa resposta não está numa única configuração: ela é resultado da interação entre **business units**, **security roles**, **teams** e **níveis de acesso por tabela**. Entender esse modelo é o que separa uma solução que escala de uma que vira um pesadelo de suporte.

**Os quatro pilares do modelo de segurança**

O controle de acesso no Dataverse combina camadas que se sobrepõem. Vale entender cada uma isoladamente antes de compô-las:

1. **Business units (unidades de negócio)** — formam uma hierarquia em árvore dentro do ambiente. Todo usuário pertence a exatamente uma business unit, e ela é o "limite natural" de propriedade dos registros. Servem para segmentar dados por filial, região ou divisão.
2. **Security roles (funções de segurança)** — definem *o que* o usuário pode fazer (criar, ler, escrever, excluir, atribuir, compartilhar) em cada tabela, e *até onde* essa permissão alcança.
3. **Teams (equipes)** — agrupam usuários. Podem ser owner teams (donos de registros) ou access teams (compartilhamento pontual). Uma role atribuída a um team vale para todos os seus membros.
4. **Níveis de acesso** — o "raio de alcance" de cada privilégio dentro da role.

**Os níveis de acesso são o coração do modelo**

Para cada privilégio de tabela, a security role define um dos cinco níveis de acesso, representados pelos círculos preenchidos na interface:

* **None (nenhum)** — sem permissão para aquela ação.
* **User (usuário)** — só registros que o próprio usuário possui ou que foram compartilhados com ele.
* **Business Unit (unidade de negócio)** — registros da própria business unit do usuário.
* **Parent: Child Business Units (unidade e filhas)** — a própria business unit e todas as descendentes na hierarquia.
* **Organization (organização)** — todos os registros do ambiente, independentemente de propriedade.

É aqui que a maioria dos erros de modelagem acontece. Dar Organization em Read "para não dar problema" é comum e destrói o isolamento de dados que a hierarquia de business units tenta garantir. O nível certo depende do dado: um cadastro de produtos global pode ser Organization em leitura, enquanto oportunidades comerciais quase sempre pedem User ou Business Unit.

**Roles são cumulativas — nunca subtrativas**

Um ponto que confunde quem vem de outros modelos de permissão: no Dataverse, quando um usuário tem várias roles, o acesso é sempre o **maior** entre elas. Não existe "role de negação". Se uma role concede Read no nível Organization e outra concede User, o usuário terá Organization. Isso muda a estratégia de design: você constrói roles pequenas e combináveis (por exemplo, uma role base de acesso mais roles funcionais específicas) em vez de tentar criar uma role restritiva que "tira" acesso.

**Owner teams x access teams: quando usar cada um**

Além das roles, o compartilhamento entre unidades é resolvido por teams:

* **Owner teams** podem *possuir* registros e receber security roles. Use quando um grupo de pessoas de diferentes business units precisa colaborar de forma estruturada e recorrente sobre os mesmos registros — o registro pertence ao team, não a um indivíduo.
* **Access teams** não recebem roles e não possuem registros; concedem acesso pontual a registros específicos, geralmente via template configurado no formulário. Ideal para cenários dinâmicos ("esta conta específica precisa ser vista por estes três consultores") sem inflar a hierarquia de business units.

Uma regra prática: se o padrão de compartilhamento é previsível e por grupo, use owner teams; se é caso a caso e por registro, use access teams.

**Column-level security para dados sensíveis**

Quando o requisito não é sobre *quais registros*, mas sobre *quais campos*, entra a segurança em nível de coluna (field security). Com ela, você protege campos específicos — como salário, CPF ou dados bancários — permitindo que um usuário veja o registro mas não determinada coluna. Isso é feito por Field Security Profiles, atribuídos a usuários ou teams, e evita a armadilha de duplicar tabelas só para esconder uma informação sensível.

**Recomendações de arquitetura**

Alguns princípios que aplicamos em projetos de Model-driven app e Dynamics 365:

* Desenhe a hierarquia de business units **antes** de criar roles — mudar a árvore depois com dados em produção é caro e arriscado.
* Comece com o menor nível de acesso possível e amplie sob demanda, nunca o contrário.
* Prefira poucas roles combináveis a dezenas de roles quase idênticas — reduz drasticamente a manutenção.
* Documente a matriz "tabela x privilégio x nível" de cada role; ela é a fonte da verdade em auditorias.
* Teste sempre com um usuário real de cada perfil, não apenas com a conta de administrador de sistema (que vê tudo e esconde erros de modelagem).

Modelar segurança no Dataverse é uma decisão de arquitetura, não um ajuste final de projeto. Se sua empresa está estruturando apps model-driven ou Dynamics 365 em escala e precisa garantir isolamento de dados, compliance e performance sem transformar a governança em gargalo, a Dynamic Soluções pode ajudar a desenhar e revisar esse modelo — do primeiro rascunho da hierarquia de business units até a matriz completa de roles.



When a Model-driven app or Dynamics 365 solution grows, the question stops being "how do I give the user access" and becomes "how do I ensure each person sees exactly the records they should — no more, no less". In Dataverse, the answer isn't a single setting: it results from the interaction between **business units**, **security roles**, **teams** and **table-level access levels**. Understanding this model is what separates a solution that scales from one that becomes a support nightmare.

**The four pillars of the security model**

Access control in Dataverse combines overlapping layers. It's worth understanding each one in isolation before composing them:

1. **Business units** — form a tree hierarchy within the environment. Every user belongs to exactly one business unit, which acts as the "natural boundary" of record ownership. They segment data by branch, region or division.
2. **Security roles** — define *what* the user can do (create, read, write, delete, assign, share) on each table, and *how far* that permission reaches.
3. **Teams** — group users together. They can be owner teams (record owners) or access teams (ad-hoc sharing). A role assigned to a team applies to all its members.
4. **Access levels** — the "reach" of each privilege within the role.

**Access levels are the heart of the model**

For each table privilege, the security role defines one of five access levels, shown as the filled circles in the interface:

* **None** — no permission for that action.
* **User** — only records the user owns or that were shared with them.
* **Business Unit** — records within the user's own business unit.
* **Parent: Child Business Units** — the user's own business unit plus all descendants in the hierarchy.
* **Organization** — all records in the environment, regardless of ownership.

This is where most modeling mistakes happen. Granting Organization on Read "just to avoid trouble" is common and destroys the data isolation the business unit hierarchy is meant to enforce. The right level depends on the data: a global product catalog might be Organization on read, while sales opportunities almost always call for User or Business Unit.

**Roles are cumulative — never subtractive**

One point that confuses people coming from other permission models: in Dataverse, when a user has multiple roles, access is always the **highest** among them. There is no "deny role". If one role grants Read at Organization level and another grants User, the user gets Organization. This changes the design strategy: you build small, combinable roles (for example, a base access role plus specific functional roles) instead of trying to create a restrictive role that "takes away" access.

**Owner teams vs. access teams: when to use each**

Beyond roles, cross-unit sharing is solved through teams:

* **Owner teams** can *own* records and be assigned security roles. Use them when a group of people from different business units needs to collaborate in a structured, recurring way over the same records — the record belongs to the team, not to an individual.
* **Access teams** are not assigned roles and don't own records; they grant ad-hoc access to specific records, usually via a template configured on the form. Ideal for dynamic scenarios ("this specific account needs to be seen by these three consultants") without inflating the business unit hierarchy.

A rule of thumb: if the sharing pattern is predictable and group-based, use owner teams; if it's case by case and per record, use access teams.

**Column-level security for sensitive data**

When the requirement isn't about *which records* but about *which fields*, column-level security (field security) comes in. With it, you protect specific fields — such as salary, tax ID or banking details — allowing a user to see the record but not a given column. This is done through Field Security Profiles, assigned to users or teams, and avoids the trap of duplicating tables just to hide sensitive information.

**Architecture recommendations**

Some principles we apply in Model-driven app and Dynamics 365 projects:

* Design the business unit hierarchy **before** creating roles — changing the tree later, with data in production, is costly and risky.
* Start with the smallest possible access level and expand on demand, never the other way around.
* Prefer a few combinable roles over dozens of nearly identical ones — it drastically reduces maintenance.
* Document the "table x privilege x level" matrix for each role; it's the source of truth in audits.
* Always test with a real user of each profile, not just the system administrator account (which sees everything and hides modeling errors).

Modeling security in Dataverse is an architecture decision, not a final project tweak. If your company is structuring model-driven apps or Dynamics 365 at scale and needs to guarantee data isolation, compliance and performance without turning governance into a bottleneck, Dynamic Soluções can help design and review this model — from the first draft of the business unit hierarchy to the complete role matrix.
