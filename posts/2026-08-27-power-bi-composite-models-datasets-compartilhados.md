---
title: "Power BI: composite models e o modelo de dados corporativo compartilhado"
description: "Como estender datasets compartilhados no Power BI com composite models, DirectQuery to Power BI, chained datasets e o impacto em RLS, governança e performance."
date: '2026-08-27 22:54:53'
---
Times de dados maduros enfrentam uma tensão recorrente: de um lado, a área central de BI quer um modelo semântico único, governado e certificado; de outro, cada área de negócio quer estender esse modelo com suas próprias tabelas e medidas sem esperar a fila do time central. Os **composite models** com DirectQuery to Power BI (hoje chamado de semantic model no Fabric) foram desenhados exatamente para essa fricção — mas usá-los sem entender as implicações de RLS, performance e governança costuma criar problemas silenciosos em produção.

**O que muda com DirectQuery to Power BI**

Até a chegada do recurso, quem publicava um dataset compartilhado (shared dataset) tinha duas opções ruins para estendê-lo: reconstruir todo o modelo do zero em cada relatório, duplicando lógica, ou viver com um Live Connection puro, no qual você não pode adicionar nenhuma tabela ou coluna local. O composite model quebra esse dilema. Ele permite que um relatório mantenha a conexão viva ao dataset corporativo — herdando medidas, relacionamentos e RLS — e, ao mesmo tempo, adicione novas fontes locais (Import ou outro DirectQuery) no mesmo modelo.

Na prática, isso habilita três padrões:

1. **Estender um modelo certificado** — a área de vendas conecta ao semantic model corporativo e adiciona uma tabela de metas em Import, criando medidas de atingimento que só fazem sentido para ela.
2. **Combinar dois modelos governados** — juntar o modelo financeiro e o modelo comercial num relatório executivo sem recriar nenhum dos dois.
3. **Chained datasets** — publicar esse modelo estendido como um novo dataset, que por sua vez pode ser consumido por outros. É poderoso e perigoso na mesma medida.

**RLS não é automático — e essa é a maior armadilha**

O ponto mais mal compreendido: a Row-Level Security do dataset de origem continua sendo aplicada sobre as tabelas daquele dataset, avaliada com a identidade de quem abre o relatório. Isso é ótimo — o modelo central mantém o controle. Mas as tabelas locais que você adicionou **não herdam** essa RLS. Se você adiciona uma tabela de metas em Import e a relaciona com a dimensão de vendedor do modelo central, a filtragem por RLS só se propaga na direção do relacionamento; onde ela não chega, o dado local fica exposto.

Além disso, o autor do composite model precisa ter, no mínimo, permissão de Build sobre o dataset de origem, e as credenciais usadas para propagar a identidade do usuário exigem Single Sign-On configurado corretamente. Em cenários com chained datasets, a cadeia de RLS pode ficar difícil de auditar — vale documentar explicitamente qual camada aplica qual filtro de segurança.

**Performance: cada visual pode virar várias consultas**

Como parte do modelo é DirectQuery ao dataset remoto, cada interação do usuário pode disparar consultas ao motor de origem. Um visual que cruza uma medida do modelo central com uma dimensão local mal modelada gera *fan-out* de queries e latência perceptível. Recomendações concretas:

* Prefira **relacionamentos em cardinalidade correta** (evite muitos-para-muitos desnecessários entre a tabela local e o modelo remoto).
* Mantenha em Import as tabelas pequenas e de baixa volatilidade (calendário, metas, mapeamentos), deixando o volume no dataset remoto.
* Cuidado com medidas que forçam materialização cruzada entre as duas fontes — teste com o Performance Analyzer e o DAX Studio antes de publicar.
* Evite empilhar chained datasets em mais de um ou dois níveis: cada elo adiciona latência e superfície de falha.

**Governança: liberdade com trilha de auditoria**

O risco organizacional do composite model é o de recriar o caos de planilhas em nova roupagem — dezenas de modelos estendidos, cada um com sua própria lógica de negócio divergindo do modelo certificado. Para evitar isso:

* Certifique (endorse) apenas o semantic model central e trate os modelos estendidos como *promoted*, não *certified*.
* Use o **CoE / lineage view** do Power BI para enxergar quem depende de qual dataset e quebrar cadeias inesperadas.
* Defina por política quais áreas podem publicar chained datasets e quais só podem consumir.
* No Microsoft Fabric, aproveite a integração com o OneLake e o Direct Lake para reduzir a necessidade de cópias, mas lembre-se de que Direct Lake e composite model têm restrições de coexistência que mudam a cada release — valide na documentação vigente.

**Quando usar e quando não usar**

Use composite models quando existir um modelo corporativo confiável e áreas que precisam estendê-lo de forma controlada, com autonomia sem duplicar a base. Não use como atalho para "colar" fontes desconexas sem modelagem — nesse caso, um modelo Import bem desenhado costuma ser mais simples e performático. E jamais trate chained datasets como solução permanente para suprir a lentidão do time central: isso resolve o sintoma e agrava a dívida de governança.

Estruturar essa camada semântica compartilhada — com RLS coerente, endossos corretos e monitoramento de linhagem — é onde a maturidade de dados realmente aparece. Se sua empresa está escalando o Power BI e quer transformar datasets soltos em um modelo corporativo governado, a Dynamic Soluções ajuda a desenhar essa arquitetura e a manter a governança viva com nossos planos de suporte contínuo.



Mature data teams keep running into the same tension: the central BI team wants a single, governed, certified semantic model, while each business area wants to extend that model with its own tables and measures without waiting in the central team's queue. **Composite models** with DirectQuery to Power BI (now called a semantic model in Fabric) were designed for exactly this friction — but using them without understanding the implications for RLS, performance, and governance tends to create silent problems in production.

**What changes with DirectQuery to Power BI**

Before this capability arrived, anyone publishing a shared dataset had two bad options to extend it: rebuild the entire model from scratch in every report, duplicating logic, or live with a pure Live Connection, where you can't add a single local table or column. The composite model breaks that dilemma. It lets a report keep a live connection to the corporate dataset — inheriting measures, relationships, and RLS — while also adding new local sources (Import or another DirectQuery) within the same model.

In practice, this enables three patterns:

1. **Extend a certified model** — the sales area connects to the corporate semantic model and adds a targets table in Import, creating attainment measures that only make sense for them.
2. **Combine two governed models** — merge the finance model and the commercial model into an executive report without recreating either.
3. **Chained datasets** — publish that extended model as a new dataset, which in turn can be consumed by others. This is as powerful as it is dangerous.

**RLS is not automatic — and that's the biggest trap**

The most misunderstood point: the Row-Level Security of the source dataset keeps being applied over that dataset's tables, evaluated with the identity of whoever opens the report. That's great — the central model keeps control. But the local tables you added **do not inherit** that RLS. If you add a targets table in Import and relate it to the central model's salesperson dimension, RLS filtering only propagates along the relationship direction; wherever it doesn't reach, the local data is exposed.

Besides that, the composite model author needs at least Build permission on the source dataset, and the credentials used to propagate the user's identity require Single Sign-On configured correctly. In chained-dataset scenarios, the RLS chain can become hard to audit — it's worth explicitly documenting which layer applies which security filter.

**Performance: each visual can turn into several queries**

Since part of the model is DirectQuery to the remote dataset, every user interaction can fire queries at the source engine. A visual that crosses a central-model measure with a poorly modeled local dimension generates query fan-out and noticeable latency. Concrete recommendations:

* Prefer **correct-cardinality relationships** (avoid unnecessary many-to-many between the local table and the remote model).
* Keep small, low-volatility tables in Import (calendar, targets, mappings), leaving the volume in the remote dataset.
* Watch out for measures that force cross-materialization between the two sources — test with Performance Analyzer and DAX Studio before publishing.
* Avoid stacking chained datasets more than one or two levels deep: each link adds latency and failure surface.

**Governance: freedom with an audit trail**

The organizational risk of composite models is recreating spreadsheet chaos in new clothing — dozens of extended models, each with its own business logic diverging from the certified model. To avoid this:

* Certify (endorse) only the central semantic model and treat extended models as *promoted*, not *certified*.
* Use Power BI's **CoE / lineage view** to see who depends on which dataset and to break unexpected chains.
* Define by policy which areas may publish chained datasets and which may only consume.
* In Microsoft Fabric, take advantage of OneLake and Direct Lake integration to reduce the need for copies, but remember that Direct Lake and composite models have coexistence restrictions that change with each release — validate against the current documentation.

**When to use and when not to use**

Use composite models when there's a trustworthy corporate model and areas that need to extend it in a controlled way, with autonomy but without duplicating the base. Don't use them as a shortcut to "glue" disconnected sources together without modeling — in that case, a well-designed Import model is usually simpler and faster. And never treat chained datasets as a permanent workaround for a slow central team: that fixes the symptom and worsens the governance debt.

Structuring this shared semantic layer — with coherent RLS, correct endorsements, and lineage monitoring — is where data maturity really shows. If your company is scaling Power BI and wants to turn loose datasets into a governed corporate model, Dynamic Soluções can help design that architecture and keep governance alive through our ongoing support plans.
