---
title: "Dataverse plugins vs Power Automate: onde colocar a lógica de negócio"
description: "Plugin registrado no Dataverse ou fluxo do Power Automate? Comparamos latência, transação, sincronismo e governança para decidir onde vive cada regra crítica."
date: '2026-08-19 13:50:07'
---
Toda equipe que opera Dataverse em escala esbarra na mesma pergunta de arquitetura: quando uma regra de negócio deve ser um **plugin registrado no Dataverse**, quando deve ser um **fluxo do Power Automate** e quando basta uma **business rule** ou uma **classic workflow**? A resposta errada aparece meses depois, na forma de registros salvos pela metade, latência que o usuário sente ou lógica que roda fora da transação e não pode ser desfeita. Este post é um guia de decisão para quem já passou do estágio de "funciona no meu ambiente".

**O event framework do Dataverse é o ponto de partida**

Plugins não são "código solto": eles se registram em estágios específicos do pipeline de execução do Dataverse, e entender esses estágios é o que separa uma decisão sólida de uma aposta.

* **Pre-validation (estágio 10)** — roda antes da transação de banco, inclusive antes das validações de segurança em alguns casos. Bom para bloquear operações cedo e barato, mas cuidado: nem sempre está dentro da transação principal.
* **Pre-operation (estágio 20)** — dentro da transação, antes do commit. É onde você altera valores do próprio registro antes de ele ser gravado (setar um campo derivado, normalizar dados) sem precisar de um segundo Update.
* **Post-operation (estágio 40)** — dentro da transação, após o commit lógico. É onde você cria registros relacionados, dispara integrações e aplica efeitos colaterais. Se você lançar exceção aqui, o rollback desfaz tudo — inclusive o registro original.

A execução pode ser **síncrona** (o usuário espera, tudo na mesma transação, rollback automático em caso de erro) ou **assíncrona** (enfileirada no System Job, não bloqueia o usuário, mas não participa da transação do registro original).

**Plugin síncrono: para o que precisa ser atômico e imediato**

Use plugin síncrono quando a regra precisa de duas garantias ao mesmo tempo: acontecer **antes de o usuário ver o resultado** e estar **dentro da transação** para que uma falha desfaça a operação inteira. Exemplos:

* Validação complexa que depende de múltiplas tabelas e não cabe numa business rule (ex.: impedir aprovação de um pedido se o limite de crédito consolidado do grupo econômico for excedido).
* Cálculo de campo derivado que precisa estar correto no exato momento em que o registro é salvo, sem depender de um job de rollup posterior.
* Enforcement de integridade que precisa valer para *toda* origem — model-driven app, API, importação de dados, fluxo — porque o plugin roda no nível da plataforma, não da interface.

O custo é latência: tudo que roda no plugin síncrono soma no tempo de resposta do salvamento. Há limite prático de **2 minutos** por transação de plugin síncrono antes de timeout, e o corpo do código roda em sandbox isolado, sem acesso a arquivos ou rede fora de endpoints permitidos.

**Power Automate: para orquestração, integração e o que pode esperar**

O fluxo do Power Automate brilha quando a lógica é **assíncrona por natureza** e envolve orquestração entre sistemas ou pessoas. Sinais de que a regra deve ser um fluxo, não um plugin:

* Envolve espera humana (aprovações), delays, ou agendamento.
* Integra com serviços externos via conectores prontos (SharePoint, Teams, Outlook, APIs de terceiros) sem que você precise escrever e manter chamadas HTTP em C#.
* É mantida por quem não é desenvolvedor pro-code, e precisa ser legível e ajustável sem deploy de assembly.
* Não precisa participar da transação do registro — se falhar, você trata com retry e notificação, não com rollback do dado original.

O trade-off é que o fluxo roda **fora da transação** e de forma **eventualmente consistente**: entre o Create do registro e o disparo do gatilho "When a row is added" há uma latência que pode ir de segundos a mais, dependendo de throttling e carga. Nunca dependa de um fluxo para garantir invariantes que precisam valer no instante do commit.

**E as business rules e classic workflows?**

Antes de escrever qualquer código, esgote as opções declarativas:

* **Business rules** — validações e cálculos simples aplicados na interface e (em parte) no servidor. Ótimas para "campo X obrigatório quando Y", mostrar/ocultar campos, valores default. Limitação: não cobrem lógica cross-table complexa e nem toda regra roda em operações via API.
* **Classic (background) workflows** — ainda úteis para automações assíncronas simples ligadas a eventos de tabela, mas a Microsoft direciona novos cenários para Power Automate. Evite iniciar projetos novos apoiados neles.

**Um roteiro de decisão prático**

1. A regra é uma validação/cálculo simples de campo? → **Business rule**.
2. Precisa ser atômica, imediata e valer para toda origem (API, import, UI)? → **Plugin síncrono** (pre-operation para alterar o próprio registro, post-operation para efeitos colaterais).
3. Pode acontecer logo depois, envolve integração com conectores ou espera humana? → **Power Automate**.
4. É processamento pesado, em lote ou de longa duração disparado por evento de dados? → **Plugin assíncrono** ou fluxo, conforme quem vai manter e o que precisa integrar.

Um erro comum é resolver tudo com Power Automate porque é low-code — e descobrir tarde que uma regra crítica de integridade não rodava quando o dado entrava via importação em massa, porque ninguém garantiu que o gatilho cobria aquela origem. Outro erro é escrever plugin para orquestração de aprovação, prendendo lógica de processo em assembly que exige um desenvolvedor e um deploy para cada ajuste de negócio.

**Governança e ALM não são detalhe**

Seja plugin ou fluxo, a lógica deve viver dentro de uma **solução gerenciada** e passar pelo pipeline Dev/Test/Prod. Plugins exigem step registrations versionados e cuidado com ordem de execução (rank) quando há múltiplos plugins na mesma mensagem. Fluxos exigem connection references e environment variables para não vazar credenciais entre ambientes. Misturar as duas abordagens sem uma convenção clara de "onde cada tipo de regra vive" é o que transforma um Dataverse maduro em uma caixa-preta que ninguém consegue mais depurar.

Estruturar essa camada de lógica de negócio — decidir o que é plugin, o que é fluxo, o que é declarativo — é uma das decisões de arquitetura que mais impactam a manutenibilidade de uma solução Power Platform em escala. Se sua empresa está nesse ponto de maturidade e quer revisar a arquitetura antes que o débito técnico cresça, a consultoria e os planos de suporte da Dynamic Soluções ajudam a colocar essa camada em ordem, com ALM e governança de verdade.



Every team running Dataverse at scale hits the same architecture question: when should a business rule be a **plugin registered in Dataverse**, when should it be a **Power Automate flow**, and when is a **business rule** or a **classic workflow** enough? The wrong answer shows up months later as half-saved records, latency the user actually feels, or logic that runs outside the transaction and can't be rolled back. This post is a decision guide for those already past the "works on my environment" stage.

**The Dataverse event framework is the starting point**

Plugins aren't "loose code": they register at specific stages of the Dataverse execution pipeline, and understanding those stages is what separates a solid decision from a gamble.

* **Pre-validation (stage 10)** — runs before the database transaction, and in some cases even before security checks. Good for blocking operations early and cheaply, but be careful: it isn't always inside the main transaction.
* **Pre-operation (stage 20)** — inside the transaction, before commit. This is where you change values on the record itself before it's written (set a derived field, normalize data) without needing a second Update.
* **Post-operation (stage 40)** — inside the transaction, after the logical commit. This is where you create related records, trigger integrations and apply side effects. If you throw an exception here, the rollback undoes everything — including the original record.

Execution can be **synchronous** (the user waits, everything in the same transaction, automatic rollback on error) or **asynchronous** (queued as a System Job, doesn't block the user, but doesn't take part in the original record's transaction).

**Synchronous plugin: for what must be atomic and immediate**

Use a synchronous plugin when the rule needs two guarantees at once: happening **before the user sees the result** and being **inside the transaction** so a failure undoes the whole operation. Examples:

* Complex validation that spans multiple tables and doesn't fit in a business rule (e.g., blocking approval of an order if the consolidated credit limit of the economic group is exceeded).
* Derived field calculation that must be correct at the exact moment the record is saved, without relying on a later rollup job.
* Integrity enforcement that must apply to *every* origin — model-driven app, API, data import, flow — because the plugin runs at the platform level, not the UI level.

The cost is latency: everything running in a synchronous plugin adds to the save response time. There's a practical **2-minute** limit per synchronous plugin transaction before timeout, and the code runs in an isolated sandbox, with no file or network access beyond allowed endpoints.

**Power Automate: for orchestration, integration and what can wait**

A Power Automate flow shines when the logic is **asynchronous by nature** and involves orchestration across systems or people. Signs the rule should be a flow, not a plugin:

* It involves human waiting (approvals), delays, or scheduling.
* It integrates with external services through ready-made connectors (SharePoint, Teams, Outlook, third-party APIs) without you writing and maintaining HTTP calls in C#.
* It's maintained by someone who isn't a pro-code developer and needs to be readable and adjustable without deploying an assembly.
* It doesn't need to take part in the record's transaction — if it fails, you handle it with retry and notification, not with a rollback of the original data.

The trade-off is that the flow runs **outside the transaction** and is **eventually consistent**: between the record Create and the "When a row is added" trigger firing there's a latency that can range from seconds to more, depending on throttling and load. Never rely on a flow to enforce invariants that must hold at the instant of commit.

**What about business rules and classic workflows?**

Before writing any code, exhaust the declarative options:

* **Business rules** — simple validations and calculations applied in the UI and (partly) on the server. Great for "field X required when Y", show/hide fields, default values. Limitation: they don't cover complex cross-table logic and not every rule runs on API operations.
* **Classic (background) workflows** — still useful for simple asynchronous automations tied to table events, but Microsoft steers new scenarios toward Power Automate. Avoid starting new projects built on them.

**A practical decision guide**

1. Is the rule a simple field validation/calculation? → **Business rule**.
2. Must it be atomic, immediate and apply to every origin (API, import, UI)? → **Synchronous plugin** (pre-operation to change the record itself, post-operation for side effects).
3. Can it happen shortly after, involving connector integration or human waiting? → **Power Automate**.
4. Is it heavy, batch or long-running processing triggered by a data event? → **Asynchronous plugin** or flow, depending on who maintains it and what it needs to integrate with.

A common mistake is solving everything with Power Automate because it's low-code — and discovering late that a critical integrity rule didn't run when data came in via bulk import, because nobody made sure the trigger covered that origin. Another mistake is writing a plugin for approval orchestration, locking process logic into an assembly that requires a developer and a deploy for every business tweak.

**Governance and ALM aren't a detail**

Whether plugin or flow, the logic must live inside a **managed solution** and go through the Dev/Test/Prod pipeline. Plugins require versioned step registrations and care with execution order (rank) when multiple plugins share the same message. Flows require connection references and environment variables so credentials don't leak between environments. Mixing both approaches without a clear convention of "where each type of rule lives" is what turns a mature Dataverse into a black box no one can debug anymore.

Structuring this business logic layer — deciding what's a plugin, what's a flow, what's declarative — is one of the architecture decisions that most affects the maintainability of a Power Platform solution at scale. If your company is at this maturity point and wants to review the architecture before technical debt grows, Dynamic Soluções' consulting and support plans help put this layer in order, with real ALM and governance.
