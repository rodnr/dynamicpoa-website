---
title: "Dataverse: Many-to-one com cascade behavior sem efeito colateral"
description: "Configurar cascade behavior em relacionamentos do Dataverse define o que acontece ao deletar, atribuir ou compartilhar um registro pai. Veja como evitar cascatas destrutivas."
date: '2026-11-13 20:25:55'
---
Todo relacionamento many-to-one no Dataverse carrega uma configuração que a maioria dos times ignora até ela causar estrago: o **cascade behavior**. É ele que decide o que acontece com os registros filhos quando você deleta, atribui, compartilha, reatribui ou mescla o registro pai. Escolher o comportamento errado pode apagar centenas de registros filhos sem aviso, estourar timeout em cascatas profundas ou deixar lookups órfãos espalhados pela base. Este post detalha como o cascade behavior funciona, cada uma das ações cascateáveis e um roteiro de decisão para não transformar uma operação simples num incidente de dados.

**O que é o cascade behavior e onde ele vive**

Quando você cria um relacionamento 1:N (ou seja, uma coluna lookup na tabela filha apontando para a tabela pai), o Dataverse associa a esse relacionamento um conjunto de regras de cascata. Elas não ficam na coluna lookup em si, mas na definição do relacionamento (`OneToManyRelationshipMetadata`), e cobrem seis operações distintas no registro pai:

* **Assign** — quando o owner do registro pai muda.
* **Delete** — quando o registro pai é deletado.
* **Reparent** — quando o lookup do pai para um avô muda (hierarquia).
* **Share** — quando o registro pai é compartilhado com um usuário/equipe.
* **Unshare** — quando o compartilhamento é removido.
* **Merge** — quando dois registros pai são mesclados.

Para cada uma dessas ações, você define um comportamento. Os valores possíveis mais usados são:

* **Cascade All** — a ação se propaga para todos os filhos relacionados.
* **Cascade Active** — propaga apenas para filhos com statecode ativo.
* **Cascade User-Owned** — propaga apenas para filhos que pertencem ao mesmo owner do pai.
* **Cascade None** — não faz nada nos filhos.
* **Remove Link** — limpa o valor do lookup no filho (deixa o campo nulo), disponível para Delete.
* **Restrict** — bloqueia a operação no pai se houver filhos relacionados (apenas para Delete).

**Os três tipos de relacionamento pré-moldados**

No editor de relacionamentos, a Microsoft oferece três presets de `Type of Behavior` que preenchem as seis ações de uma vez:

1. **Parental** — tudo é Cascade All. Deletar o pai deleta os filhos, atribuir o pai reatribui os filhos, compartilhar o pai compartilha os filhos. É o acoplamento mais forte. Serve para composição real (uma ordem e suas linhas de item, onde a linha não existe sem a ordem).
2. **Referential** — Delete é Remove Link e as demais ações são None. Os filhos sobrevivem à deleção do pai, apenas com o lookup esvaziado. É o acoplamento mais fraco e o mais seguro para associações frouxas (um contato que referencia uma campanha de origem).
3. **Referential, Restrict Delete** — como o Referential, mas Delete vira Restrict: você não consegue deletar o pai enquanto houver filhos. Protege contra perda de integridade referencial de forma explícita.
4. **Configurable Cascading** — você define ação por ação manualmente, para cenários que não se encaixam nos presets.

O erro clássico é aceitar o preset padrão (frequentemente Referential em relacionamentos custom) sem pensar, ou copiar Parental de um exemplo de ordem/linha para um relacionamento que não é composição — e descobrir, meses depois, que deletar um registro pai varreu milhares de filhos que deveriam ter sobrevivido.

**Cascade Delete e o risco de operação destrutiva silenciosa**

O comportamento mais perigoso é o Cascade All em Delete. Um único delete no pai dispara uma deleção em cascata por toda a árvore de filhos — e se esses filhos também forem pais Parental de outras tabelas, a cascata continua recursivamente. Em hierarquias profundas isso vira uma operação de milhares de deletes numa única transação síncrona, com dois efeitos colaterais:

* **Timeout e rollback.** A plataforma tem limites de tempo e de profundidade para operações cascateadas. Uma cascata muito grande pode estourar o tempo e dar rollback da operação inteira, deixando o usuário sem entender por que o delete "não funcionou".
* **Plugins em cada filho.** Se você tem plugins registrados no Delete da tabela filha, eles disparam para cada registro cascateado, multiplicando a carga e o risco de falha parcial dentro da transação.

Para registros pai com muitos filhos e regra de negócio de "desativar, não apagar", prefira **Restrict Delete** (bloqueia e força o usuário a tratar os filhos) ou **Remove Link** (preserva os filhos). Reserve Cascade Delete para composição genuína onde o filho realmente não faz sentido sem o pai.

**Cascade Assign, Share e o impacto em segurança e ownership**

Cascade em Assign e Share é menos óbvio porque não destrói dados, mas mexe em segurança. Com Assign = Cascade All, reatribuir um registro pai reatribui silenciosamente todos os filhos para o novo owner. Em bases com ownership por time e security roles em nível User, isso pode mudar quem enxerga o quê sem ninguém perceber — uma reatribuição rotineira vira uma mudança de visibilidade em cadeia.

Cascade Share e Unshare adicionam linhas na tabela POA (PrincipalObjectAccess) para cada filho a cada compartilhamento, o que em volume tem custo de performance e de storage, como já discutimos no contexto de sharing e access teams. Se o relacionamento não exige que filhos herdem o compartilhamento do pai, deixe Share/Unshare como **None** e evite inflar a POA.

Uma recomendação prática comum: usar **Cascade User-Owned** em Assign quando você quer que a reatribuição acompanhe só os filhos que pertenciam ao mesmo owner anterior, preservando filhos já atribuídos a outras pessoas.

**Reparent e Merge: os dois esquecidos**

Reparent controla o que acontece quando o lookup pai→avô muda numa hierarquia — típico em tabelas auto-referenciadas (account com parentaccountid). Se estiver como Cascade All, mover um nó na árvore pode reatribuir/compartilhar toda a subárvore conforme o avô, o que raramente é o desejado e costuma surpreender.

Merge define se, ao mesclar dois registros pai, os filhos do registro perdedor migram para o vencedor. Em geral você quer Cascade All aqui (não faz sentido perder os filhos no merge), mas vale conferir — um Merge = None deixa filhos apontando para um registro desativado após a mesclagem.

**Roteiro de decisão por relacionamento**

1. **É composição real (o filho não existe sem o pai)?** Se sim, Parental/Cascade Delete é defensável. Se não, nunca use Cascade Delete.
2. **Precisa preservar os filhos ao deletar o pai?** Remove Link mantém os filhos com lookup nulo; Restrict impede o delete enquanto houver filhos. Escolha conforme a regra de negócio.
3. **Os filhos devem herdar owner e compartilhamento do pai?** Só então ligue Assign/Share em cascata — e considere User-Owned em vez de All para não reatribuir filhos de terceiros.
4. **Há plugins no Delete/Assign da tabela filha?** Dimensione o volume da cascata e o risco de timeout antes de escolher Cascade All.
5. **A tabela é auto-referenciada?** Revise explicitamente Reparent, que costuma passar despercebido.
6. **Documente a escolha na solução.** Cascade behavior é metadado de relacionamento e viaja na solução gerenciada — valide-o no deploy para não arrastar um Parental de Dev para Prod sem querer.

Configurar cascade behavior é uma decisão de modelagem de dados com consequências de segurança e integridade, não um detalhe de checkbox. Na Dynamic Soluções, revisamos esse tipo de metadado como parte da arquitetura de Dataverse dos nossos clientes, justamente para evitar que uma operação rotineira vire um incidente de perda de dados. Se sua empresa opera soluções críticas sobre o Dataverse, nossos planos de suporte e consultoria ajudam a manter esse modelo sob controle.



Every many-to-one relationship in Dataverse carries a setting most teams ignore until it causes damage: **cascade behavior**. It decides what happens to child records when you delete, assign, share, reparent or merge the parent record. Picking the wrong behavior can wipe out hundreds of child records with no warning, trigger timeouts on deep cascades, or leave orphaned lookups scattered across the base. This post breaks down how cascade behavior works, each cascadeable action, and a decision guide so a simple operation doesn't turn into a data incident.

**What cascade behavior is and where it lives**

When you create a 1:N relationship (that is, a lookup column on the child table pointing to the parent table), Dataverse attaches to that relationship a set of cascade rules. They don't live on the lookup column itself but in the relationship definition (`OneToManyRelationshipMetadata`), and they cover six distinct operations on the parent record:

* **Assign** — when the parent record's owner changes.
* **Delete** — when the parent record is deleted.
* **Reparent** — when the parent's lookup to a grandparent changes (hierarchy).
* **Share** — when the parent record is shared with a user/team.
* **Unshare** — when the share is removed.
* **Merge** — when two parent records are merged.

For each of these actions you define a behavior. The most commonly used values are:

* **Cascade All** — the action propagates to all related children.
* **Cascade Active** — propagates only to children with an active statecode.
* **Cascade User-Owned** — propagates only to children owned by the same owner as the parent.
* **Cascade None** — does nothing to the children.
* **Remove Link** — clears the lookup value on the child (sets the field to null), available for Delete.
* **Restrict** — blocks the operation on the parent if related children exist (Delete only).

**The three pre-built relationship types**

In the relationship editor, Microsoft offers three `Type of Behavior` presets that fill all six actions at once:

1. **Parental** — everything is Cascade All. Deleting the parent deletes the children, assigning the parent reassigns the children, sharing the parent shares the children. It's the strongest coupling. It fits true composition (an order and its line items, where the line doesn't exist without the order).
2. **Referential** — Delete is Remove Link and the other actions are None. Children survive the parent's deletion, just with the lookup emptied. It's the weakest coupling and the safest for loose associations (a contact that references a source campaign).
3. **Referential, Restrict Delete** — like Referential, but Delete becomes Restrict: you can't delete the parent while children exist. It protects referential integrity explicitly.
4. **Configurable Cascading** — you set each action manually, for scenarios that don't fit the presets.

The classic mistake is accepting the default preset (often Referential on custom relationships) without thinking, or copying Parental from an order/line example onto a relationship that isn't composition — and finding out months later that deleting a parent swept away thousands of children that should have survived.

**Cascade Delete and the silent destructive operation risk**

The most dangerous behavior is Cascade All on Delete. A single delete on the parent fires a cascading deletion across the whole child tree — and if those children are also Parental parents of other tables, the cascade continues recursively. On deep hierarchies this becomes an operation of thousands of deletes in a single synchronous transaction, with two side effects:

* **Timeout and rollback.** The platform has time and depth limits for cascaded operations. An overly large cascade can hit the time limit and roll back the whole operation, leaving the user puzzled over why the delete "didn't work."
* **Plugins on every child.** If you have plugins registered on the child table's Delete, they fire for every cascaded record, multiplying the load and the risk of partial failure inside the transaction.

For parent records with many children and a "deactivate, don't delete" business rule, prefer **Restrict Delete** (blocks and forces the user to handle the children) or **Remove Link** (preserves the children). Reserve Cascade Delete for genuine composition where the child truly makes no sense without the parent.

**Cascade Assign, Share and the impact on security and ownership**

Cascade on Assign and Share is less obvious because it doesn't destroy data, but it touches security. With Assign = Cascade All, reassigning a parent record silently reassigns all children to the new owner. On bases with team ownership and User-level security roles, this can change who sees what with nobody noticing — a routine reassignment becomes a chain visibility change.

Cascade Share and Unshare add rows to the POA table (PrincipalObjectAccess) for each child on every share, which at scale carries a performance and storage cost, as we discussed in the context of sharing and access teams. If the relationship doesn't require children to inherit the parent's sharing, leave Share/Unshare as **None** and avoid inflating the POA.

A common practical recommendation: use **Cascade User-Owned** on Assign when you want reassignment to follow only the children that belonged to the same previous owner, preserving children already assigned to other people.

**Reparent and Merge: the two forgotten ones**

Reparent controls what happens when the parent→grandparent lookup changes in a hierarchy — typical in self-referential tables (account with parentaccountid). If set to Cascade All, moving a node in the tree can reassign/share the whole subtree according to the grandparent, which is rarely what you want and usually surprises people.

Merge defines whether, when merging two parent records, the losing record's children migrate to the winner. You generally want Cascade All here (losing children on merge makes no sense), but it's worth checking — a Merge = None leaves children pointing to a deactivated record after the merge.

**Decision guide per relationship**

1. **Is it real composition (the child doesn't exist without the parent)?** If so, Parental/Cascade Delete is defensible. If not, never use Cascade Delete.
2. **Do you need to preserve children when deleting the parent?** Remove Link keeps children with a null lookup; Restrict prevents the delete while children exist. Pick based on the business rule.
3. **Should children inherit owner and sharing from the parent?** Only then enable cascading Assign/Share — and consider User-Owned instead of All so you don't reassign other people's children.
4. **Are there plugins on the child table's Delete/Assign?** Size the cascade volume and timeout risk before choosing Cascade All.
5. **Is the table self-referential?** Explicitly review Reparent, which usually goes unnoticed.
6. **Document the choice in the solution.** Cascade behavior is relationship metadata and travels in the managed solution — validate it on deploy so you don't drag a Parental from Dev to Prod by accident.

Configuring cascade behavior is a data modeling decision with security and integrity consequences, not a checkbox detail. At Dynamic Soluções, we review this kind of metadata as part of our clients' Dataverse architecture, precisely to keep a routine operation from becoming a data-loss incident. If your company runs critical solutions on Dataverse, our support and consulting plans help keep that model under control.
