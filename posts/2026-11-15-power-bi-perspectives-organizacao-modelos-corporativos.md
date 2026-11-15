---
title: "Power BI: perspectives e organizar modelos corporativos grandes"
description: "Modelos semânticos corporativos crescem e viram labirinto. Veja como usar perspectives, display folders e pastas de medidas para organizar sem quebrar nada."
date: '2026-11-15 19:19:05'
---
Um modelo semântico que começa enxuto com 10 tabelas e 20 medidas raramente termina assim. Depois de alguns meses atendendo áreas diferentes, ele vira um objeto corporativo com dezenas de tabelas, centenas de medidas e colunas que ninguém lembra para que servem. O autor consegue navegar porque escreveu tudo, mas quem conecta via Analyze in Excel, cria relatórios paginados ou monta visuais ad hoc enfrenta uma lista infinita e confusa de campos. Perspectives, display folders e disciplina de organização resolvem isso sem precisar fragmentar o modelo em vários datasets.

**O que são perspectives e o que elas não são**

Uma perspective é uma visão nomeada de um subconjunto do modelo: você escolhe quais tabelas, colunas, hierarquias e medidas aparecem naquela perspective, e o resto fica oculto para quem a usa. Pense nela como um "filtro de metadados" sobre o modelo completo — o engine, os relacionamentos e o cálculo continuam idênticos, muda só o que o consumidor enxerga no painel de campos.

O ponto crítico que confunde muita gente: **perspective não é camada de segurança**. Ela não impede ninguém de acessar dado nenhum. Um usuário que conhece o nome de uma medida escondida numa perspective ainda pode referenciá-la por DAX, e ferramentas como DAX Studio ignoram perspectives completamente. Controle de acesso continua sendo RLS/OLS (object-level security). Perspective é usabilidade e organização, não controle.

Outra limitação importante: no Power BI, perspectives ainda têm suporte parcial no Desktop. Você as cria via Tabular Editor (ou XMLA), e elas funcionam bem no cenário de personalized visuals e ao conectar via Excel/ferramentas externas — mas a experiência de alternar perspectives dentro do próprio relatório Power BI é restrita. Trate perspectives como recurso para quem consome o modelo por fora, não como abas visuais do relatório.

**Display folders: o ganho imediato e subestimado**

Antes de perspectives, o recurso que mais organiza um modelo grande e que quase todo mundo deixa de lado são os display folders. Cada medida e coluna tem uma propriedade Display Folder que agrupa os campos em pastas (e subpastas, usando `\` como separador) dentro da tabela no painel de campos.

Na prática, você passa de uma lista plana de 150 medidas para algo como:

* `Vendas\Receita` — Receita Bruta, Receita Líquida, Receita YTD
* `Vendas\Variações` — YoY, MoM, Crescimento %
* `Operacional\Estoque` — Giro, Cobertura, Ruptura

Isso é puro metadado, não custa performance nenhuma e muda radicalmente a experiência de quem monta visual. Em Tabular Editor você aplica display folder em dezenas de medidas de uma vez com um script C#, o que torna a adoção barata mesmo em modelo legado.

**O padrão da tabela de medidas dedicada**

Um antipadrão comum em modelos grandes é espalhar medidas pelas tabelas de fato conforme foram criadas. Com o tempo ninguém sabe se `Margem %` está na fato de vendas ou na de custos. A convenção que escala é criar uma ou mais tabelas vazias só para abrigar medidas (uma tabela sem colunas de dado, só com o ícone de medidas), agrupando por domínio de negócio: `_Medidas Vendas`, `_Medidas Financeiro`, `_Medidas Operacional`.

Combine isso com display folders dentro de cada tabela de medidas e você tem uma navegação previsível: o consumidor sabe onde procurar sem conhecer a modelagem física por trás. O prefixo com underscore também empurra essas tabelas para o topo da ordenação.

**Quando organizar vs quando dividir o modelo**

A tentação, quando o modelo incha, é partir em vários datasets menores. Isso resolve usabilidade mas cria um custo alto: duplicação de dimensões, divergência de definições de medida (a `Receita Líquida` de um dataset não bate com a do outro) e perda da fonte única de verdade. O roteiro de decisão é:

1. **Organize primeiro.** Display folders + tabela de medidas dedicada + nomes padronizados resolvem a maioria das queixas de "modelo confuso" sem tocar na arquitetura.
2. **Use perspectives** quando áreas distintas consomem o mesmo modelo certificado via Excel/ferramentas externas e cada uma precisa ver só o seu recorte.
3. **Considere OLS** quando além de esconder você precisa de fato impedir acesso a uma coluna/tabela sensível — lembrando que OLS exige cuidado para não quebrar medidas que referenciam o objeto protegido.
4. **Só então divida o modelo** — e se dividir, prefira composite models com DirectQuery para o modelo certificado, mantendo as definições centrais em vez de copiá-las.

**Governança para não perder o ganho**

Organização em modelo corporativo só se sustenta com disciplina de ALM. Toda medida nova deve nascer já com display folder preenchido e nome padronizado; isso deve fazer parte do code review. Tabular Editor com best practice analyzer ajuda a flaguear medidas sem display folder, colunas visíveis que deveriam estar ocultas (chaves técnicas, colunas de sort) e medidas sem format string. Rodar essas regras no pipeline antes do deploy evita que o modelo volte ao caos a cada entrega.

Modelo semântico grande não é um problema a ser evitado — é o resultado natural de uma fonte única de verdade bem adotada. O problema real é a falta de organização. Na Dynamic Soluções ajudamos times de dados a estruturar modelos corporativos governáveis, com padronização, perspectives e esteira de ALM que mantêm o modelo navegável à medida que ele cresce.



A semantic model that starts lean with 10 tables and 20 measures rarely stays that way. After a few months serving different business areas, it becomes a corporate object with dozens of tables, hundreds of measures and columns nobody remembers the purpose of. The author can navigate it because they wrote everything, but anyone connecting via Analyze in Excel, building paginated reports or assembling ad hoc visuals faces an endless, confusing field list. Perspectives, display folders and some organizational discipline solve this without having to fragment the model into several datasets.

**What perspectives are and what they are not**

A perspective is a named view of a subset of the model: you pick which tables, columns, hierarchies and measures show up in that perspective, and the rest stays hidden from whoever uses it. Think of it as a "metadata filter" over the full model — the engine, the relationships and the calculations remain identical, only what the consumer sees in the field pane changes.

The critical point that trips a lot of people up: **a perspective is not a security layer**. It does not stop anyone from accessing any data. A user who knows the name of a measure hidden in a perspective can still reference it via DAX, and tools like DAX Studio ignore perspectives entirely. Access control is still RLS/OLS (object-level security). A perspective is about usability and organization, not control.

Another important limitation: in Power BI, perspectives still have only partial support in Desktop. You create them via Tabular Editor (or XMLA), and they work well in the personalized visuals scenario and when connecting via Excel/external tools — but the experience of switching perspectives inside the Power BI report itself is restricted. Treat perspectives as a feature for those consuming the model externally, not as visual tabs within the report.

**Display folders: the immediate, underrated win**

Before perspectives, the feature that organizes a large model the most and that almost everyone overlooks is display folders. Each measure and column has a Display Folder property that groups fields into folders (and subfolders, using `\` as the separator) within the table in the field pane.

In practice, you go from a flat list of 150 measures to something like:

* `Sales\Revenue` — Gross Revenue, Net Revenue, Revenue YTD
* `Sales\Variations` — YoY, MoM, Growth %
* `Operations\Inventory` — Turnover, Coverage, Stockout

This is pure metadata, costs zero performance and radically changes the experience of whoever builds visuals. In Tabular Editor you apply display folders to dozens of measures at once with a C# script, which makes adoption cheap even in a legacy model.

**The dedicated measures table pattern**

A common antipattern in large models is scattering measures across the fact tables as they were created. Over time no one knows whether `Margin %` lives in the sales fact or the costs fact. The convention that scales is creating one or more empty tables just to hold measures (a table with no data columns, only the measures icon), grouping by business domain: `_Sales Measures`, `_Finance Measures`, `_Operations Measures`.

Combine that with display folders inside each measures table and you get predictable navigation: the consumer knows where to look without understanding the physical model behind it. The underscore prefix also pushes those tables to the top of the ordering.

**When to organize vs when to split the model**

The temptation, when the model swells, is to split it into several smaller datasets. That solves usability but creates a high cost: duplicated dimensions, divergent measure definitions (the `Net Revenue` in one dataset doesn't match the other) and loss of the single source of truth. The decision roadmap is:

1. **Organize first.** Display folders + a dedicated measures table + standardized names solve most "confusing model" complaints without touching the architecture.
2. **Use perspectives** when distinct areas consume the same certified model via Excel/external tools and each one needs to see only its own slice.
3. **Consider OLS** when, beyond hiding, you actually need to prevent access to a sensitive column/table — remembering that OLS requires care so it doesn't break measures referencing the protected object.
4. **Only then split the model** — and if you do, prefer composite models with DirectQuery to the certified model, keeping the central definitions instead of copying them.

**Governance so you don't lose the win**

Organization in a corporate model only holds up with ALM discipline. Every new measure should be born with its display folder filled in and a standardized name; this should be part of code review. Tabular Editor with the Best Practice Analyzer helps flag measures without a display folder, visible columns that should be hidden (technical keys, sort columns) and measures without a format string. Running these rules in the pipeline before deploy keeps the model from sliding back into chaos with every release.

A large semantic model is not a problem to avoid — it is the natural result of a well-adopted single source of truth. The real problem is the lack of organization. At Dynamic Soluções we help data teams structure governable corporate models, with standardization, perspectives and an ALM pipeline that keep the model navigable as it grows.
