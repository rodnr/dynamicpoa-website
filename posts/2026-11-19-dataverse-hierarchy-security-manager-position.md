---
title: "Dataverse: hierarchy security e manager hierarchy na prática"
description: "Modelar acesso por hierarquia no Dataverse exige escolher entre manager e position hierarchy. Veja como cada uma funciona, os limites de profundidade e o impacto em performance."
date: '2026-11-19 21:20:11'
---
Quando a regra de acesso é "o gestor vê tudo da equipe dele", muita gente tenta resolver com sharing manual ou com um emaranhado de business units. Nenhum dos dois escala bem. O Dataverse tem um recurso específico para isso: **hierarchy security**, um modelo que concede acesso vertical com base em uma hierarquia organizacional, complementando (não substituindo) as security roles.

**Os dois modelos: manager hierarchy e position hierarchy**

O hierarchy security opera em exatamente um de dois modos por ambiente — você escolhe um, não os dois ao mesmo tempo:

* **Manager hierarchy** — usa a coluna `parentsystemuserid` (o campo *Manager* do usuário). O gestor ganha acesso aos registros de propriedade dos subordinados diretos e indiretos abaixo dele. A regra crítica: o gestor e o subordinado precisam estar na **mesma business unit** ou em uma BU filha para o acesso descer. Se o gestor está numa BU irmã, a hierarquia não atravessa.
* **Position hierarchy** — usa uma estrutura de *positions* desacoplada do organograma de gestão direta. Você cria posições (ex.: "Diretor Comercial", "Gerente Regional"), encadeia posição-pai e associa usuários a posições. O acesso flui pela cadeia de posições, **sem a restrição de business unit** do manager hierarchy. É o modelo certo quando a estrutura de acesso não espelha o campo Manager ou cruza BUs.

**Deep vs. Read-only: o nível de acesso por profundidade**

Um detalhe que define a segurança na prática: o acesso concedido pela hierarquia não é uniforme ao longo da cadeia.

* O gestor/posição **imediatamente acima** recebe acesso de leitura, escrita, append, append to e share (*deep access*) sobre os registros dos subordinados diretos.
* Níveis **mais altos** na cadeia recebem apenas **read-only** sobre os registros mais abaixo.

Ou seja: o diretor enxerga tudo da árvore, mas só edita diretamente o que está um nível abaixo dele via hierarquia. Isso costuma surpreender quem assume que o topo pode tudo. Se o diretor precisa editar registros de três níveis abaixo, a hierarquia sozinha não resolve — isso é papel da security role dele (um nível de acesso *Parent: Child Business Unit* ou *Organization*).

**O parâmetro de profundidade (depth) e por que ele existe**

O hierarchy security tem uma configuração de **depth** — quantos níveis abaixo um gestor "enxerga" pela hierarquia. Não é só um limite funcional; é um controle de performance. Cada avaliação de acesso hierárquico percorre a cadeia, e cadeias muito profundas encarecem o cálculo de segurança em tempo de consulta. A recomendação da Microsoft é manter a profundidade baixa e desenhar BUs/roles para cobrir o acesso amplo, deixando a hierarquia para o acesso vertical fino.

**Quando a hierarchy security é a ferramenta certa — e quando não é**

Use hierarchy security quando:

* O requisito é genuinamente vertical: "cada gestor vê os dados da própria linha de reporte".
* A estrutura muda com frequência (promoções, remanejamentos) e você não quer reescrever roles a cada mudança — mudar o Manager ou a Position já reconfigura o acesso.
* Você quer evitar explosão de business units criadas só para espelhar o organograma.

Evite ou combine com cautela quando:

* O acesso é por **time/projeto** e não por linha de reporte — aí access teams ou owner teams são mais diretos.
* A árvore é muito profunda e o volume de registros é alto — o custo de avaliação em tempo de consulta pode doer; teste com dados realistas.
* A regra exige **negação** (o gestor NÃO deve ver certos registros do subordinado) — hierarchy security é aditiva, nunca subtrai acesso que a role já concedeu.

**Armadilhas de produção**

* **Manager hierarchy e BU andam juntos.** O erro mais comum é esperar que o gestor veja subordinados de outra business unit. Não vê. Se o organograma cruza BUs, migre para position hierarchy.
* **Não é retroativo mágico.** Ligar o recurso recalcula acesso, mas a consistência depende dos relacionamentos de manager/position estarem corretos — dados de RH desatualizados viram brechas ou bloqueios silenciosos.
* **Interação com sharing e POA.** Hierarchy security soma-se ao que já vem de roles, teams e sharing. Em ambientes com muito sharing na tabela POA, mais essa camada pode tornar o diagnóstico de "por que esse usuário vê isso?" trabalhoso — documente qual camada concede o quê.
* **Um modo por ambiente.** Você não roda manager e position hierarchy simultaneamente. Decidir errado e trocar depois exige remodelar a estrutura de acesso.

**Roteiro de decisão**

1. O acesso é vertical (linha de reporte)? Se não, pare — use roles/teams.
2. A hierarquia de acesso coincide com o campo Manager e fica dentro da BU? Se sim, **manager hierarchy**.
3. Cruza BUs ou não espelha o Manager direto? **Position hierarchy**.
4. Defina a profundidade mínima que atende o requisito e teste a performance com volume real.
5. Use security roles para o acesso amplo (quem vê a BU inteira) e deixe a hierarquia só para o recorte vertical fino.

Modelar segurança por hierarquia é uma das decisões que mais impactam governança e performance de apps model-driven e Dynamics 365 em escala — e uma das mais difíceis de reverter depois de populada. Se sua empresa está desenhando o modelo de segurança do Dataverse ou já sente o peso de uma estrutura de acesso que cresceu sem planejamento, a consultoria da Dynamic Soluções pode ajudar a modelar roles, business units e hierarchy security de forma sustentável.



When the access rule is "the manager sees everything from their team", many people try to solve it with manual sharing or a tangle of business units. Neither scales well. Dataverse has a feature built precisely for this: **hierarchy security**, a model that grants vertical access based on an organizational hierarchy, complementing (not replacing) security roles.

**The two models: manager hierarchy and position hierarchy**

Hierarchy security runs in exactly one of two modes per environment — you pick one, not both at once:

* **Manager hierarchy** — uses the `parentsystemuserid` column (the user's *Manager* field). A manager gains access to records owned by their direct and indirect subordinates below them. The critical rule: manager and subordinate must be in the **same business unit** or a child BU for access to flow down. If the manager is in a sibling BU, the hierarchy doesn't cross.
* **Position hierarchy** — uses a *positions* structure decoupled from the direct management org chart. You create positions (e.g., "Sales Director", "Regional Manager"), chain parent positions and assign users to positions. Access flows along the position chain, **without the business unit restriction** of manager hierarchy. It's the right model when the access structure doesn't mirror the Manager field or spans BUs.

**Deep vs. read-only: access level by depth**

A detail that defines real-world security: the access granted by the hierarchy is not uniform along the chain.

* The manager/position **immediately above** gets read, write, append, append to and share (*deep access*) over the direct subordinates' records.
* **Higher** levels in the chain get only **read-only** over records further down.

In other words: the director sees the whole tree but only directly edits what's one level below them via the hierarchy. This often surprises those who assume the top can do everything. If the director needs to edit records three levels down, the hierarchy alone won't do it — that's the job of their security role (a *Parent: Child Business Unit* or *Organization* access level).

**The depth parameter and why it exists**

Hierarchy security has a **depth** setting — how many levels below a manager "sees" through the hierarchy. It's not just a functional limit; it's a performance control. Each hierarchical access evaluation walks the chain, and very deep chains make security computation at query time more expensive. Microsoft's recommendation is to keep depth low and design BUs/roles to cover broad access, leaving the hierarchy for fine-grained vertical access.

**When hierarchy security is the right tool — and when it isn't**

Use hierarchy security when:

* The requirement is genuinely vertical: "each manager sees data from their own reporting line".
* The structure changes often (promotions, reassignments) and you don't want to rewrite roles at every change — changing the Manager or Position already reconfigures access.
* You want to avoid an explosion of business units created just to mirror the org chart.

Avoid or combine carefully when:

* Access is by **team/project** rather than reporting line — then access teams or owner teams are more direct.
* The tree is very deep and the record volume is high — query-time evaluation cost can hurt; test with realistic data.
* The rule requires **denial** (the manager should NOT see certain subordinate records) — hierarchy security is additive, it never subtracts access a role already granted.

**Production pitfalls**

* **Manager hierarchy and BU go together.** The most common mistake is expecting a manager to see subordinates in another business unit. They won't. If the org chart crosses BUs, move to position hierarchy.
* **It's not magically retroactive.** Enabling the feature recalculates access, but consistency depends on the manager/position relationships being correct — stale HR data becomes gaps or silent blocks.
* **Interaction with sharing and POA.** Hierarchy security adds to what already comes from roles, teams and sharing. In environments with heavy sharing in the POA table, this extra layer can make diagnosing "why does this user see this?" laborious — document which layer grants what.
* **One mode per environment.** You can't run manager and position hierarchy at the same time. Deciding wrong and switching later requires remodeling the access structure.

**Decision checklist**

1. Is access vertical (reporting line)? If not, stop — use roles/teams.
2. Does the access hierarchy match the Manager field and stay within the BU? If so, **manager hierarchy**.
3. Does it cross BUs or not mirror the direct Manager? **Position hierarchy**.
4. Set the minimum depth that meets the requirement and test performance with real volume.
5. Use security roles for broad access (who sees the whole BU) and leave the hierarchy only for the fine vertical slice.

Modeling hierarchy-based security is one of the decisions that most impacts governance and performance of model-driven apps and Dynamics 365 at scale — and one of the hardest to reverse once populated. If your company is designing its Dataverse security model or already feels the weight of an access structure that grew without planning, Dynamic Soluções' consulting can help model roles, business units and hierarchy security sustainably.
