---
title: "Power BI: tooltips de pagina para drill contextual sem poluir"
description: "Report page tooltips transformam o hover em uma mini-dashboard de contexto. Veja como configurar, filtrar e evitar os erros que derrubam a performance."
date: '2026-10-11 17:59:26'
---
Quem constroi relatorios Power BI para usuarios exigentes conhece o dilema: o tomador de decisao quer densidade de informacao, mas uma pagina com vinte visuais vira um painel ilegivel. O instinto comum e empilhar cards, matrizes e botoes de drillthrough em uma mesma tela. Existe um recurso subutilizado que resolve boa parte disso sem poluir o layout: os **report page tooltips**, ou tooltips de pagina.

Em vez da tooltip default (que mostra apenas os valores do ponto de dado), voce desenha uma pagina inteira do relatorio e a vincula como tooltip de um visual. Quando o usuario passa o mouse sobre uma barra, uma fatia de pizza ou uma celula, o Power BI renderiza essa pagina filtrada pelo contexto daquele ponto. E uma mini-dashboard contextual que so aparece no hover e some quando o mouse sai.

**Como configurar na pratica**

O fluxo tem quatro passos que precisam estar todos corretos, ou a tooltip simplesmente nao aparece:

1. Crie uma pagina nova e, em Format > Page information, ative **Allow use as tooltip**.
2. Em Page size, escolha o tipo **Tooltip** (320x240 por padrao) ou defina um canvas custom pequeno. Paginas grandes demais ficam cortadas ou lentas.
3. Monte os visuais dessa pagina normalmente: um card, um grafico de tendencia, uma pequena matriz.
4. No visual de origem (a pagina principal), em Format > Tooltip, troque o tipo de **Default** para **Report page** e selecione a pagina criada.

O ponto que mais gera confusao e o **filtro de contexto**. A tooltip so recebe o contexto da coluna que esta no eixo ou na legenda do visual de origem automaticamente. Se a sua pagina de tooltip usa uma medida que depende de uma dimensao diferente, nada filtra e voce ve o total geral em todo hover. A solucao e adicionar, no Filters pane da pagina de tooltip, a coluna pela qual voce quer filtrar no bucket **Keep all filters** apropriado, ou garantir que o campo de categoria esteja no mesmo caminho de relacionamento.

**Tooltips condicionais por medida**

Um uso avancado pouco conhecido: voce pode definir, via Field > tooltip, qual pagina de tooltip aparece com base em uma medida que retorna o nome da pagina. Isso permite mostrar uma tooltip diferente para registros em alerta (ex.: margem negativa) versus registros normais, sem duplicar o visual. A medida precisa retornar exatamente o nome da pagina de tooltip como string; qualquer divergencia faz cair no comportamento default silenciosamente.

**Os erros que derrubam a performance**

Tooltips de pagina sao poderosas, mas cada hover dispara a renderizacao de uma pagina inteira. Em modelos DirectQuery ou com medidas DAX pesadas, isso significa uma query ao backend a cada passada de mouse. Alguns cuidados obrigatorios em producao:

* **Mantenha a tooltip enxuta.** Um ou dois visuais no maximo. Uma matriz com dezenas de linhas na tooltip e um convite a lentidao e, pior, so cabe uma fracao dela na tela.
* **Cuidado com medidas caras no hover.** DISTINCTCOUNT, time intelligence complexo e iteradores sobre tabelas grandes multiplicam o custo porque disparam a cada movimento do cursor. Em DirectQuery, considere pre-agregar.
* **Evite slicers e interatividade** dentro da pagina de tooltip; eles nao funcionam no hover e so adicionam peso.
* **Teste em touch devices.** Tooltips de hover nao existem em mobile por tap; se o relatorio e consumido em tablets, a informacao da tooltip nao pode ser critica, precisa haver um caminho alternativo (drillthrough, por exemplo).

**Tooltip de pagina vs drillthrough vs visual dedicado**

O criterio de decisao e o nivel de interacao esperado:

* **Report page tooltip** quando o usuario so precisa espiar contexto rapido sem clicar e sem sair da pagina. Leitura, nao navegacao.
* **Drillthrough** quando ele precisa investigar a fundo, filtrar, ordenar e permanecer no detalhe. Hover nao basta.
* **Visual dedicado na propria pagina** quando a informacao e importante o suficiente para estar sempre visivel, sem depender de interacao.

Tooltips de pagina sao, no fim, uma ferramenta de densidade sem poluicao: entregam a camada de contexto que o executivo quer sem transformar a tela principal em um amontoado de visuais.

Se a sua empresa precisa de relatorios Power BI que equilibrem profundidade analitica e performance em escala, a Dynamic Solucoes atua desde a modelagem do dataset ate o design de experiencia do relatorio, com planos de suporte continuo e consultoria especializada para o ecossistema Microsoft.



Anyone who builds Power BI reports for demanding users knows the dilemma: decision-makers want information density, but a page with twenty visuals becomes an unreadable dashboard. The common instinct is to stack cards, matrices, and drillthrough buttons on a single screen. There is an underused feature that solves much of this without cluttering the layout: **report page tooltips**.

Instead of the default tooltip (which only shows the values of the data point), you design an entire report page and bind it as the tooltip of a visual. When the user hovers over a bar, a pie slice, or a cell, Power BI renders that page filtered by the context of that point. It is a contextual mini-dashboard that appears only on hover and disappears when the mouse leaves.

**How to set it up in practice**

The flow has four steps that all need to be correct, or the tooltip simply will not appear:

1. Create a new page and, under Format > Page information, enable **Allow use as tooltip**.
2. Under Page size, choose the **Tooltip** type (320x240 by default) or define a small custom canvas. Pages that are too large get cut off or slow.
3. Build the visuals for that page normally: a card, a trend chart, a small matrix.
4. On the source visual (the main page), under Format > Tooltip, switch the type from **Default** to **Report page** and select the page you created.

The point that causes the most confusion is **context filtering**. The tooltip only automatically receives the context of the column that is on the axis or legend of the source visual. If your tooltip page uses a measure that depends on a different dimension, nothing filters and you see the grand total on every hover. The fix is to add, in the Filters pane of the tooltip page, the column you want to filter by in the appropriate **Keep all filters** bucket, or make sure the category field is on the same relationship path.

**Conditional tooltips by measure**

A little-known advanced use: you can define, via Field > tooltip, which tooltip page appears based on a measure that returns the page name. This lets you show a different tooltip for records in alert state (e.g., negative margin) versus normal records, without duplicating the visual. The measure must return exactly the tooltip page name as a string; any mismatch silently falls back to the default behavior.

**The mistakes that kill performance**

Page tooltips are powerful, but each hover triggers the rendering of an entire page. In DirectQuery models or with heavy DAX measures, that means a backend query on every mouse pass. Some mandatory precautions in production:

* **Keep the tooltip lean.** One or two visuals at most. A matrix with dozens of rows in the tooltip is an invitation to slowness and, worse, only a fraction of it fits on screen.
* **Watch out for expensive measures on hover.** DISTINCTCOUNT, complex time intelligence, and iterators over large tables multiply the cost because they fire on every cursor movement. In DirectQuery, consider pre-aggregating.
* **Avoid slicers and interactivity** inside the tooltip page; they do not work on hover and only add weight.
* **Test on touch devices.** Hover tooltips do not exist on mobile via tap; if the report is consumed on tablets, the tooltip information cannot be critical, there must be an alternate path (drillthrough, for example).

**Page tooltip vs drillthrough vs dedicated visual**

The decision criterion is the level of interaction expected:

* **Report page tooltip** when the user just needs a quick peek at context without clicking and without leaving the page. Reading, not navigation.
* **Drillthrough** when they need to dig deep, filter, sort, and stay in the detail. Hover is not enough.
* **Dedicated visual on the page itself** when the information is important enough to always be visible, without depending on interaction.

Page tooltips are, in the end, a tool for density without clutter: they deliver the layer of context the executive wants without turning the main screen into a pile of visuals.

If your company needs Power BI reports that balance analytical depth and performance at scale, Dynamic Solucoes works from dataset modeling all the way to report experience design, with continuous support plans and specialized consulting for the Microsoft ecosystem.
