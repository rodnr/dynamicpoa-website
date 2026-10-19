---
title: "Dataverse: solution layers e managed properties sem surpresas"
description: "Entenda como funcionam as camadas de solução no Dataverse, o risco de unmanaged layers sobre componentes gerenciados e como managed properties blindam seu ALM."
date: '2026-10-19 19:12:42'
---
Quem opera Power Platform em escala já viu o sintoma: um componente foi alterado direto em produção, o próximo deploy da solução gerenciada roda sem erro, mas a mudança do pipeline simplesmente não aparece. Nada quebrou, nada avisou — e horas depois alguém descobre que o ambiente está rodando uma versão que não corresponde ao que está no controle de origem. Na quase totalidade das vezes, a causa é a mesma: uma **unmanaged layer** sobreposta a um componente gerenciado. Entender o modelo de camadas do Dataverse é o que separa um ALM previsível de um ambiente que "às vezes aceita o deploy".

**Como o Dataverse resolve um componente em camadas**

Todo componente de solução (uma coluna, um form, um view, um flow, uma sitemap) no Dataverse é materializado em runtime pela sobreposição de camadas, da base para o topo. A regra de resolução é simples e implacável: **a camada mais ao topo vence para cada propriedade**. As camadas são, em ordem:

1. **System** — a camada base da plataforma, imutável.
2. **Managed solutions** — uma camada por solução gerenciada instalada, na ordem de instalação/dependência. Uma solução gerenciada instalada depois pode sobrepor propriedades de uma anterior.
3. **Unmanaged layer (Active)** — a camada de topo, única por componente. Qualquer edição feita direto no ambiente (via maker portal, importação de solução *unmanaged*, ou alteração manual) cai aqui.

O ponto crítico é esse: se existe uma unmanaged layer sobre um componente, ela **vence qualquer deploy futuro de solução gerenciada** para as propriedades que ela carrega. O deploy continua rodando com sucesso — a camada gerenciada é atualizada por baixo — mas o runtime continua lendo a unmanaged layer no topo. É exatamente o cenário do "deploy passou mas a mudança não apareceu".

**Por que isso acontece sem ninguém perceber**

A unmanaged layer é criada de forma silenciosa. Basta um maker com permissão abrir o componente gerenciado no ambiente de produção e salvar qualquer ajuste — reordenar um campo no form, trocar o label de uma view, mexer na largura de uma coluna — para que o Dataverse crie uma unmanaged layer sobre aquele componente. Dali em diante, aquelas propriedades estão congeladas em relação aos seus deploys gerenciados.

O Dataverse expõe isso na interface através da opção **Solution Layers** de cada componente, que mostra a pilha de camadas (managed e unmanaged) e qual propriedade cada uma define. Essa é a primeira ferramenta de diagnóstico quando um deploy "não pega": abra as camadas do componente e verifique se existe uma unmanaged layer no topo.

**Remover a unmanaged layer: Remove Active Customization**

A correção é remover a unmanaged layer para que o runtime volte a ler a camada gerenciada. No portal, isso é feito via **Remove Active Customization** na tela de Solution Layers do componente. Há nuances importantes:

* A remoção é por **componente**, não por propriedade — ela elimina a unmanaged layer inteira daquele componente e todas as suas alterações não gerenciadas voltam a ser governadas pela camada gerenciada.
* Para flows e alguns componentes a granularidade e o comportamento variam; sempre valide em um ambiente que não seja produção antes.
* Em escala, a varredura manual não escala. O ideal é inventariar unmanaged layers via **Web API** (consultando `msdyn_componentlayer` / as mensagens de solution layer) ou com scripts do **pac CLI**, e tratar isso como um passo de higiene antes de cada janela de deploy.

A lição operacional é direta: **produção não é ambiente de edição**. Nenhuma alteração deveria nascer fora do pipeline. Mas "pedir para o time não editar em produção" não é controle — é esperança. O controle real vem de bloquear a edição no nível da própria solução.

**Managed properties: blindar o componente na origem**

É aqui que entram as **managed properties**. Cada componente gerenciado carrega um conjunto de flags que definem o que pode ser customizado depois que a solução vira gerenciada no ambiente de destino. Elas são definidas no ambiente de **desenvolvimento**, enquanto a solução ainda é unmanaged, e viajam com o pacote gerenciado. As principais:

* **IsCustomizable** — se `false`, o componente não pode receber nenhuma unmanaged layer no destino. Isso efetivamente impede o maker de "salvar por cima" em produção — a origem do problema descrito acima deixa de existir.
* **CanBeDeleted** — impede que o componente seja removido no destino.
* Flags mais finas por tipo de componente (ex.: em uma coluna, se display name, requirement level ou opções de choice podem ser alterados; em uma entidade, se novas colunas/forms/views podem ser adicionados).

A decisão de design é um trade-off real: travar `IsCustomizable = false` garante fidelidade absoluta entre origem e destino, mas também impede qualquer customização legítima do cliente/time local sobre aquele componente. A recomendação prática:

* **Trave** o núcleo da sua solução — tabelas centrais, colunas de regra de negócio, chaves, flows críticos — que nunca devem divergir do controle de origem.
* **Deixe aberto** camadas de extensão pensadas para customização local (ex.: forms ou views que você espera que o time do cliente adapte), documentando que ali a divergência é esperada.

Um detalhe que pega muita gente: managed properties só têm efeito quando o componente é entregue como **gerenciado** no destino. Em ambiente de desenvolvimento, com a solução unmanaged, tudo é editável por natureza — por isso a disciplina de nunca desenvolver no mesmo ambiente onde se testa o comportamento gerenciado.

**Roteiro prático para um ALM sem surpresas**

1. **Dev/Test/UAT/Prod de verdade.** Desenvolva na solução unmanaged apenas em Dev; todos os demais ambientes recebem **apenas managed**.
2. **Defina managed properties no núcleo** antes do primeiro release. Trave `IsCustomizable` nos componentes que não devem divergir; deixe explícito o que é zona de extensão.
3. **Inclua uma verificação de unmanaged layers** no checklist pré-deploy, via Web API/pac CLI, e trate o Remove Active Customization como operação controlada, nunca improvisada.
4. **Bloqueie a criação de apps/flows diretamente em produção** por política de ambiente e segurança, reforçando o que as managed properties já garantem no nível do componente.
5. **Documente as zonas de extensão** para que o time local saiba onde pode customizar sem que isso vire dívida de camada invisível.

Camadas de solução e managed properties não são um detalhe esotérico do Dataverse — são o mecanismo que decide, em runtime, qual versão de cada componente o usuário final vê. Ignorá-las é conviver com deploys que "às vezes pegam". Dominá-las é ter um ALM onde o que está no controle de origem é, de fato, o que roda em produção.

Se a sua empresa opera soluções Power Platform críticas e quer estruturar um ALM governado — com ambientes, pipelines e managed properties desenhados para o seu cenário — os planos de suporte e a consultoria da Dynamic Soluções podem ajudar a tirar o ambiente do modo "editar em produção" e colocá-lo em um fluxo previsível e auditável.



Anyone running Power Platform at scale has seen the symptom: a component was changed directly in production, the next managed solution deploy from the pipeline runs without errors, but the pipeline's change simply doesn't show up. Nothing broke, nothing warned — and hours later someone discovers the environment is running a version that doesn't match what's in source control. Almost every time, the cause is the same: an **unmanaged layer** sitting on top of a managed component. Understanding the Dataverse layering model is what separates a predictable ALM from an environment that "sometimes accepts the deploy".

**How Dataverse resolves a component across layers**

Every solution component (a column, a form, a view, a flow, a sitemap) in Dataverse is materialized at runtime by stacking layers, from base to top. The resolution rule is simple and unforgiving: **the topmost layer wins for each property**. The layers, in order, are:

1. **System** — the platform's base, immutable layer.
2. **Managed solutions** — one layer per installed managed solution, in installation/dependency order. A solution installed later can override properties from an earlier one.
3. **Unmanaged layer (Active)** — the top layer, unique per component. Any edit made directly in the environment (via the maker portal, an *unmanaged* solution import, or a manual change) lands here.

Here's the critical point: if an unmanaged layer exists over a component, it **wins over any future managed solution deploy** for the properties it carries. The deploy still runs successfully — the managed layer underneath is updated — but runtime keeps reading the unmanaged layer on top. This is exactly the "deploy went through but the change didn't show up" scenario.

**Why this happens without anyone noticing**

The unmanaged layer is created silently. All it takes is a maker with permission opening the managed component in the production environment and saving any tweak — reordering a field on a form, changing a view's label, adjusting a column width — for Dataverse to create an unmanaged layer over that component. From then on, those properties are frozen relative to your managed deploys.

Dataverse exposes this in the UI through the **Solution Layers** option on each component, which shows the stack of layers (managed and unmanaged) and which property each one defines. This is the first diagnostic tool when a deploy "doesn't stick": open the component's layers and check whether an unmanaged layer sits on top.

**Removing the unmanaged layer: Remove Active Customization**

The fix is removing the unmanaged layer so runtime goes back to reading the managed layer. In the portal, this is done via **Remove Active Customization** on the component's Solution Layers screen. Important nuances:

* Removal is per **component**, not per property — it eliminates the entire unmanaged layer for that component, and all of its unmanaged changes go back to being governed by the managed layer.
* For flows and some components the granularity and behavior vary; always validate in a non-production environment first.
* At scale, manual sweeping doesn't scale. The ideal approach is to inventory unmanaged layers via the **Web API** (querying `msdyn_componentlayer` / the solution layer messages) or with **pac CLI** scripts, treating this as a hygiene step before each deploy window.

The operational lesson is blunt: **production is not an editing environment**. No change should originate outside the pipeline. But "asking the team not to edit in production" isn't control — it's hope. Real control comes from blocking editing at the solution level itself.

**Managed properties: locking the component at the source**

This is where **managed properties** come in. Every managed component carries a set of flags defining what can be customized after the solution becomes managed in the target environment. They are set in the **development** environment, while the solution is still unmanaged, and travel with the managed package. The main ones:

* **IsCustomizable** — if `false`, the component can't receive any unmanaged layer in the target. This effectively prevents makers from "saving over" in production — the root cause described above ceases to exist.
* **CanBeDeleted** — prevents the component from being removed in the target.
* Finer-grained flags per component type (e.g., on a column, whether display name, requirement level, or choice options can be changed; on a table, whether new columns/forms/views can be added).

The design decision is a real trade-off: locking `IsCustomizable = false` guarantees absolute fidelity between source and target, but it also prevents any legitimate customization by the client/local team over that component. The practical recommendation:

* **Lock** your solution's core — central tables, business-rule columns, keys, critical flows — which should never diverge from source control.
* **Leave open** extension layers meant for local customization (e.g., forms or views you expect the client's team to adapt), documenting that divergence there is expected.

One detail that catches many people: managed properties only take effect when the component is delivered as **managed** in the target. In the development environment, with the unmanaged solution, everything is editable by nature — which is why the discipline of never developing in the same environment where you test managed behavior matters.

**A practical roadmap for surprise-free ALM**

1. **Real Dev/Test/UAT/Prod.** Develop in the unmanaged solution only in Dev; all other environments receive **managed only**.
2. **Set managed properties on the core** before the first release. Lock `IsCustomizable` on components that must not diverge; make the extension zone explicit.
3. **Include an unmanaged-layer check** in the pre-deploy checklist, via Web API/pac CLI, and treat Remove Active Customization as a controlled operation, never improvised.
4. **Block creating apps/flows directly in production** through environment and security policy, reinforcing what managed properties already guarantee at the component level.
5. **Document the extension zones** so the local team knows where it can customize without it turning into invisible layer debt.

Solution layers and managed properties aren't an esoteric Dataverse detail — they are the mechanism that decides, at runtime, which version of each component the end user sees. Ignoring them means living with deploys that "sometimes stick". Mastering them means having an ALM where what's in source control is, in fact, what runs in production.

If your company runs critical Power Platform solutions and wants to structure a governed ALM — with environments, pipelines, and managed properties designed for your scenario — Dynamic Soluções' support plans and consulting can help move your environment out of "edit in production" mode and into a predictable, auditable flow.
