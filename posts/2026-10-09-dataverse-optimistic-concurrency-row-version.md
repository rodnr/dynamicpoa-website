---
title: "Dataverse: concurrency com row versioning e optimistic locking"
description: "Como evitar que duas atualizacoes simultaneas no Dataverse sobrescrevam uma a outra usando optimistic concurrency, ETag, If-Match e o padrao de retry correto."
date: '2026-10-09 18:44:25'
---
Em cenarios de alto volume e multiplos usuarios editando o mesmo registro, o problema do *lost update* aparece silenciosamente: dois processos leem a mesma linha, cada um aplica sua mudanca e grava, e a ultima escrita apaga a primeira sem nenhum erro. No Dataverse, a resposta para isso e **optimistic concurrency** — um mecanismo que a plataforma oferece de forma nativa, mas que a maioria das integracoes simplesmente ignora.

**O que e optimistic concurrency no Dataverse**

Cada registro no Dataverse carrega uma coluna de sistema chamada `versionnumber` (um `BigInt` incremental, exposto como ETag na Web API). A cada escrita bem-sucedida, esse numero muda. A ideia da concorrencia otimista e simples: no momento de atualizar, voce informa qual versao leu; se a versao atual no servidor for diferente, a plataforma rejeita a escrita em vez de sobrescrever cegamente.

Ela e chamada de *otimista* porque assume que conflitos sao raros — nao ha lock pessimista segurando a linha entre a leitura e a escrita. Isso e exatamente o comportamento desejado em sistemas web de alta concorrencia, onde manter locks abertos destruiria a performance.

**Como ativar via SDK**

No SDK (.NET), o `UpdateRequest` aceita a propriedade `ConcurrencyBehavior`. Os valores relevantes:

* `Default` — segue o comportamento padrao da entidade (para a maioria das tabelas customizadas, equivale a *nao* checar).
* `IfRowVersionMatches` — so grava se o `RowVersion` do objeto Entity bater com o do servidor.
* `AlwaysOverwrite` — ignora a versao e sobrescreve (o comportamento perigoso, mas as vezes intencional).

O padrao e carregar a entidade (o `RowVersion` vem preenchido), aplicar as mudancas sobre esse mesmo objeto e enviar o update com `ConcurrencyBehavior = ConcurrencyBehavior.IfRowVersionMatches`. Se a linha mudou nesse meio tempo, o servidor lanca uma `ConcurrencyException`.

**Como fazer na Web API**

Na Web API REST, o mecanismo e o ETag padrao de HTTP. Toda resposta de `GET` de um registro traz um header `ETag` (ou o campo `@odata.etag`). Para uma atualizacao condicional, voce envia esse valor no header `If-Match`:

* `If-Match: "<etag>"` — grava apenas se a versao ainda for aquela; caso contrario, retorna **412 Precondition Failed**.
* `If-Match: *` — grava se o registro existir (usado em upsert para evitar criar).
* `If-None-Match: *` — cria apenas se nao existir (o outro lado do upsert).

Esse e o detalhe que muda tudo em integracoes externas: um custom connector ou Azure Function que faz `GET` e depois `PATCH` sem `If-Match` esta operando em `AlwaysOverwrite` na pratica, e vai perder updates sob carga.

**O padrao de retry: read-modify-write**

Concorrencia otimista nao evita conflitos — ela os *detecta*. Quem consome precisa saber o que fazer quando o 412 (ou `ConcurrencyException`) acontece. O padrao correto e um loop de read-modify-write com retry:

1. Ler o registro e capturar a versao atual.
2. Aplicar a regra de negocio sobre o valor lido.
3. Tentar gravar com `If-Match`.
4. Se vier 412, **reler** o registro (agora com a versao nova), reaplicar a regra e tentar de novo, com um limite de tentativas e backoff.

O erro grave aqui e reenviar o mesmo PATCH com a versao antiga em loop — isso nunca converge. A relectura e obrigatoria porque o estado mudou, e a regra de negocio precisa decidir sobre o dado atualizado (ex.: um contador de estoque precisa decrementar sobre o novo saldo, nao sobre o que foi lido primeiro).

**Quando isso nao e a ferramenta certa**

Concorrencia otimista resolve o *lost update* em updates completos, mas tem limites:

* **Operacoes de incremento/decremento de alto contencao** — se muitos processos disputam o mesmo contador, o retry vira hotspot e a vazao despenca. Nesses casos, considere mover a logica para um plugin em `pre-operation` que recalcula no servidor dentro da transacao, ou uma fila (Dataverse ou Service Bus) serializando as escritas por chave.
* **Agregacoes** — para somas/contagens, prefira rollup columns ou um job de agregacao em vez de read-modify-write concorrente.
* **Power Automate** — o conector do Dataverse nao expoe `If-Match` de forma amigavel; para concorrencia real em fluxos, costuma ser mais seguro delegar a gravacao critica a um child flow com controle de concorrencia ou a um plugin.

**Roteiro de decisao**

* Integracao externa que le e atualiza registros existentes? Sempre enviar `If-Match` com o ETag e implementar retry — e barato e evita corrupcao silenciosa.
* Formulario model-driven multiusuario no mesmo registro? A plataforma ja avisa conflito de versao na UI; valide se a regra depende de valores que outros editam ao mesmo tempo.
* Contador ou saldo sob alta contencao? Serialize no servidor (plugin em transacao ou fila), nao confie so em retry otimista.

Controlar concorrencia e um daqueles detalhes de arquitetura que nunca aparece em demos, mas define se uma integracao sobrevive em producao. Se a sua empresa opera soluções criticas sobre o Dataverse e precisa garantir integridade de dados sob carga, a Dynamic Soluções pode ajudar a desenhar o padrao de escrita certo — de custom connectors a plugins e governanca de ALM.



In high-volume, multi-user scenarios where several people edit the same record, the *lost update* problem creeps in silently: two processes read the same row, each applies its change and saves, and the last write wipes out the first with no error at all. In Dataverse, the answer to this is **optimistic concurrency** — a mechanism the platform provides natively, yet most integrations simply ignore.

**What optimistic concurrency means in Dataverse**

Every Dataverse record carries a system column called `versionnumber` (an incremental `BigInt`, exposed as an ETag in the Web API). On each successful write, that number changes. The idea of optimistic concurrency is simple: when you update, you declare which version you read; if the current version on the server differs, the platform rejects the write instead of blindly overwriting it.

It is called *optimistic* because it assumes conflicts are rare — there is no pessimistic lock holding the row between read and write. That is exactly the behavior you want in high-concurrency web systems, where keeping locks open would destroy performance.

**How to enable it via the SDK**

In the .NET SDK, `UpdateRequest` accepts a `ConcurrencyBehavior` property. The relevant values:

* `Default` — follows the entity's default behavior (for most custom tables, this means *no* check).
* `IfRowVersionMatches` — only writes if the Entity object's `RowVersion` matches the server's.
* `AlwaysOverwrite` — ignores the version and overwrites (the dangerous one, but sometimes intentional).

The pattern is to load the entity (its `RowVersion` comes populated), apply your changes to that same object, and send the update with `ConcurrencyBehavior = ConcurrencyBehavior.IfRowVersionMatches`. If the row changed in the meantime, the server throws a `ConcurrencyException`.

**How to do it on the Web API**

On the REST Web API, the mechanism is the standard HTTP ETag. Every record `GET` response carries an `ETag` header (or the `@odata.etag` field). For a conditional update, you send that value in the `If-Match` header:

* `If-Match: "<etag>"` — writes only if the version is still that one; otherwise it returns **412 Precondition Failed**.
* `If-Match: *` — writes if the record exists (used in upsert to avoid creating).
* `If-None-Match: *` — creates only if it does not exist (the other side of upsert).

This is the detail that changes everything in external integrations: a custom connector or Azure Function that does `GET` then `PATCH` without `If-Match` is effectively running in `AlwaysOverwrite` mode, and will lose updates under load.

**The retry pattern: read-modify-write**

Optimistic concurrency does not prevent conflicts — it *detects* them. The consumer must know what to do when the 412 (or `ConcurrencyException`) fires. The correct pattern is a read-modify-write loop with retry:

1. Read the record and capture the current version.
2. Apply the business rule over the value read.
3. Attempt the write with `If-Match`.
4. If a 412 comes back, **re-read** the record (now with the new version), re-apply the rule, and try again, with a retry limit and backoff.

The serious mistake here is resending the same PATCH with the old version in a loop — that never converges. Re-reading is mandatory because the state changed, and the business rule must decide based on the updated data (e.g., a stock counter must decrement over the new balance, not over what was read first).

**When this is not the right tool**

Optimistic concurrency solves *lost updates* in full updates, but it has limits:

* **High-contention increment/decrement operations** — if many processes fight over the same counter, retries become a hotspot and throughput collapses. In those cases, consider moving the logic to a `pre-operation` plugin that recalculates on the server inside the transaction, or a queue (Dataverse or Service Bus) serializing writes per key.
* **Aggregations** — for sums/counts, prefer rollup columns or an aggregation job over concurrent read-modify-write.
* **Power Automate** — the Dataverse connector does not expose `If-Match` in a friendly way; for real concurrency in flows, it is usually safer to delegate the critical write to a child flow with concurrency control or to a plugin.

**Decision guide**

* External integration reading and updating existing records? Always send `If-Match` with the ETag and implement retry — it is cheap and prevents silent corruption.
* Multi-user model-driven form on the same record? The platform already warns about version conflicts in the UI; validate whether the rule depends on values others edit at the same time.
* Counter or balance under high contention? Serialize on the server (plugin in a transaction or queue), do not rely on optimistic retry alone.

Concurrency control is one of those architecture details that never shows up in demos but decides whether an integration survives in production. If your company runs critical solutions on Dataverse and needs to guarantee data integrity under load, Dynamic Soluções can help design the right write pattern — from custom connectors to plugins and ALM governance.
