---
title: "Dataverse: auditoria e change tracking para conformidade"
description: "Como configurar auditoria e change tracking no Dataverse sem inflar o storage: escopos, retenção, custo, sincronização incremental e boas práticas de governança."
date: '2026-09-21 18:35:52'
---
Registrar quem alterou o quê e quando parece um detalhe de configuração, mas em ambientes Dataverse que sustentam Dynamics 365 e apps model-driven críticos, a auditoria vira peça central de conformidade — e, se mal configurada, uma das maiores fontes de consumo de storage e de degradação silenciosa. Vale entender exatamente o que a plataforma grava, quanto custa e como usar change tracking para integrações sem confundir os dois mecanismos.

**Auditoria e change tracking resolvem problemas diferentes**

É comum tratar auditoria (auditing) e change tracking como sinônimos. Eles não são.

* **Auditoria** existe para *conformidade e forense*: registra alterações de dados (create/update/delete), acesso a registros e eventos de administração, com autor, timestamp e valores antigo/novo. Os registros ficam em partições de audit history, consultáveis pela trilha de auditoria no formulário ou via Web API (`audit` entity), e são imutáveis para o usuário.
* **Change tracking** existe para *sincronização incremental*: permite que um sistema externo pergunte "o que mudou desde o meu último sync?" via delta tokens na Web API. Não guarda valor antigo, não é uma trilha de conformidade — é um mecanismo de delta para ETL e integração.

Usar auditoria como fonte de integração é um antipadrão clássico: infla storage, é caro de consultar e não foi desenhado para isso. Para alimentar um data warehouse ou um Fabric, o caminho é change tracking (ou Synapse Link / Fabric Link, que se apoiam nele).

**A auditoria é hierárquica — e é aí que o storage explode**

A auditoria no Dataverse é habilitada em três níveis, e todos precisam estar ligados para o registro acontecer:

1. **Environment** — chave-mestra em System Settings (Auditing). Se estiver off, nada é gravado.
2. **Table (entity)** — cada tabela tem seu flag de auditoria.
3. **Column** — dentro de uma tabela auditada, cada coluna pode ser incluída ou não.

O erro mais comum é ligar auditoria no ambiente e marcar tabelas inteiras "por precaução", incluindo colunas de alta cardinalidade e alto churn (campos calculados atualizados por rollup, timestamps, campos de status que mudam a cada etapa de workflow). Cada update auditado gera uma linha de audit history com o diff. Em tabelas de alto volume transacional, isso vira gigabytes de log — que consomem a cota de **Dataverse Log storage** (uma das três cotas de capacidade, junto de Database e File) e pesam no custo.

A disciplina prática: audite *o que precisa ser defensável* (campos financeiros, de status regulatório, de titularidade/owner, de dados pessoais sob LGPD) e deixe de fora colunas técnicas e ruidosas.

**Retenção não era controlável — agora é**

Historicamente, o audit log crescia indefinidamente e a única forma de limpar era deletar partições inteiras por período, perdendo granularidade. Hoje o Dataverse oferece **políticas de retenção de auditoria** configuráveis (por exemplo, reter por N meses e expirar automaticamente), o que muda a estratégia: em vez de sofrer com storage crescente ou deletes manuais arriscados, define-se uma janela alinhada à exigência regulatória (muitas normas pedem 12, 24 ou 60 meses) e deixa a plataforma expirar o excedente.

Recomendações ao desenhar retenção:

* Alinhe a janela ao requisito legal real, não a "o máximo possível". Reter tudo para sempre é custo puro sem valor de conformidade adicional.
* Se houver exigência de arquivamento além da janela operacional, extraia o audit history periodicamente (Web API sobre a entidade `audit`) para armazenamento frio antes de expirar.
* Trate a mudança de política como evento de governança — reduzir retenção pode apagar histórico que alguém esperava ter.

**Change tracking sem armadilhas de sincronização**

Do lado da integração, habilitar change tracking numa tabela é simples, mas há detalhes de produção que derrubam pipelines:

* **Guarde o delta token, não a data.** O padrão correto é a query inicial retornar um token de deleção/delta; a próxima chamada usa esse token para trazer só o que mudou. Basear sync em "registros modificados após timestamp X" é frágil (fusos, relógios, updates concorrentes) — o token existe justamente para eliminar isso.
* **Deletes aparecem como tombstones.** Change tracking informa registros deletados, mas essa informação também expira. Se o consumidor ficar offline além da janela de retenção do change tracking, o token fica inválido e é preciso um *full sync* de reconciliação. Planeje esse fallback.
* **Não confunda com auditoria para reconstruir estado.** Change tracking te dá o estado atual do que mudou, não o valor anterior. Se a integração precisa do "de/para", isso é responsabilidade do destino (armazenar histórico) ou da auditoria — não do delta token.

Para cargas em escala rumo a analytics, prefira **Synapse Link for Dataverse** ou o **link com Microsoft Fabric**, que gerenciam o change tracking por baixo e entregam os dados em Delta/Parquet no OneLake, evitando construir e manter o loop de delta token manualmente.

**Um roteiro enxuto de decisão**

1. Precisa provar *quem mudou o quê* para auditor/regulador? → Auditoria, restrita às colunas defensáveis, com política de retenção alinhada à norma.
2. Precisa *replicar dados que mudaram* para um sistema externo ou warehouse? → Change tracking (ou Synapse/Fabric Link por cima dele), nunca auditoria.
3. Precisa das duas coisas? → Ative os dois de forma independente e monitore separadamente o Log storage (auditoria) e a saúde dos tokens (integração).
4. Storage crescendo? → Revise colunas auditadas de alto churn antes de comprar mais capacidade.

Governar auditoria e change tracking no Dataverse é menos sobre ligar interruptores e mais sobre desenhar *o mínimo necessário* para conformidade e integração, com custo previsível. Se sua empresa opera Dynamics 365 ou apps model-driven em escala e precisa de uma trilha de auditoria que aguente auditor externo sem estourar a cota de storage, a Dynamic Soluções ajuda a desenhar essa estratégia de governança de ponta a ponta — do escopo de colunas à retenção e à arquitetura de sincronização.



Recording who changed what and when looks like a configuration detail, but in Dataverse environments backing Dynamics 365 and critical model-driven apps, auditing becomes a core piece of compliance — and, if poorly configured, one of the biggest sources of storage consumption and silent degradation. It's worth understanding exactly what the platform records, what it costs, and how to use change tracking for integrations without conflating the two mechanisms.

**Auditing and change tracking solve different problems**

It's common to treat auditing and change tracking as synonyms. They aren't.

* **Auditing** exists for *compliance and forensics*: it records data changes (create/update/delete), record access, and admin events, with author, timestamp, and old/new values. The records live in audit history partitions, queryable through the audit trail on the form or via Web API (the `audit` entity), and are immutable to the user.
* **Change tracking** exists for *incremental synchronization*: it lets an external system ask "what changed since my last sync?" via delta tokens in the Web API. It doesn't keep the old value, it isn't a compliance trail — it's a delta mechanism for ETL and integration.

Using auditing as an integration source is a classic antipattern: it inflates storage, is expensive to query, and wasn't designed for it. To feed a data warehouse or Fabric, the right path is change tracking (or Synapse Link / Fabric Link, which rely on it).

**Auditing is hierarchical — and that's where storage explodes**

Auditing in Dataverse is enabled at three levels, and all of them must be on for a record to be written:

1. **Environment** — the master switch in System Settings (Auditing). If it's off, nothing is recorded.
2. **Table (entity)** — each table has its own auditing flag.
3. **Column** — within an audited table, each column can be included or not.

The most common mistake is enabling environment auditing and marking whole tables "just in case," including high-cardinality, high-churn columns (calculated fields refreshed by rollups, timestamps, status fields that change at every workflow step). Each audited update generates an audit history row with the diff. In high-volume transactional tables, this turns into gigabytes of log — consuming the **Dataverse Log storage** quota (one of the three capacity quotas, alongside Database and File) and driving up cost.

The practical discipline: audit *what needs to be defensible* (financial fields, regulatory status, ownership, personal data under privacy laws) and leave out technical, noisy columns.

**Retention wasn't controllable — now it is**

Historically, the audit log grew indefinitely and the only way to clean it was deleting entire partitions by period, losing granularity. Today Dataverse offers configurable **audit retention policies** (for example, retain for N months and expire automatically), which changes the strategy: instead of suffering from ever-growing storage or risky manual deletes, you define a window aligned with the regulatory requirement (many rules ask for 12, 24, or 60 months) and let the platform expire the excess.

Recommendations when designing retention:

* Align the window to the real legal requirement, not to "as much as possible." Keeping everything forever is pure cost with no added compliance value.
* If there's an archival requirement beyond the operational window, extract audit history periodically (Web API over the `audit` entity) to cold storage before it expires.
* Treat policy changes as a governance event — reducing retention can erase history someone expected to have.

**Change tracking without sync pitfalls**

On the integration side, enabling change tracking on a table is simple, but there are production details that break pipelines:

* **Store the delta token, not the date.** The correct pattern is that the initial query returns a delta/deletion token; the next call uses that token to fetch only what changed. Basing sync on "records modified after timestamp X" is fragile (time zones, clocks, concurrent updates) — the token exists precisely to eliminate that.
* **Deletes show up as tombstones.** Change tracking reports deleted records, but that information also expires. If the consumer stays offline beyond the change tracking retention window, the token becomes invalid and a reconciling *full sync* is required. Plan for that fallback.
* **Don't confuse it with auditing to reconstruct state.** Change tracking gives you the current state of what changed, not the previous value. If the integration needs the "from/to," that's the destination's responsibility (store history) or auditing's — not the delta token's.

For at-scale loads toward analytics, prefer **Synapse Link for Dataverse** or the **Microsoft Fabric link**, which manage change tracking under the hood and deliver the data as Delta/Parquet in OneLake, avoiding building and maintaining the delta token loop yourself.

**A lean decision guide**

1. Need to prove *who changed what* to an auditor/regulator? → Auditing, restricted to defensible columns, with a retention policy aligned to the regulation.
2. Need to *replicate changed data* to an external system or warehouse? → Change tracking (or Synapse/Fabric Link on top of it), never auditing.
3. Need both? → Enable them independently and monitor Log storage (auditing) and token health (integration) separately.
4. Storage growing? → Review audited high-churn columns before buying more capacity.

Governing auditing and change tracking in Dataverse is less about flipping switches and more about designing *the minimum necessary* for compliance and integration, with predictable cost. If your company runs Dynamics 365 or model-driven apps at scale and needs an audit trail that withstands an external auditor without blowing the storage quota, Dynamic Soluções helps design this governance strategy end to end — from column scope to retention and sync architecture.
