---
title: "Power Automate: Dataverse Search e Relevance Search em fluxos"
description: "Buscar texto no Dataverse via fluxo sem usar List rows com filtro OData: entenda o Search Rows (preview), o relevance search e quando ele vence o filtro clássico."
date: '2026-11-03 20:02:36'
---
Quase todo fluxo que precisa "achar um registro pelo que o usuário digitou" recorre ao **List rows** com um filtro OData montado na mão: `contains(name, 'texto')`, `startswith`, cadeias de `or`. Funciona para match exato de uma coluna, mas desaba quando a necessidade é busca textual de verdade — procurar um termo em várias colunas, tolerar variação de grafia, ranquear por relevância. Para esse caso existe outra porta de entrada: o **relevance search** do Dataverse, exposto em fluxos pela ação **Search rows (preview)**.

**O que diferencia relevance search de um filtro OData**

O filtro de `List rows` é tradução direta para SQL no banco relacional: ele avalia a expressão coluna por coluna, com os operadores que você declarou, e devolve tudo que casa. Não há noção de pontuação nem de "parece com". Já o relevance search é alimentado por um índice externo (Azure AI Search por trás) construído sobre as tabelas e colunas que você escolhe habilitar. Ele faz:

* **Busca em múltiplas tabelas e colunas de uma vez**, com um único termo, sem você escrever `or` para cada campo.
* **Ranqueamento por relevância** — os resultados voltam ordenados por score, não por uma coluna de ordenação arbitrária.
* **Tolerância linguística** — stemming, fuzzy match e tratamento de termos parciais, coisa que `contains` não entrega.

Em troca, você abre mão do controle fino: não é o lugar para regra de negócio determinística ("me traga exatamente os pedidos com status X e valor > Y"). Relevance search é para a camada de *descoberta*, não de *consulta transacional*.

**Pré-requisito: o search precisa estar ligado no ambiente**

A ação `Search rows` só funciona se o **Dataverse search estiver habilitado** no ambiente (em Power Platform admin center, nas configurações do ambiente). Habilitar não é gratuito em termos de latência de sincronização: ao ligar, o Dataverse precisa indexar as tabelas marcadas, e alterações passam a ser propagadas para o índice de forma assíncrona. Isso tem duas consequências práticas num fluxo:

1. **Há lag de indexação.** Um registro criado há três segundos por outra ação do mesmo fluxo pode ainda não aparecer no `Search rows`. Nunca encadeie "crio o registro → busco ele de volta por texto" — para isso use o GUID retornado pelo Create, ou uma alternate key com `List rows`.
2. **Só busca no que foi indexado.** Tabelas e colunas precisam estar incluídas na configuração de Dataverse search. Se o campo não está no índice, ele não participa da busca por mais relevante que seja.

**Como a ação Search rows se comporta no fluxo**

A entrada principal é um **search term** (string livre) e, opcionalmente, um filtro para restringir o universo antes do ranqueamento. Isso habilita um padrão muito útil: usar o filtro para o recorte determinístico (`statecode eq 0`, uma business unit, um tipo) e deixar o termo textual para o match relevante dentro desse recorte. É o inverso de tentar espremer tudo no OData.

A saída traz, por resultado, o id, o nome lógico da tabela e um conjunto de colunas — útil quando a busca cruza tabelas diferentes, porque cada item diz de qual tabela veio. Isso permite construir, por exemplo, uma busca global para um agente ou um app que consulta contatos, contas e casos num único passo e depois roteia o resultado pelo `entityName`.

**Quando ficar no List rows mesmo**

Relevance search não substitui o filtro clássico nos cenários onde você precisa de:

* **Resultado exaustivo e determinístico** — relatório, reconciliação, processamento de lote. O relevance search otimiza para os melhores resultados, não para "todos".
* **Paginação de alto volume** sobre um conjunto filtrado — aí o padrão é `List rows` com FetchXML e paging cookie (assunto que já tratamos em outro post).
* **Filtro por relacionamento ou agregação** — `link-entity`, lookups, rollups. Isso é terreno de FetchXML/OData, não de busca textual.

Um roteiro simples de decisão: se o input vem de um humano digitando algo impreciso e você quer os "mais prováveis", pense em `Search rows`. Se o input é uma chave, um status ou um intervalo e você quer *exatamente* o que casa, fique no `List rows`.

**Cuidados de produção**

* Trate o **lag de indexação** explicitamente: documente que busca textual não enxerga o que acabou de ser gravado, e para leitura pós-escrita use GUID/alternate key.
* A ação está em **preview** — para fluxos verdadeiramente críticos, pondere o risco de mudança de contrato e tenha um caminho de fallback para `List rows`.
* Lembre que **security roles continuam valendo**: o relevance search respeita o que o usuário conectado pode ver, então o mesmo termo pode retornar conjuntos diferentes dependendo do contexto de segurança — bom para portais e agentes, mas exige teste com usuários reais, não só com conta de serviço privilegiada.
* Mantenha o **escopo do índice enxuto**. Indexar colunas de baixo valor de busca só aumenta ruído e custo de sincronização; inclua no Dataverse search apenas o que de fato alimenta descoberta.

Busca textual bem-feita é a diferença entre um app em que o usuário encontra o que precisa no primeiro clique e um em que ele desiste. Escolher entre relevance search e filtro OData não é detalhe de implementação — é decisão de arquitetura sobre que tipo de pergunta o seu fluxo está respondendo. Se sua equipe está estruturando automações e apps sobre o Dataverse e quer acertar essas escolhas desde o desenho, a consultoria e os planos de suporte da Dynamic Soluções ajudam a construir isso com governança e previsibilidade.



Almost every flow that needs to "find a record based on what the user typed" reaches for **List rows** with a hand-built OData filter: `contains(name, 'text')`, `startswith`, chains of `or`. It works for exact matching on a column, but falls apart when you actually need textual search — searching a term across several columns, tolerating spelling variation, ranking by relevance. For that case there's a different door: Dataverse **relevance search**, exposed to flows through the **Search rows (preview)** action.

**What sets relevance search apart from an OData filter**

The `List rows` filter translates directly into SQL on the relational database: it evaluates the expression column by column, with the operators you declared, and returns everything that matches. There's no notion of scoring or of "looks like". Relevance search, on the other hand, is fed by an external index (Azure AI Search underneath) built over the tables and columns you choose to enable. It gives you:

* **Search across multiple tables and columns at once**, with a single term, without writing `or` for every field.
* **Relevance ranking** — results come back ordered by score, not by an arbitrary sort column.
* **Linguistic tolerance** — stemming, fuzzy matching and partial-term handling, which `contains` simply can't deliver.

In exchange, you give up fine-grained control: it's not the place for deterministic business rules ("bring me exactly the orders with status X and amount > Y"). Relevance search is for the *discovery* layer, not the *transactional query* layer.

**Prerequisite: search must be turned on in the environment**

The `Search rows` action only works if **Dataverse search is enabled** in the environment (in the Power Platform admin center, under the environment settings). Enabling it isn't free in terms of sync latency: once on, Dataverse has to index the flagged tables, and changes start being propagated to the index asynchronously. That has two practical consequences in a flow:

1. **There's indexing lag.** A record created three seconds ago by another action in the same flow may not yet show up in `Search rows`. Never chain "create the record → search it back by text" — for that, use the GUID returned by Create, or an alternate key with `List rows`.
2. **It only searches what was indexed.** Tables and columns have to be included in the Dataverse search configuration. If the field isn't in the index, it doesn't participate in the search no matter how relevant it is.

**How the Search rows action behaves in a flow**

The main input is a **search term** (a free string) and, optionally, a filter to narrow the universe before ranking. This enables a very useful pattern: use the filter for the deterministic cut (`statecode eq 0`, a business unit, a type) and let the textual term handle the relevant match within that cut. It's the inverse of trying to cram everything into OData.

The output brings, per result, the id, the table's logical name and a set of columns — useful when the search crosses different tables, because each item tells you which table it came from. That lets you build, for example, a global search for an agent or an app that queries contacts, accounts and cases in a single step and then routes the result by `entityName`.

**When to stay with List rows after all**

Relevance search doesn't replace the classic filter in scenarios where you need:

* **Exhaustive, deterministic results** — reporting, reconciliation, batch processing. Relevance search optimizes for the best results, not for "all of them".
* **High-volume pagination** over a filtered set — there the pattern is `List rows` with FetchXML and paging cookie (a topic we've covered in another post).
* **Filtering by relationship or aggregation** — `link-entity`, lookups, rollups. That's FetchXML/OData territory, not textual search.

A simple decision guide: if the input comes from a human typing something imprecise and you want the "most likely" matches, think `Search rows`. If the input is a key, a status or a range and you want *exactly* what matches, stay with `List rows`.

**Production considerations**

* Handle **indexing lag** explicitly: document that textual search doesn't see what was just written, and for read-after-write use GUID/alternate key.
* The action is in **preview** — for truly critical flows, weigh the risk of a contract change and keep a fallback path to `List rows`.
* Remember that **security roles still apply**: relevance search respects what the connected user can see, so the same term may return different sets depending on the security context — great for portals and agents, but it requires testing with real users, not just a privileged service account.
* Keep the **index scope lean**. Indexing low-value search columns only adds noise and sync cost; include in Dataverse search only what actually feeds discovery.

Well-built textual search is the difference between an app where the user finds what they need on the first click and one where they give up. Choosing between relevance search and an OData filter isn't an implementation detail — it's an architecture decision about what kind of question your flow is answering. If your team is structuring automations and apps on top of Dataverse and wants to get these choices right from the design stage, Dynamic Soluções' consulting and support plans help build this with governance and predictability.
