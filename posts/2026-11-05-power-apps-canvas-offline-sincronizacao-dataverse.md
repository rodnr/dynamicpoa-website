---
title: "Power Apps Canvas: offline nativo com sincronizacao confiavel"
description: "Como arquitetar apps canvas offline-first com o Dataverse offline mode, resolucao de conflitos, fila de pendentes e os limites reais da sincronizacao."
date: '2026-11-05 20:34:06'
---
Equipes de campo — tecnicos de manutencao, inspetores, operadores em chao de fabrica sem Wi-Fi — expoem o ponto cego de boa parte dos apps canvas: eles assumem conectividade permanente. No momento em que a rede cai, o `Patch` falha, a `Gallery` fica vazia e o usuario perde o trabalho. Construir offline de verdade no Power Apps nao e ligar um toggle: e decidir onde os dados moram, como voltam ao servidor e o que acontece quando dois usuarios editam o mesmo registro desconectados.

**Dois caminhos: offline manual com SaveData/LoadData vs. Dataverse offline mode**

Historicamente, offline no canvas era feito na mao com `SaveData`, `LoadData` e `Collect`. Voce carrega os dados em uma collection quando online, persiste localmente com `SaveData`, e na volta percorre uma fila de pendencias fazendo `Patch` um a um. Funciona, mas e artesanal: voce escreve toda a logica de deteccao de conectividade (`Connection.Connected`), de fila, de retry e de conflito. `SaveData` tem limite de tamanho no navegador e e pensado para o mobile player, nao para a web.

O caminho moderno e o **Dataverse offline mode** (mobile offline profiles). Voce define um perfil offline que descreve quais tabelas e quais linhas ficam disponiveis localmente (via filtros, incluindo filtros relacionais tipo "so os meus registros" ou "so da minha business unit"). O Power Apps mobile mantem um banco local SQLite, sincroniza em background e o app le e escreve nesse banco mesmo offline — a mesma expressao `Filter`/`Patch` funciona nas duas pontas. A sincronizacao e a resolucao de conflito ficam a cargo da plataforma, nao do seu codigo.

**O que o Dataverse offline mode entrega de fato**

* **Sync seletiva por perfil**: voce nao baixa a tabela inteira. Filtros no perfil limitam volume — critico, porque um celular nao aguenta sincronizar milhoes de linhas. Pense no perfil como um recorte do dataset por usuario.
* **Delta sync**: apos a carga inicial, apenas mudancas sao trafegadas, usando change tracking do Dataverse por tras. Isso reduz drasticamente o consumo de dados movel.
* **Escrita offline enfileirada**: `Patch`/`Remove` offline gravam no banco local e entram numa fila de outbox que e drenada quando a conexao volta.
* **Resolucao de conflito "last writer wins" por padrao**: se dois usuarios editaram a mesma linha, a ultima sincronizacao sobrescreve. Nem sempre e o que voce quer.

**O calcanhar de Aquiles: conflitos e colunas calculadas**

Aqui mora o risco de producao. Em last-writer-wins, nao ha merge por coluna — a linha inteira do ultimo sync vence, e edicoes do outro usuario simplesmente somem sem aviso. Para registros concorrentes isso corrompe dados de forma silenciosa. Estrategias para mitigar:

1. **Reduza a superficie de conflito por design**: modele o trabalho de campo em linhas-filhas de propriedade exclusiva do usuario (uma inspecao pertence a um inspetor), em vez de todos editarem a mesma linha-pai. Sem concorrencia na mesma linha, nao ha conflito.
2. **Prefira append a update**: em vez de incrementar um campo, crie uma linha de evento/leitura e agregue no servidor (rollup ou plugin). Append nao colide; update colide.
3. **Logica no servidor roda so no sync**: plugins, business rules de entidade, rollup e formula columns NAO executam offline. Um total calculado por rollup so atualiza quando a linha chega ao Dataverse. Nao dependa desses valores na UI offline — calcule localmente em Power Fx o que o usuario precisa ver na hora.
4. **Lookups e relacionamentos** precisam estar no mesmo perfil offline para resolverem localmente; senao o `.Name` do relacionado vem vazio ate sincronizar.

**Limites que decidem a arquitetura antes de voce codar**

* **Nem todo conector e offline**: o Dataverse offline mode cobre Dataverse. Chamadas a SharePoint, APIs REST via conector HTTP ou Power Automate exigem rede — se o fluxo do app depende de um flow no meio da operacao, ele quebra offline. Desacople: grave a intencao no Dataverse e deixe um plugin/flow processar no sync.
* **Plataforma mobile**: offline mode e para o app Power Apps mobile (iOS/Android). Nao espere o mesmo comportamento no browser.
* **Volume e storage do dispositivo**: o banco local tem custo em disco e no tempo de carga inicial. Perfis largos demais fazem o primeiro sync demorar minutos e esgotar armazenamento.
* **Seguranca ainda e do Dataverse**: o que o usuario ve offline respeita as security roles dele — o perfil nao contorna permissao, so recorta dados que ele ja pode ver.

**Um padrao de referencia para app de campo offline-first**

1. Modele as tabelas de trabalho com propriedade por usuario (owner = tecnico) para minimizar conflito.
2. Crie um perfil offline com filtros enxutos: "minhas ordens abertas dos ultimos 30 dias" em vez de "todas as ordens".
3. Toda escrita no app usa `Patch` direto no Dataverse — a plataforma decide local vs. remoto.
4. Nenhuma operacao critica depende de flow sincrono; flows rodam em post-operation no servidor apos o sync.
5. Mostre no app o estado de sincronizacao (pendencias na outbox) para o usuario saber que ainda nao subiu.
6. Teste o pior caso: modo aviao durante uma edicao, reconexao com conflito, bateria sincronizando em background.

Offline bem feito e decisao de modelo de dados, nao de codigo de tela. Quando a arquitetura evita conflito e nao depende de servico sincrono no meio da operacao, o Dataverse offline mode entrega uma experiencia solida; quando voce ignora isso, o app parece funcionar nos testes com Wi-Fi e corrompe dados em campo. Na Dynamic Solucoes ajudamos a desenhar essa arquitetura offline-first — do perfil de sincronizacao ao modelo de dados que evita conflito — para que suas equipes de campo trabalhem sem depender de sinal.



Field teams — maintenance technicians, inspectors, shop-floor operators with no Wi-Fi — expose the blind spot of most canvas apps: they assume permanent connectivity. The moment the network drops, `Patch` fails, the `Gallery` goes empty and the user loses their work. Building real offline in Power Apps isn't flipping a toggle: it's deciding where the data lives, how it gets back to the server, and what happens when two users edit the same record while disconnected.

**Two paths: manual offline with SaveData/LoadData vs. Dataverse offline mode**

Historically, canvas offline was hand-rolled with `SaveData`, `LoadData` and `Collect`. You load data into a collection while online, persist it locally with `SaveData`, and on reconnect you walk a pending queue issuing `Patch` one by one. It works, but it's artisanal: you write all the connectivity-detection logic (`Connection.Connected`), the queue, the retry and the conflict handling yourself. `SaveData` has a browser size limit and is meant for the mobile player, not the web.

The modern path is **Dataverse offline mode** (mobile offline profiles). You define an offline profile describing which tables and which rows are available locally (via filters, including relational filters like "only my records" or "only my business unit"). Power Apps mobile keeps a local SQLite store, syncs in the background, and the app reads and writes against that store even offline — the same `Filter`/`Patch` expression works on both ends. Sync and conflict resolution are handled by the platform, not your code.

**What Dataverse offline mode actually delivers**

* **Selective sync per profile**: you don't download the whole table. Profile filters cap the volume — critical, because a phone can't sync millions of rows. Think of the profile as a per-user slice of the dataset.
* **Delta sync**: after the initial load, only changes travel, using Dataverse change tracking under the hood. This drastically cuts mobile data usage.
* **Queued offline writes**: offline `Patch`/`Remove` write to the local store and enter an outbox queue that drains when the connection returns.
* **"Last writer wins" conflict resolution by default**: if two users edited the same row, the last sync overwrites. That's not always what you want.

**The Achilles' heel: conflicts and calculated columns**

This is where production risk lives. With last-writer-wins there's no per-column merge — the whole row from the last sync wins, and the other user's edits simply vanish with no warning. For concurrent records this silently corrupts data. Strategies to mitigate:

1. **Reduce the conflict surface by design**: model field work as child rows exclusively owned by the user (one inspection belongs to one inspector) instead of everyone editing the same parent row. No concurrency on the same row, no conflict.
2. **Prefer append over update**: instead of incrementing a field, create an event/reading row and aggregate on the server (rollup or plugin). Appends don't collide; updates do.
3. **Server logic runs only on sync**: plugins, entity business rules, rollup and formula columns do NOT execute offline. A rollup total only updates when the row reaches Dataverse. Don't depend on these values in the offline UI — compute locally in Power Fx whatever the user needs to see right then.
4. **Lookups and relationships** must be in the same offline profile to resolve locally; otherwise the related `.Name` comes back empty until sync.

**Limits that decide the architecture before you write code**

* **Not every connector is offline**: Dataverse offline mode covers Dataverse. Calls to SharePoint, REST APIs via the HTTP connector, or Power Automate require the network — if the app flow depends on a flow mid-operation, it breaks offline. Decouple: record the intent in Dataverse and let a plugin/flow process on sync.
* **Mobile platform**: offline mode is for the Power Apps mobile app (iOS/Android). Don't expect the same behavior in the browser.
* **Volume and device storage**: the local store costs disk and initial-load time. Profiles that are too broad make the first sync take minutes and exhaust storage.
* **Security is still Dataverse's**: what the user sees offline respects their security roles — the profile doesn't bypass permission, it only slices data they can already see.

**A reference pattern for an offline-first field app**

1. Model the work tables with per-user ownership (owner = technician) to minimize conflict.
2. Create an offline profile with tight filters: "my open orders from the last 30 days" instead of "all orders".
3. Every app write uses `Patch` straight to Dataverse — the platform decides local vs. remote.
4. No critical operation depends on a synchronous flow; flows run in post-operation on the server after sync.
5. Surface the sync state in the app (outbox pending items) so the user knows it hasn't uploaded yet.
6. Test the worst case: airplane mode during an edit, reconnect with a conflict, battery syncing in the background.

Good offline is a data-model decision, not a screen-code one. When the architecture avoids conflict and doesn't rely on a synchronous service mid-operation, Dataverse offline mode delivers a solid experience; when you ignore that, the app seems to work in Wi-Fi tests and corrupts data in the field. At Dynamic Soluções we help design this offline-first architecture — from the sync profile to the data model that avoids conflict — so your field teams can work without depending on signal.
