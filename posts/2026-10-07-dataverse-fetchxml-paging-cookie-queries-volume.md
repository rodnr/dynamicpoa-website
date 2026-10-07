---
title: "Dataverse: particionamento de queries com FetchXML paging cookie"
description: "Extrair grandes volumes do Dataverse sem timeout exige paginação correta. Veja como o paging cookie supera o page number e evita leituras incompletas em produção."
date: '2026-10-07 19:17:37'
---
Quem já tentou extrair algumas centenas de milhares de registros do Dataverse em um fluxo de integração ou em um relatório customizado conhece o problema: a consulta funciona com 5 mil linhas no ambiente de desenvolvimento e quebra silenciosamente em produção, retornando menos registros do que o esperado ou estourando o tempo limite. Quase sempre a causa é paginação feita da forma errada. O Dataverse limita cada resposta a 5.000 registros por página — e a forma como você pede a próxima página muda tudo.

**Por que page number não escala**

O FetchXML aceita dois atributos de paginação: `page` e `count`. É tentador simplesmente incrementar `page=1`, `page=2`, `page=3` até acabar. Isso funciona para conjuntos pequenos, mas tem dois problemas graves em escala:

* **Custo crescente por página.** Internamente, paginar por número de página faz o servidor reler e descartar todas as linhas das páginas anteriores para chegar na sua. A página 1 é barata; a página 200 relê 995 mil registros antes de devolver os 5 mil que interessam. O custo cresce de forma quadrática e é o que produz o timeout.
* **Inconsistência sob escrita concorrente.** Se registros forem inseridos ou removidos entre uma página e outra, a janela desliza: linhas podem aparecer duas vezes ou serem puladas. Para uma integração que precisa de leitura completa e sem duplicata, isso é inaceitável.

**O paging cookie resolve os dois problemas**

A resposta do Dataverse para uma consulta paginada inclui um `paging-cookie` — um token que codifica a chave de ordenação do último registro retornado (tipicamente o `primaryid` mais a coluna de ordenação). Na próxima chamada, em vez de dizer "me dê a página 2", você devolve o cookie e diz "continue depois daqui".

Na prática, o servidor passa a usar o cookie como um filtro de keyset — algo como `WHERE sortkey > último_valor` — em vez de pular N linhas. O custo de cada página fica constante, independentemente de estar na página 2 ou na 2.000, e a leitura fica estável mesmo com escrita concorrente, porque você está ancorado em uma chave e não em uma posição numérica.

**Como usar via Web API e via SDK**

No FetchXML, você controla a paginação pelos atributos do elemento `fetch`:

```
<fetch count="5000" page="1" paging-cookie="...">
```

Na primeira chamada, envie sem cookie. A resposta traz o atributo `@Microsoft.Dynamics.CRM.fetchxmlpagingcookie` (na Web API) ou a propriedade `PagingCookie` (no SDK `RetrieveMultiple`), além de `morerecords` indicando se há mais páginas. Você injeta esse cookie de volta no FetchXML da próxima requisição, incrementa o `page` e repete até `morerecords` ser falso.

Alguns cuidados que separam o protótipo da solução de produção:

* **Sempre inclua um `order` explícito e estável.** O cookie codifica a ordenação; sem um `order` determinístico (idealmente incluindo a chave primária como desempate), o paging cookie não tem como garantir continuidade correta.
* **Escape o cookie corretamente.** O conteúdo do cookie vem com XML codificado. Ao reinseri-lo no FetchXML, você precisa tratar o encoding, ou a consulta falha com erro de parse — um dos bugs mais comuns em implementações caseiras.
* **Prefira a Web API com `odata.maxpagesize`** quando estiver consumindo OData em vez de FetchXML puro: o header `Prefer: odata.maxpagesize=5000` e o `@odata.nextLink` da resposta implementam o mesmo mecanismo de keyset de forma transparente, e você só segue o `nextLink` até ele não vir mais.

**Onde isso aparece no dia a dia**

Se você usa Power Automate com o conector do Dataverse, a ação **List rows** já pagina internamente, mas tem seu próprio limite e pode ser cara em consumo de ações quando o volume é alto. Para cargas realmente grandes — sincronização inicial de uma integração, exportação para um data lake, reconciliação em lote — vale delegar a extração para uma Azure Function ou um custom connector que fale Web API diretamente e controle o paging cookie, persistindo o progresso de forma idempotente (por exemplo, guardando o último cookie ou a última chave processada) para poder retomar de onde parou em caso de falha.

Isso conecta com um ponto de arquitetura mais amplo: o Power Automate é excelente para orquestração, mas extrações de alto volume quase sempre pertencem a um componente de código que entende o modelo de paginação do Dataverse. Escolher o lugar certo para cada responsabilidade é o que mantém a solução dentro dos limites da plataforma e previsível em custo.

**Roteiro rápido de decisão**

1. Volume pequeno e esporádico, dentro de um fluxo? Use **List rows** do conector e não reinvente a roda.
2. Volume grande, leitura completa e consistente? Use **paging cookie** via Web API ou SDK, com `order` estável e persistência de progresso.
3. Precisa de delta (só o que mudou desde a última execução)? Combine com change tracking / delta tokens em vez de reler tudo a cada ciclo.
4. A lógica virou um laço grande dentro do Power Automate? É sinal de mover a extração para Azure Function ou custom connector.

Se sua empresa depende de integrações que leem grandes volumes do Dataverse e precisa garantir que nenhum registro seja perdido ou duplicado no caminho, contar com um parceiro que domina esses detalhes de arquitetura faz diferença direta em estabilidade e custo. A Dynamic Soluções ajuda a desenhar e implementar essas extrações com a governança e o ALM corretos.



Anyone who has tried to pull a few hundred thousand records out of Dataverse inside an integration flow or a custom report knows the pattern: the query works fine with 5,000 rows in the dev environment and then silently breaks in production — returning fewer records than expected or hitting the time limit. The cause is almost always pagination done the wrong way. Dataverse caps every response at 5,000 records per page — and how you ask for the next page changes everything.

**Why page number doesn't scale**

FetchXML accepts two pagination attributes: `page` and `count`. It's tempting to just increment `page=1`, `page=2`, `page=3` until you run out. That works for small sets, but it has two serious problems at scale:

* **Growing cost per page.** Internally, paging by page number forces the server to re-read and discard all the rows from previous pages to reach yours. Page 1 is cheap; page 200 re-reads 995,000 records before handing back the 5,000 you actually want. The cost grows quadratically, and that's what produces the timeout.
* **Inconsistency under concurrent writes.** If records are inserted or deleted between one page and the next, the window slides: rows can show up twice or be skipped entirely. For an integration that needs a complete, de-duplicated read, that's unacceptable.

**The paging cookie solves both problems**

The Dataverse response for a paginated query includes a `paging-cookie` — a token that encodes the sort key of the last returned record (typically the `primaryid` plus the sort column). On the next call, instead of saying "give me page 2", you hand the cookie back and say "continue after this point".

In practice the server starts using the cookie as a keyset filter — something like `WHERE sortkey > last_value` — rather than skipping N rows. The cost of each page stays constant, whether you're on page 2 or page 2,000, and the read stays stable even under concurrent writes, because you're anchored to a key rather than a numeric position.

**How to use it via Web API and via SDK**

In FetchXML, you control pagination through the attributes of the `fetch` element:

```
<fetch count="5000" page="1" paging-cookie="...">
```

On the first call, send it without a cookie. The response carries the `@Microsoft.Dynamics.CRM.fetchxmlpagingcookie` attribute (in the Web API) or the `PagingCookie` property (in the SDK's `RetrieveMultiple`), plus `morerecords` indicating whether more pages exist. You inject that cookie back into the FetchXML of the next request, increment `page`, and repeat until `morerecords` is false.

A few details separate a prototype from a production solution:

* **Always include an explicit, stable `order`.** The cookie encodes the ordering; without a deterministic `order` (ideally including the primary key as a tiebreaker), the paging cookie can't guarantee correct continuity.
* **Escape the cookie properly.** The cookie content comes XML-encoded. When you reinsert it into the FetchXML, you need to handle the encoding, or the query fails with a parse error — one of the most common bugs in homegrown implementations.
* **Prefer the Web API with `odata.maxpagesize`** when you're consuming OData instead of raw FetchXML: the `Prefer: odata.maxpagesize=5000` header and the response's `@odata.nextLink` implement the same keyset mechanism transparently, and you simply follow the `nextLink` until it stops appearing.

**Where this shows up in real life**

If you use Power Automate with the Dataverse connector, the **List rows** action already paginates internally, but it has its own limit and can be expensive in action consumption when volume is high. For truly large loads — the initial sync of an integration, export to a data lake, batch reconciliation — it's worth delegating the extraction to an Azure Function or a custom connector that speaks the Web API directly and controls the paging cookie, persisting progress idempotently (for example, storing the last cookie or the last processed key) so it can resume from where it stopped after a failure.

This ties back to a broader architecture point: Power Automate is excellent for orchestration, but high-volume extractions almost always belong in a code component that understands the Dataverse paging model. Choosing the right place for each responsibility is what keeps the solution within platform limits and predictable in cost.

**Quick decision checklist**

1. Small, occasional volume inside a flow? Use the connector's **List rows** and don't reinvent the wheel.
2. Large volume, complete and consistent read? Use the **paging cookie** via Web API or SDK, with a stable `order` and progress persistence.
3. Need delta (only what changed since the last run)? Combine it with change tracking / delta tokens instead of re-reading everything each cycle.
4. The logic turned into a giant loop inside Power Automate? That's your signal to move the extraction into an Azure Function or custom connector.

If your company depends on integrations that read large volumes from Dataverse and needs to guarantee that no record is lost or duplicated along the way, having a partner who masters these architecture details makes a direct difference in stability and cost. Dynamic Soluções helps design and implement these extractions with the right governance and ALM.
