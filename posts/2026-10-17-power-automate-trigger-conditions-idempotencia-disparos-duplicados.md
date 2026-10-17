---
title: "Power Automate: idempotencia e trigger conditions para evitar disparos duplicados"
description: "Flows que rodam duas vezes para o mesmo registro geram dados duplicados e e-mails repetidos. Veja como blindar automacoes com trigger conditions e idempotencia."
date: '2026-10-17 16:17:28'
---
Poucas coisas minam a confianca em uma automacao corporativa tao rapido quanto um fluxo que roda duas vezes para o mesmo registro: dois e-mails de aprovacao, dois lancamentos no ERP, dois tickets abertos. O problema raramente e um bug obvio — e a combinacao de triggers que disparam mais do que voce espera com acoes que nao sao idempotentes. Quem opera Power Automate em escala precisa tratar disparo duplicado como condicao normal de operacao, nao como excecao.

**Por que o mesmo fluxo dispara mais de uma vez**

Ha varias fontes de duplicacao, e cada uma exige um tratamento diferente:

* **Trigger amplo demais.** Um trigger "When a row is modified" no Dataverse dispara a cada update de qualquer coluna. Se outro fluxo, um plugin ou o proprio usuario altera o registro em sequencia, o fluxo roda varias vezes para a mesma transacao logica.
* **Loops de atualizacao.** O fluxo le o registro, calcula algo e faz um update de volta na mesma tabela que o dispara. Isso cria recursao: o update do fluxo re-dispara o fluxo.
* **Retry da plataforma.** Falhas transitorias de rede entre o trigger e o runtime podem fazer o Power Automate reentregar o mesmo evento. O design do connector assume entrega *at-least-once*, nao *exactly-once*.
* **Concorrencia.** Com concurrency control ligado no Apply to each, varias instancias podem processar o mesmo item antes de qualquer marca de "ja processado" ser gravada.

**Trigger conditions: filtrar antes de consumir uma execucao**

A primeira linha de defesa e a *trigger condition* — uma expressao OData/WDL avaliada antes de o fluxo contar como executado. Diferente de uma condicao no corpo do fluxo, um trigger condition que retorna falso nao consome uma acao e nao aparece como run. Alguns padroes uteis:

* Disparar so quando uma coluna de controle mudar de valor, usando `@not(equals(triggerOutputs()?['body/statuscode'], triggerBody()?['statuscode@OData.Community.Display.V1.FormattedValue']))` — ou, mais robusto, comparando contra uma coluna "last processed status".
* Ignorar updates feitos pelo proprio service principal do fluxo, comparando `triggerOutputs()?['body/modifiedby']` com o GUID da conta de automacao, quebrando o loop de recursao.
* No Dataverse, preferir o trigger "When a row is added, modified or deleted" com **Filter columns** e **Filter rows** preenchidos, em vez de filtrar depois. Isso reduz tanto duplicacao quanto custo.

Trigger conditions nao resolvem retry da plataforma nem concorrencia — para isso, idempotencia e obrigatoria.

**Idempotencia: a acao pode rodar duas vezes sem efeito duplo**

Uma operacao e idempotente quando aplica-la N vezes produz o mesmo resultado que aplica-la uma vez. O padrao central no Power Automate e usar uma chave de negocio para garantir isso:

1. Derive uma chave deterministica do evento — por exemplo, `concat(triggerOutputs()?['body/accountid'], '-', formatDateTime(triggerOutputs()?['body/modifiedon'], 'yyyyMMddHHmmss'))`.
2. Antes do efeito colateral, verifique se essa chave ja foi processada. A forma mais confiavel no Dataverse e definir uma **alternate key** em uma tabela de controle e usar **Upsert**: se a linha ja existe, o Upsert nao duplica; se nao existe, cria. A corrida entre "ler e decidir" e eliminada pelo indice unico.
3. So execute o efeito colateral (enviar e-mail, chamar API, criar registro) depois de garantir a reserva da chave.

Para APIs externas, o mesmo principio: envie um header de idempotencia (muitos endpoints aceitam `Idempotency-Key`) com a sua chave de negocio, deixando o lado remoto deduplicar. Quando a API nao suporta isso, grave o retorno (o ID do recurso criado) na sua tabela de controle para que uma segunda passagem reutilize o resultado em vez de criar de novo.

**Concorrencia e a janela entre ler e gravar**

O erro mais comum e um fluxo que faz "List rows para ver se ja processei" seguido de "se nao, processa". Entre o List e o processamento existe uma janela em que outra instancia faz a mesma leitura e chega a mesma conclusao. Duas correcoes complementares:

* **Serializar** o que precisa ser unico: em um Apply to each, Concurrency Control com grau 1 para a secao critica, ou usar uma tabela do Dataverse como fila com pick atomico (ver padrao de fila ja descrito no blog).
* **Deixar o banco decidir**, nunca o fluxo: Upsert com alternate key ou um create que falha com erro de duplicate key, capturado por um scope de Catch, e muito mais seguro que um If baseado em leitura previa.

**Um roteiro pratico de blindagem**

Antes de publicar um fluxo que tem efeito colateral visivel (e-mail, ERP, pagamento, ticket), rode esta checklist:

1. O trigger esta o mais estreito possivel (filter columns/rows, trigger condition)?
2. O fluxo ignora updates feitos por si mesmo, quebrando recursao?
3. Existe uma chave de negocio deterministica para cada unidade de trabalho?
4. O efeito colateral e protegido por Upsert com alternate key ou por idempotency key na API?
5. A secao critica esta serializada ou delega a deduplicacao para o banco/fila?
6. Ha um scope de erro que diferencia "ja processado" de "falha real"?

Automacoes criticas falham de formas silenciosas — um lancamento duplicado so aparece no fechamento contabil. Se a sua empresa depende de fluxos que tocam dinheiro, estoque ou comunicacao com cliente, vale desenhar idempotencia desde o inicio, nao como remendo. A Dynamic Solucoes ajuda a arquitetar, revisar e sustentar automacoes corporativas resilientes — do trigger ate a governanca em solucoes gerenciadas.



Few things erode trust in a corporate automation as fast as a flow that runs twice for the same record: two approval e-mails, two ERP postings, two support tickets opened. The cause is rarely an obvious bug — it is the combination of triggers that fire more often than you expect with actions that are not idempotent. Anyone running Power Automate at scale needs to treat duplicate firing as a normal operating condition, not an exception.

**Why the same flow fires more than once**

There are several sources of duplication, each requiring a different fix:

* **Trigger that is too broad.** A "When a row is modified" trigger in Dataverse fires on every update to any column. If another flow, a plugin or the user edits the record in sequence, the flow runs multiple times for the same logical transaction.
* **Update loops.** The flow reads the record, computes something and writes back to the very table that triggers it. This creates recursion: the flow's own update re-fires the flow.
* **Platform retry.** Transient network failures between trigger and runtime can make Power Automate redeliver the same event. The connector is designed for *at-least-once* delivery, not *exactly-once*.
* **Concurrency.** With concurrency control enabled in Apply to each, multiple instances can process the same item before any "already processed" marker is written.

**Trigger conditions: filter before spending a run**

The first line of defense is the *trigger condition* — an OData/WDL expression evaluated before the flow counts as executed. Unlike a condition in the flow body, a trigger condition that returns false consumes no action and never shows up as a run. Some useful patterns:

* Fire only when a control column changes value, using something like `@not(equals(triggerOutputs()?['body/statuscode'], triggerBody()?['statuscode@OData.Community.Display.V1.FormattedValue']))` — or, more robustly, comparing against a "last processed status" column.
* Ignore updates made by the flow's own service principal by comparing `triggerOutputs()?['body/modifiedby']` with the automation account GUID, breaking the recursion loop.
* In Dataverse, prefer the "When a row is added, modified or deleted" trigger with **Filter columns** and **Filter rows** set, instead of filtering afterwards. This cuts both duplication and cost.

Trigger conditions do not solve platform retry or concurrency — for those, idempotency is mandatory.

**Idempotency: the action can run twice without a double effect**

An operation is idempotent when applying it N times produces the same result as applying it once. The core pattern in Power Automate is to use a business key to guarantee this:

1. Derive a deterministic key from the event — for example, `concat(triggerOutputs()?['body/accountid'], '-', formatDateTime(triggerOutputs()?['body/modifiedon'], 'yyyyMMddHHmmss'))`.
2. Before the side effect, check whether that key was already processed. The most reliable approach in Dataverse is to define an **alternate key** on a control table and use **Upsert**: if the row already exists, Upsert does not duplicate; if it does not, it creates. The race between "read and decide" is eliminated by the unique index.
3. Only execute the side effect (send e-mail, call API, create record) after securing the key reservation.

For external APIs, the same principle applies: send an idempotency header (many endpoints accept `Idempotency-Key`) carrying your business key, letting the remote side deduplicate. When the API does not support it, persist the return value (the ID of the created resource) in your control table so a second pass reuses the result instead of creating again.

**Concurrency and the gap between read and write**

The most common mistake is a flow that does "List rows to check if I already processed" followed by "if not, process". Between the List and the processing there is a window in which another instance reads the same state and reaches the same conclusion. Two complementary fixes:

* **Serialize** what must be unique: in an Apply to each, set concurrency control to degree 1 for the critical section, or use a Dataverse table as a queue with atomic pick (see the queue pattern already covered on this blog).
* **Let the database decide**, never the flow: an Upsert with alternate key, or a create that fails on duplicate key caught by a Catch scope, is far safer than an If based on a prior read.

**A practical hardening checklist**

Before publishing a flow with a visible side effect (e-mail, ERP, payment, ticket), run this checklist:

1. Is the trigger as narrow as possible (filter columns/rows, trigger condition)?
2. Does the flow ignore its own updates, breaking recursion?
3. Is there a deterministic business key for each unit of work?
4. Is the side effect protected by Upsert with alternate key or by an API idempotency key?
5. Is the critical section serialized, or does it delegate deduplication to the database/queue?
6. Is there an error scope that distinguishes "already processed" from "real failure"?

Critical automations fail silently — a duplicate posting only surfaces at the accounting close. If your business depends on flows that touch money, inventory or customer communication, it pays to design idempotency from the start, not as a patch. Dynamic Solucoes helps architect, review and sustain resilient corporate automations — from the trigger all the way to governance in managed solutions.
