---
title: "Dataverse: business rules vs client scripting em model-driven"
description: "Entenda quando a logica de formulario em model-driven apps deve ser uma business rule no-code e quando exige JavaScript, com limites de escopo, execucao e manutencao."
date: '2026-10-23 17:49:53'
---
Em formularios de model-driven apps existe uma camada de logica que roda no cliente, antes de qualquer plugin ou fluxo entrar em cena: a validacao e o comportamento da interface. A Microsoft oferece dois caminhos para isso — **business rules** (no-code, declarativas) e **client scripting** em JavaScript (Client API). A escolha errada entre eles gera ou regras impossiveis de evoluir ou uma base de scripts fragil que ninguem quer tocar. Este post delimita onde cada abordagem ganha.

**O que business rules realmente fazem (e onde param)**

Uma business rule e uma regra declarativa configurada no designer, composta de condicoes e acoes. Ela pode: mostrar/ocultar campos, tornar campos obrigatorios ou opcionais, habilitar/desabilitar campos, definir valores de campo, validar com mensagem de erro e aplicar recomendacoes. O ponto forte e o escopo de execucao: uma business rule pode rodar no formulario (cliente) **ou na entidade inteira**, incluindo server-side. Quando configurada com escopo Entity, a regra e aplicada tambem em criacao/atualizacao via API, importacao e outros formularios — algo que um script OnLoad jamais alcanca.

Mas o teto chega rapido:

* So opera sobre campos do proprio formulario/registro — nao consulta outras tabelas.
* Nao faz chamadas assincronas (sem Web API, sem await).
* Logica condicional e limitada a AND/OR simples, sem loops nem calculo complexo.
* Nao manipula subgrids, abas dinamicas por dados externos ou controles customizados.
* Set Field Value nao dispara eventos OnChange de outros campos em cadeia de forma confiavel.

**Quando o JavaScript (Client API) e inevitavel**

Client scripting entra quando a regra precisa de dados que nao estao no formulario ou de comportamento que business rules nao expressam. Casos tipicos:

* **Consultar outra tabela** antes de validar — `Xrm.WebApi.retrieveMultipleRecords` para checar duplicidade, buscar limite de credito, validar estoque.
* **OnSave assincrono** com `executionContext.getEventArgs().preventDefault()` e uma Promise, para bloquear o salvamento ate uma validacao remota retornar.
* **Manipular a UI alem de campos**: controlar visibilidade de abas/secoes, filtrar lookups dinamicamente com `addPreSearch`/`addCustomFilter`, reagir a eventos de subgrid.
* **Logica de calculo** que envolve varios campos com condicionais, formatacao ou transformacao de texto.

O preco e manutencao: JavaScript vive em web resources, precisa ser versionado em solucao, testado em cada atualizacao de plataforma (a Client API evolui) e e sensivel a mudancas de schema. Um `getAttribute` para um campo removido quebra silenciosamente o formulario.

**O erro de colocar regra de negocio critica no cliente**

Tanto business rules de escopo Form quanto client scripting rodam no navegador — e podem ser contornados. Um usuario pode gravar o registro via API, importacao de Excel, fluxo do Power Automate ou um segundo formulario sem o script. Portanto:

* Validacao de **conveniencia/UX** (obrigatoriedade visual, mensagem amigavel, ocultar campos) fica no cliente.
* Validacao que **garante integridade de dados** (nao pode existir registro em estado X sem campo Y) tem que estar no servidor — business rule de escopo Entity para casos simples, ou plugin em pre-operation/pre-validation para casos que exigem consulta e transacao.

O padrao robusto e dupla camada: a mesma regra no cliente (para feedback imediato) e no servidor (para garantia real). Business rules de escopo Entity cobrem esse caso sem duplicar codigo quando a logica e simples.

**Roteiro de decisao**

1. A regra so mostra/oculta/obriga/valida campos do proprio registro, sem consultar nada externo? → **Business rule**. Se precisar valer tambem na API/importacao, use escopo Entity.
2. Precisa consultar outra tabela, fazer validacao assincrona, filtrar lookup ou manipular subgrid/aba por dados? → **Client scripting**.
3. A regra protege integridade de dados que nao pode depender da UI? → **Servidor** (business rule Entity para o simples, plugin para o que exige consulta/transacao), com eventual espelho no cliente para UX.
4. A logica precisa de reuso entre varias tabelas/forms? → Considere **plugin ou PCF**, nao copiar script.

Comecar pela business rule e so escalar para JavaScript quando o limite aparecer mantem o formulario sustentavel. Em model-driven apps que crescem, misturar dezenas de scripts desconexos com dezenas de business rules sobre os mesmos campos vira um pesadelo de depuracao — a disciplina de saber onde cada regra vive e o que separa um app mantido de um app temido.

Se sua organizacao opera model-driven apps e Dynamics 365 em escala e precisa estruturar essa camada de logica de formulario com governanca e ALM, a Dynamic Solucoes pode ajudar a desenhar a arquitetura e os padroes certos, do no-code ao servidor.



In model-driven app forms there is a layer of logic that runs on the client, before any plugin or flow comes into play: form validation and interface behavior. Microsoft offers two paths for this — **business rules** (no-code, declarative) and **client scripting** in JavaScript (Client API). The wrong choice between them produces either rules that are impossible to evolve or a fragile script base that nobody wants to touch. This post defines where each approach wins.

**What business rules actually do (and where they stop)**

A business rule is a declarative rule configured in the designer, made of conditions and actions. It can: show/hide fields, make fields required or optional, enable/disable fields, set field values, validate with an error message, and apply recommendations. Its strength is the execution scope: a business rule can run on the form (client) **or on the entire entity**, including server-side. When configured with Entity scope, the rule is also applied during create/update via API, import, and other forms — something an OnLoad script can never reach.

But the ceiling arrives quickly:

* It only operates on fields of the current form/record — it does not query other tables.
* It makes no asynchronous calls (no Web API, no await).
* Conditional logic is limited to simple AND/OR, with no loops or complex computation.
* It does not manipulate subgrids, data-driven dynamic tabs, or custom controls.
* Set Field Value does not reliably trigger OnChange events of other fields in a chain.

**When JavaScript (Client API) is unavoidable**

Client scripting comes in when the rule needs data that is not on the form or behavior that business rules cannot express. Typical cases:

* **Querying another table** before validating — `Xrm.WebApi.retrieveMultipleRecords` to check for duplicates, fetch a credit limit, validate stock.
* **Asynchronous OnSave** with `executionContext.getEventArgs().preventDefault()` and a Promise, to block the save until a remote validation returns.
* **Manipulating the UI beyond fields**: controlling tab/section visibility, dynamically filtering lookups with `addPreSearch`/`addCustomFilter`, reacting to subgrid events.
* **Calculation logic** involving several fields with conditionals, formatting, or text transformation.

The cost is maintenance: JavaScript lives in web resources, must be versioned in a solution, tested at each platform update (the Client API evolves), and is sensitive to schema changes. A `getAttribute` for a removed field silently breaks the form.

**The mistake of putting critical business rules on the client**

Both Form-scoped business rules and client scripting run in the browser — and can be bypassed. A user can save the record via API, Excel import, Power Automate flow, or a second form without the script. Therefore:

* **Convenience/UX** validation (visual requiredness, friendly message, hiding fields) stays on the client.
* Validation that **guarantees data integrity** (no record can exist in state X without field Y) must live on the server — an Entity-scoped business rule for simple cases, or a plugin in pre-operation/pre-validation for cases that require a query and a transaction.

The robust pattern is dual-layer: the same rule on the client (for immediate feedback) and on the server (for real enforcement). Entity-scoped business rules cover this case without duplicating code when the logic is simple.

**Decision guide**

1. Does the rule only show/hide/require/validate fields of the current record, with no external lookup? → **Business rule**. If it must also hold on API/import, use Entity scope.
2. Does it need to query another table, do asynchronous validation, filter a lookup, or manipulate a subgrid/tab from data? → **Client scripting**.
3. Does the rule protect data integrity that cannot depend on the UI? → **Server** (Entity business rule for the simple case, plugin for what needs a query/transaction), with an optional client mirror for UX.
4. Does the logic need reuse across several tables/forms? → Consider a **plugin or PCF**, not copying the script.

Starting with the business rule and only escalating to JavaScript when the limit appears keeps the form sustainable. In model-driven apps that grow, mixing dozens of disconnected scripts with dozens of business rules over the same fields becomes a debugging nightmare — the discipline of knowing where each rule lives and what separates them is what distinguishes a maintained app from a feared one.

If your organization runs model-driven apps and Dynamics 365 at scale and needs to structure this form logic layer with governance and ALM, Dynamic Solucoes can help design the right architecture and patterns, from no-code to server.
