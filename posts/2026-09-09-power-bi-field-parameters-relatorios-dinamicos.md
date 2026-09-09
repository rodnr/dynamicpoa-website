---
title: "Power BI: field parameters para relatorios dinamicos e enxutos"
description: "Explore como os field parameters do Power BI reduzem a proliferacao de visuais, deixam o usuario trocar metricas e dimensoes em runtime e onde eles quebram na pratica."
date: '2026-09-09 17:07:06'
---
Um sintoma clássico de relatório Power BI mal projetado é a página com oito gráficos quase idênticos — um por métrica, um por dimensão — que o usuário rola sem parar. Os **field parameters** resolvem boa parte disso, permitindo que quem consome o relatório troque a métrica ou a dimensão exibida em um visual em runtime, sem que você duplique páginas ou visuais. Mas eles têm regras próprias que, ignoradas, geram relatórios lentos e cheios de armadilhas.

**O que field parameters realmente são**

Ao criar um field parameter (Modeling > New parameter > Fields), o Power BI gera uma tabela calculada de valores que referenciam colunas ou medidas do modelo, usando a função `NAMEOF`. A tabela tem, por padrão, três colunas: o nome exibido, a referência ao campo (armazenada como texto no campo interno) e um índice de ordenação. Ao arrastar essa tabela para um slicer, o usuário escolhe quais campos alimentam o visual conectado.

O ponto-chave é que field parameters funcionam tanto para **dimensões** (colunas de eixo, `Categoria`, `Região`, `Produto`) quanto para **medidas** (`Receita`, `Margem`, `Ticket médio`). Você pode ter um parâmetro de "qual métrica ver" e outro de "quebrar por qual dimensão" no mesmo gráfico — reduzindo dezenas de visuais a um só.

**Onde eles brilham**

* **Consolidar páginas repetidas.** Em vez de uma página por indicador, uma página com slicer de métrica. Menos manutenção, menos inconsistência de formatação.
* **Autoatendimento controlado.** O usuário monta a análise que quer dentro dos campos que você aprovou — diferente de dar acesso irrestrito ao Explore ou de expor o modelo inteiro.
* **Reduzir superfície de erro em DAX.** Sem parâmetro, muita gente resolve "métrica dinâmica" com uma medida gigante cheia de `SWITCH(SELECTEDVALUE(...))`. O field parameter tira essa lógica da medida e coloca no modelo, de forma declarativa.

**As armadilhas que aparecem em produção**

1. **Formatação por métrica não é automática.** Se um parâmetro alterna entre `Receita` (moeda) e `Margem %` (percentual), o eixo e os data labels não trocam o formato sozinhos. Você precisa medidas com formatação dinâmica (format strings dinâmicas por medida) ou aceitar um formato único. É o problema mais reportado.
* **Interações com outros visuais.** Um field parameter de dimensão muda o eixo do gráfico, mas não muda automaticamente o comportamento de cross-filter com outros visuais da página que esperam uma coluna fixa. Vale desenhar a página assumindo que o eixo é variável.
* **Ordenação e agrupamentos.** Quando o parâmetro troca a dimensão, a ordenação por outra coluna (sort by column) some, porque a coluna de sort não existe para todas as opções. Frequentemente o resultado sai em ordem alfabética indesejada.
* **Filtros de página presos a um campo.** Se você filtrou a página por `Produto` e o usuário troca o eixo para `Região`, o filtro continua ativo — o que pode confundir. Documente ou use bookmarks para limpar contexto.
* **Impacto em performance.** Cada opção do parâmetro é uma coluna/medida real do modelo, então trocar não é gratuito: um parâmetro que oferece uma medida DirectQuery pesada vai carregar essa medida quando selecionada. O parâmetro não otimiza a medida; ele só a expõe.

**Boas práticas de modelagem**

* Nomeie os valores exibidos para o negócio, não para a TI: "Faturamento líquido", não `fMedida_ReceitaLiq`.
* Controle a ordem com a coluna de índice — não confie na ordem em que você adicionou os campos.
* Para métricas com formatos diferentes, padronize com **dynamic format strings** por medida em vez de um formato genérico no visual.
* Não misture métricas e dimensões no mesmo parâmetro; crie um parâmetro para cada papel (o que medir vs. como quebrar).
* Em modelos compostos ou datasets compartilhados, lembre que o parâmetro vira parte do modelo — trate-o com o mesmo cuidado de ALM (endorsement, versionamento) das outras tabelas.

**Quando não usar**

Se o público precisa comparar duas métricas **lado a lado** o tempo todo, field parameter não é a resposta — ele mostra uma opção por vez. Se cada métrica tem um layout muito específico (eixo secundário, meta, formatação distinta), páginas dedicadas ou bookmarks entregam melhor experiência. E se o objetivo é liberdade total de exploração, o recurso de personalização de visuais (Personalize visuals) ou o próprio modo Explore podem ser mais adequados.

Field parameters são uma daquelas features de baixo custo e alto impacto na governança de relatórios: menos páginas, menos duplicação, autoatendimento dentro de trilhos. Mas a decisão entre parâmetro, bookmark, personalização de visual e página dedicada é de arquitetura, e é aí que a experiência conta. Se sua empresa está reestruturando o portfólio de relatórios Power BI e quer reduzir manutenção sem perder controle de formatação e performance, a Dynamic Soluções ajuda a desenhar esse padrão com modelagem, ALM e governança do começo ao fim.



A classic symptom of a poorly designed Power BI report is a page with eight nearly identical charts — one per metric, one per dimension — that users endlessly scroll through. **Field parameters** solve much of this by letting report consumers switch the metric or dimension shown in a visual at runtime, without you duplicating pages or visuals. But they come with their own rules that, when ignored, produce slow reports full of traps.

**What field parameters really are**

When you create a field parameter (Modeling > New parameter > Fields), Power BI generates a calculated table of values that reference columns or measures in the model using the `NAMEOF` function. The table has, by default, three columns: the display name, the field reference (stored as text in the internal field), and a sort index. When you drag this table into a slicer, the user picks which fields feed the connected visual.

The key point is that field parameters work for both **dimensions** (axis columns like `Category`, `Region`, `Product`) and **measures** (`Revenue`, `Margin`, `Average ticket`). You can have one parameter for "which metric to see" and another for "break down by which dimension" in the same chart — collapsing dozens of visuals into one.

**Where they shine**

* **Consolidating repeated pages.** Instead of one page per indicator, one page with a metric slicer. Less maintenance, less formatting inconsistency.
* **Controlled self-service.** The user builds the analysis they want within the fields you approved — unlike granting unrestricted Explore access or exposing the whole model.
* **Reducing DAX error surface.** Without parameters, many people solve "dynamic metric" with a giant measure full of `SWITCH(SELECTEDVALUE(...))`. The field parameter pulls that logic out of the measure and into the model, declaratively.

**The traps that show up in production**

1. **Per-metric formatting is not automatic.** If a parameter switches between `Revenue` (currency) and `Margin %` (percentage), the axis and data labels won't change format on their own. You need measures with dynamic format strings per measure, or accept a single format. This is the most reported issue.
* **Interactions with other visuals.** A dimension field parameter changes the chart axis but doesn't automatically change cross-filter behavior with other visuals on the page that expect a fixed column. Design the page assuming the axis is variable.
* **Sorting and grouping.** When the parameter swaps the dimension, sorting by another column (sort by column) disappears, because the sort column doesn't exist for every option. The result often comes out in unwanted alphabetical order.
* **Page filters stuck to a field.** If you filtered the page by `Product` and the user switches the axis to `Region`, the filter stays active — which can confuse. Document it or use bookmarks to clear context.
* **Performance impact.** Each parameter option is a real column/measure in the model, so switching isn't free: a parameter offering a heavy DirectQuery measure will load that measure when selected. The parameter doesn't optimize the measure; it merely exposes it.

**Modeling best practices**

* Name the display values for the business, not for IT: "Net revenue," not `fMeasure_NetRev`.
* Control order with the index column — don't rely on the order you added fields.
* For metrics with different formats, standardize with **dynamic format strings** per measure instead of a generic format on the visual.
* Don't mix metrics and dimensions in the same parameter; create one parameter per role (what to measure vs. how to break it down).
* In composite models or shared datasets, remember the parameter becomes part of the model — treat it with the same ALM care (endorsement, versioning) as the other tables.

**When not to use them**

If your audience needs to compare two metrics **side by side** all the time, a field parameter isn't the answer — it shows one option at a time. If each metric has a very specific layout (secondary axis, target, distinct formatting), dedicated pages or bookmarks deliver a better experience. And if the goal is total exploration freedom, the Personalize visuals feature or Explore mode itself may fit better.

Field parameters are one of those low-cost, high-impact features for report governance: fewer pages, less duplication, self-service on rails. But the decision between parameter, bookmark, visual personalization, and dedicated page is architectural, and that's where experience matters. If your company is restructuring its Power BI report portfolio and wants to cut maintenance without losing control of formatting and performance, Dynamic Soluções helps design that pattern with modeling, ALM, and governance end to end.
