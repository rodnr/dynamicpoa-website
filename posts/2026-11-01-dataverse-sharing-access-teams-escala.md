---
title: "Dataverse: controle de acesso com sharing e access teams em escala"
description: "Entenda quando o record sharing e os access teams resolvem exceções de acesso no Dataverse sem inflar security roles, e por que o compartilhamento em massa degrada a performance."
date: '2026-11-01 18:21:28'
---
No modelo de segurança do Dataverse, a maioria dos times começa resolvendo tudo com **security roles** e **business units**. Mas há uma categoria de problema que roles não resolvem bem: o acesso **por exceção**, caso a caso, a registros específicos — aquele "preciso que fulano veja só este projeto", ou "esta oportunidade foi passada para outro vendedor manter". É aí que entram o **record sharing** e os **access teams**, duas mecânicas que compartilham acesso granular sem reescrever o desenho de roles. O problema é que ambas têm armadilhas de performance e governança que só aparecem em escala.

**Como o sharing funciona por baixo**

Quando você compartilha um registro (manualmente na UI, via `GrantAccessRequest` no SDK ou via Power Automate), o Dataverse cria uma linha na tabela de sistema **PrincipalObjectAccess (POA)**. Cada linha POA associa um principal (usuário ou team) a um registro específico, com um conjunto de direitos (Read, Write, Append, AppendTo, Assign, Share, Delete). Esse acesso é **aditivo** ao que a security role já concede — o sharing nunca tira acesso, só soma.

O ponto crítico: a POA cresce com o número de **combinações** registro × principal. Compartilhar um registro com 1 team de 200 pessoas gera 1 linha POA (o acesso é resolvido via membership do team). Compartilhar o mesmo registro individualmente com 200 usuários gera 200 linhas. Em cenários de compartilhamento em massa — por exemplo, um flow que compartilha cada novo caso com meia dúzia de usuários — a POA pode chegar a milhões de linhas, e aí **toda query** que precisa avaliar acesso (praticamente todas) fica mais lenta, porque o engine precisa resolver a POA no plano de execução. Esse é um dos gargalos de performance mais difíceis de diagnosticar no Dataverse, justamente porque a tabela é invisível no modelo de dados.

**Owner team, access team e o modo automático (access team template)**

Teams no Dataverse vêm em dois sabores, e confundi-los custa caro:

* **Owner team** — pode ser **proprietário** de registros. Tem security roles próprias, e o acesso dos membros vem dessas roles (nível Business Unit, por exemplo). Serve para "este conjunto de registros pertence a um grupo". A troca de membership é relativamente cara e a recomendação é manter o número de owner teams sob controle.
* **Access team** — **não** pode ser proprietário e não carrega security roles. Existe só para receber **compartilhamento** de registros específicos. É o mecanismo pensado para o cenário de exceção: "adicione este usuário ao time de acesso deste caso".

E há a variante poderosa: o **access team template**. Você define, por tabela, um template com um conjunto de direitos (ex.: Read + Write) e habilita um subgrid de "team members" no formulário. Quando um usuário é adicionado ao subgrid de um registro, o Dataverse cria **sob demanda** um access team invisível para aquele registro e compartilha com os direitos do template. Quando o último membro sai, o team é removido. Isso dá acesso por registro com uma UX limpa, sem explosão de teams manuais — mas cada membership ainda vira linha POA, então o volume continua importando.

**Quando usar cada mecanismo**

Um roteiro prático de decisão:

1. **O acesso segue uma regra estrutural** (departamento, região, hierarquia)? Resolva com **security roles + business units** (ou hierarchy security). Sharing aqui é antipadrão — vira dívida técnica.
2. **O acesso é por exceção, pontual e feito por um humano** no registro? **Access team template** com subgrid é o encaixe ideal: granular, autogerenciado, sem código.
3. **O acesso é por exceção, mas disparado por lógica** (um flow/plugin compartilha quando um status muda)? Use `GrantAccessRequest`/`ModifyAccessRequest` com **cautela de volume** — prefira compartilhar com um team em vez de N usuários, e **revogue** o acesso (`RevokeAccessRequest`) quando a condição deixa de valer, para não deixar POA órfã acumulando.
4. **Grupos estáveis que precisam ser owner** de registros? **Owner team** com roles.

**Armadilhas que aparecem em produção**

* **Sharing em massa via flow sem revogação** — o clássico. A POA cresce indefinidamente, ninguém mede, e seis meses depois as telas começam a demorar. Toda vez que você concede acesso programaticamente, planeje a revogação correspondente.
* **Usar sharing para contornar uma role mal desenhada** — se você está compartilhando os mesmos registros com os mesmos grupos repetidamente, a resposta certa é um owner team ou um ajuste de role, não milhares de linhas POA.
* **Cascade de share em relacionamentos** — relacionamentos com cascade `Share` propagam o compartilhamento para registros filhos. Em hierarquias profundas, um único share pode gerar uma cascata de linhas POA que você não contou.
* **Esquecer que o compartilhamento é aditivo** — sharing não implementa negação. Se o requisito é "este grupo NÃO pode ver", sharing não é a ferramenta; isso é desenho de role/BU ou column security.
* **Ownership change não limpa shares** — ao reatribuir um registro, os compartilhamentos existentes podem permanecer dependendo da configuração, deixando acesso residual.

**Fechamento**

Sharing e access teams são as ferramentas certas para acesso por exceção no Dataverse — desde que usados como exceção, não como arquitetura. Quando viram o mecanismo principal de autorização, a PrincipalObjectAccess silenciosamente se torna o maior gargalo de performance do ambiente. A regra de ouro: estrutura em roles e business units, exceção em access teams, e todo compartilhamento programático com revogação planejada.

Se sua empresa opera model-driven apps ou Dynamics 365 em escala e já sente lentidão difícil de explicar, ou precisa redesenhar um modelo de segurança que virou uma teia de compartilhamentos, a Dynamic Soluções pode ajudar a auditar a POA, racionalizar roles e teams e definir um padrão sustentável de autorização.



In the Dataverse security model, most teams start out solving everything with **security roles** and **business units**. But there's a class of problem roles don't handle well: **exception-based** access, case by case, to specific records — the "I need this one person to see only this project," or "this opportunity was handed off to another rep to maintain." That's where **record sharing** and **access teams** come in, two mechanisms that grant granular access without reworking your role design. The catch is that both carry performance and governance traps that only surface at scale.

**How sharing works under the hood**

When you share a record (manually in the UI, via `GrantAccessRequest` in the SDK, or through Power Automate), Dataverse creates a row in the system table **PrincipalObjectAccess (POA)**. Each POA row ties a principal (user or team) to a specific record, with a set of rights (Read, Write, Append, AppendTo, Assign, Share, Delete). This access is **additive** to what the security role already grants — sharing never removes access, it only adds.

The critical point: POA grows with the number of record × principal **combinations**. Sharing a record with 1 team of 200 people generates 1 POA row (access is resolved through team membership). Sharing the same record individually with 200 users generates 200 rows. In mass-sharing scenarios — say, a flow that shares every new case with half a dozen users — POA can reach millions of rows, and then **every query** that needs to evaluate access (nearly all of them) gets slower, because the engine must resolve POA in the execution plan. This is one of the hardest Dataverse performance bottlenecks to diagnose, precisely because the table is invisible in the data model.

**Owner team, access team, and the automatic mode (access team template)**

Teams in Dataverse come in two flavors, and confusing them is costly:

* **Owner team** — can **own** records. It has its own security roles, and members' access comes from those roles (Business Unit level, for example). It's for "this set of records belongs to a group." Changing membership is relatively expensive, and the recommendation is to keep the number of owner teams under control.
* **Access team** — **cannot** own records and carries no security roles. It exists only to receive **sharing** of specific records. It's the mechanism designed for the exception scenario: "add this user to this case's access team."

And there's the powerful variant: the **access team template**. Per table, you define a template with a set of rights (e.g., Read + Write) and enable a "team members" subgrid on the form. When a user is added to a record's subgrid, Dataverse creates an invisible access team **on demand** for that record and shares it with the template's rights. When the last member leaves, the team is removed. This gives per-record access with a clean UX, with no explosion of manual teams — but each membership still becomes a POA row, so volume still matters.

**When to use each mechanism**

A practical decision guide:

1. **Access follows a structural rule** (department, region, hierarchy)? Solve it with **security roles + business units** (or hierarchy security). Sharing here is an antipattern — it becomes tech debt.
2. **Access is by exception, ad hoc, and done by a human** on the record? An **access team template** with a subgrid is the ideal fit: granular, self-managed, no code.
3. **Access is by exception but triggered by logic** (a flow/plugin shares when a status changes)? Use `GrantAccessRequest`/`ModifyAccessRequest` with **volume caution** — prefer sharing with a team rather than N users, and **revoke** access (`RevokeAccessRequest`) when the condition no longer holds, so you don't leave orphaned POA accumulating.
4. **Stable groups that need to own records?** **Owner team** with roles.

**Traps that show up in production**

* **Mass sharing via flow with no revocation** — the classic. POA grows indefinitely, nobody measures it, and six months later screens start crawling. Every time you grant access programmatically, plan the matching revocation.
* **Using sharing to work around a poorly designed role** — if you're sharing the same records with the same groups over and over, the right answer is an owner team or a role adjustment, not thousands of POA rows.
* **Share cascade on relationships** — relationships with cascade `Share` propagate sharing to child records. In deep hierarchies, a single share can generate a cascade of POA rows you didn't account for.
* **Forgetting that sharing is additive** — sharing implements no denial. If the requirement is "this group must NOT see," sharing isn't the tool; that's role/BU design or column security.
* **Ownership change doesn't clean up shares** — when reassigning a record, existing shares may remain depending on configuration, leaving residual access.

**Closing**

Sharing and access teams are the right tools for exception-based access in Dataverse — as long as they're used as the exception, not as the architecture. When they become the primary authorization mechanism, PrincipalObjectAccess silently becomes the environment's biggest performance bottleneck. The golden rule: structure in roles and business units, exceptions in access teams, and every programmatic share with a planned revocation.

If your company runs model-driven apps or Dynamics 365 at scale and is already feeling unexplained slowness, or needs to redesign a security model that has turned into a web of shares, Dynamic Soluções can help audit POA, rationalize roles and teams, and define a sustainable authorization standard.
