---
title: "Power Automate: aprovações robustas com o Approvals connector"
description: "Aprovações no Power Automate vão muito além de 'Start and wait': entenda paralelo vs. sequencial, reatribuição, timeout, persistência e auditoria."
date: '2026-09-05 15:55:32'
---
Fluxos de aprovação são um dos casos de uso mais comuns do Power Automate — e também um dos mais mal implementados. É fácil arrastar uma ação **Start and wait for an approval**, mandar um e-mail e achar que o processo está pronto. Em produção, porém, aprovações carregam requisitos que raramente aparecem no protótipo: o que acontece se ninguém responder, como reatribuir quando o aprovador está de férias, como auditar decisões meses depois e o que fazer quando o fluxo é cancelado no meio. Este post detalha a arquitetura de aprovações corporativas de verdade sobre o Approvals connector.

**Como o Approvals connector funciona por baixo**

O Approvals connector não é apenas um e-mail bonito. Cada aprovação cria um registro no **Dataverse** (tabelas `Approval`, `Approval Request`, `Approval Response`) do ambiente. É por isso que aprovações aparecem centralizadas no card do Teams, no app Approvals e no Outlook actionable message ao mesmo tempo — todos são clientes do mesmo registro. Consequências práticas dessa arquitetura:

* O ambiente precisa ter o Dataverse provisionado. Ambientes antigos sem base de dados não suportam o connector.
* O histórico de aprovações fica consultável. Você pode ler as tabelas via a ação **List approvals** ou diretamente no Dataverse para relatórios de compliance.
* A aprovação sobrevive ao fluxo. Mesmo que o run que criou a aprovação expire, o registro continua — o que exige cuidado ao correlacionar decisões com a instância que as originou.

**Create an approval vs. Start and wait: por que separar importa**

A ação clássica **Start and wait for an approval** faz duas coisas num passo só: cria a aprovação e bloqueia o fluxo até a resposta. Isso é conveniente, mas amarra você. O par de ações **Create an approval** + **Wait for an approval** separa criação e espera, e abre padrões que o combo monolítico não permite:

* Criar a aprovação, guardar o `Approval ID` em uma tabela do Dataverse e **esperar em outro fluxo** — útil quando o processo de espera pode durar semanas e você não quer um run pendurado sujeito a limites de duração.
* Notificar por múltiplos canais antes de esperar (Teams + e-mail + registro em lista).
* Implementar **timeout e escalonamento** envolvendo o Wait em um scope com controle de tempo, enviando lembretes e, se ninguém responder, reatribuindo ou aprovando por regra.

**Paralelo, sequencial e o tipo de aprovação certo**

O connector oferece tipos que resolvem cenários diferentes — escolher errado gera retrabalho:

1. **Approve/Reject – First to respond**: qualquer aprovador da lista decide sozinho. Bom para times onde qualquer um do grupo pode liberar (ex.: plantão).
2. **Approve/Reject – Everyone must approve**: todos precisam aprovar (paralelo). Uma rejeição encerra. Use para gates de conformidade com múltiplos responsáveis.
3. **Custom Responses**: substitui Aprovar/Rejeitar por opções próprias ("Aprovar", "Aprovar com ressalva", "Devolver para ajuste"). Essencial em processos que não são binários.

Aprovação **sequencial em etapas** (gerente → diretor → financeiro) não é um tipo nativo: você a monta encadeando várias aprovações, avançando para a próxima só quando a anterior retorna `Approve`. Encapsule cada etapa num scope com Try-Catch para não perder o rastro de onde o processo parou.

**Reatribuição, timeout e o problema do aprovador ausente**

O cenário que mais quebra aprovações em produção é o aprovador que não responde. Estratégias:

* **Reassign nativo**: o próprio aprovador (ou um admin via app) pode reatribuir a aprovação a outra pessoa sem tocar no fluxo. O registro no Dataverse guarda a cadeia de reatribuição para auditoria.
* **Timeout com lembretes**: usando o padrão Create + Wait, envolva o Wait num loop com **Delay** que dispara lembretes a cada N dias e, após um limite, escala para o superior ou aplica uma regra de auto-aprovação/auto-rejeição documentada.
* **Cobertura de férias**: consulte o status do aprovador (ex.: automatic replies via Graph ou uma tabela de delegação no Dataverse) *antes* de criar a aprovação e direcione ao substituto.

**Governança, ALM e custo**

Algumas decisões de arquitetura que separam um fluxo de aprovação amador de um corporativo:

* **Empacote em solução gerenciada** e use **connection references** e **environment variables** para URLs, grupos de aprovadores e limites de timeout — nada de e-mail hardcoded.
* **Centralize a lógica de aprovação num child flow** reutilizável, que recebe título, itens, lista de aprovadores e tipo como parâmetros, e devolve a decisão. Vários processos passam a consumir o mesmo motor de aprovação.
* **Custo**: o Approvals connector é standard e roda com licença Power Automate incluída no Microsoft 365. O ponto de atenção de custo aparece quando o fluxo toca dados/connectors premium (Dataverse fora do escopo padrão, HTTP, conectores de terceiros) — aí incide licenciamento premium por usuário/fluxo. Aprovações puras não deveriam empurrar você para premium sozinhas.
* **Auditoria**: não confie só no histórico de runs (que expira). Persista decisão, aprovador, data e comentários numa tabela própria do Dataverse ou lista, para compliance de longo prazo.

Aprovações parecem triviais até virarem parte de um processo crítico — de despesas, contratos, acesso a sistemas — em que um caso não tratado gera perda financeira ou risco regulatório. Se sua empresa depende de fluxos de aprovação que precisam ser auditáveis, resilientes e governados em escala, a Dynamic Soluções ajuda a desenhar essa arquitetura com child flows, ALM e monitoramento — do protótipo ao processo de produção.



Approval flows are one of the most common Power Automate use cases — and also one of the most poorly implemented. It's easy to drop a **Start and wait for an approval** action, send an email and assume the process is done. In production, though, approvals carry requirements that rarely show up in the prototype: what happens if nobody responds, how to reassign when the approver is on vacation, how to audit decisions months later, and what to do when the flow is cancelled mid-way. This post breaks down the architecture of real corporate approvals on top of the Approvals connector.

**How the Approvals connector works under the hood**

The Approvals connector isn't just a nice-looking email. Each approval creates a record in the environment's **Dataverse** (`Approval`, `Approval Request`, `Approval Response` tables). That's why approvals appear centralized in the Teams card, the Approvals app and the Outlook actionable message all at once — they're all clients of the same record. Practical consequences of this architecture:

* The environment must have Dataverse provisioned. Old environments without a database don't support the connector.
* Approval history is queryable. You can read the tables via the **List approvals** action or directly in Dataverse for compliance reports.
* The approval outlives the flow. Even if the run that created the approval expires, the record persists — which requires care when correlating decisions with the instance that originated them.

**Create an approval vs. Start and wait: why splitting matters**

The classic **Start and wait for an approval** action does two things in one step: it creates the approval and blocks the flow until the response. That's convenient, but it locks you in. The pair **Create an approval** + **Wait for an approval** separates creation and waiting, unlocking patterns the monolithic combo can't:

* Create the approval, store the `Approval ID` in a Dataverse table and **wait in a different flow** — useful when the wait can span weeks and you don't want a run hanging around subject to duration limits.
* Notify across multiple channels before waiting (Teams + email + list entry).
* Implement **timeout and escalation** by wrapping the Wait in a scope with time control, sending reminders and, if nobody responds, reassigning or approving by rule.

**Parallel, sequential and the right approval type**

The connector offers types for different scenarios — picking the wrong one means rework:

1. **Approve/Reject – First to respond**: any approver in the list decides alone. Good for teams where anyone in the group can release (e.g. an on-call rotation).
2. **Approve/Reject – Everyone must approve**: all must approve (parallel). One rejection ends it. Use it for compliance gates with multiple owners.
3. **Custom Responses**: replaces Approve/Reject with your own options ("Approve", "Approve with note", "Return for changes"). Essential for processes that aren't binary.

**Staged sequential** approval (manager → director → finance) is not a native type: you build it by chaining several approvals, moving to the next only when the previous one returns `Approve`. Wrap each stage in a Try-Catch scope so you never lose track of where the process stopped.

**Reassignment, timeout and the absent approver problem**

The scenario that breaks the most production approvals is the approver who doesn't respond. Strategies:

* **Native reassign**: the approver themselves (or an admin via the app) can reassign the approval to someone else without touching the flow. The Dataverse record keeps the reassignment chain for auditing.
* **Timeout with reminders**: using the Create + Wait pattern, wrap the Wait in a loop with a **Delay** that fires reminders every N days and, past a limit, escalates to the manager or applies a documented auto-approve/auto-reject rule.
* **Vacation coverage**: check the approver's status (e.g. automatic replies via Graph or a delegation table in Dataverse) *before* creating the approval and route to the substitute.

**Governance, ALM and cost**

A few architecture decisions that separate an amateur approval flow from a corporate one:

* **Package it in a managed solution** and use **connection references** and **environment variables** for URLs, approver groups and timeout limits — no hardcoded emails.
* **Centralize the approval logic in a reusable child flow** that takes title, items, approver list and type as parameters and returns the decision. Many processes then consume the same approval engine.
* **Cost**: the Approvals connector is standard and runs on the Power Automate license included with Microsoft 365. The cost concern appears when the flow touches premium data/connectors (Dataverse beyond standard scope, HTTP, third-party connectors) — that triggers premium licensing per user/flow. Pure approvals shouldn't push you into premium on their own.
* **Auditing**: don't rely solely on run history (which expires). Persist the decision, approver, date and comments in a dedicated Dataverse table or list for long-term compliance.

Approvals look trivial until they become part of a critical process — expenses, contracts, system access — where one unhandled case leads to financial loss or regulatory risk. If your company relies on approval flows that must be auditable, resilient and governed at scale, Dynamic Soluções helps design this architecture with child flows, ALM and monitoring — from prototype to production process.
