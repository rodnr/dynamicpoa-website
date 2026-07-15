---
title: "DLP na Power Platform: como definir políticas de conectores sem travar o negócio"
description: "Políticas de prevenção de perda de dados mal calibradas viram gargalo ou brecha de segurança. Veja como estruturar DLP por ambiente na Power Platform."
date: '2026-07-15 20:32:08'
---
À medida que a adoção de Power Apps e Power Automate cresce dentro de uma organização, chega o momento em que o time de governança percebe que qualquer usuário com licença consegue conectar um fluxo ao Twitter, a um HTTP público ou a um SharePoint pessoal — e mover dados corporativos para fora do perímetro sem que ninguém saiba. É aí que entram as políticas de DLP (Data Loss Prevention) da Power Platform. O problema é que a maioria das empresas ou não configura DLP nenhuma, ou aplica uma política única e agressiva que trava metade dos casos de uso legítimos. Este post mostra como calibrar isso.

**O que uma política de DLP realmente faz**

Uma política de DLP na Power Platform não inspeciona conteúdo de dados como uma solução de DLP tradicional de e-mail faz. Ela opera em um nível mais simples e mais poderoso: **classifica cada conector em um de três grupos** e impede que conectores de grupos diferentes sejam usados no mesmo app ou fluxo.

Os três grupos são:

* **Business** — conectores para dados corporativos (Dataverse, SharePoint, SQL Server, Outlook 365).
* **Non-Business** — conectores para dados pessoais/externos (Gmail, Twitter/X, Dropbox pessoal).
* **Blocked** — conectores totalmente proibidos naquele escopo.

A regra de ouro é: um mesmo fluxo **não pode combinar** um conector Business com um Non-Business. Assim, você impede que um fluxo leia um item do SharePoint corporativo (Business) e o publique num serviço externo (Non-Business), porque os dois nunca poderão coexistir na mesma automação.

**Por que uma política única no tenant é um erro**

O instinto de muitos administradores é criar uma política que vale para todos os ambientes e classificar tudo o que não é obviamente corporativo como Blocked. O resultado é previsível: os makers começam a abrir tickets porque o conector de que precisam para um projeto legítimo foi bloqueado, e o time de governança vira o gargalo que a Power Platform prometia eliminar.

A abordagem madura é aplicar **políticas diferentes por ambiente**, refletindo o nível de risco de cada um:

* **Ambiente Default (onde todo mundo cai por padrão)** — trate como zona de baixo risco. Restrinja conectores premium e HTTP, mantenha só o essencial em Business, e considere mover projetos sérios para fora dele.
* **Ambientes de produção com dados sensíveis** — política restritiva, com allow-list explícita de conectores e HTTP/custom connectors bloqueados salvo exceção justificada.
* **Ambientes de desenvolvimento** — política mais permissiva para não travar a experimentação, desde que sem acesso a dados de produção reais.

**O caso especial do conector HTTP e dos custom connectors**

O conector HTTP genérico e os connectors customizados são os pontos que mais escapam de políticas mal desenhadas. Um único fluxo com uma ação HTTP pode enviar qualquer payload para qualquer endpoint da internet — é o equivalente a uma porta dos fundos. Recomendações práticas:

1. Coloque o conector HTTP no grupo **Blocked** em todos os ambientes de produção, liberando apenas via ambiente controlado.
2. Trate custom connectors como conectores nomeados na política: eles podem (e devem) ser classificados individualmente em Business, Non-Business ou Blocked.
3. Use **endpoint filtering** quando disponível para restringir a quais URLs/hosts o conector HTTP pode chamar, em vez do bloqueio total, quando houver integração legítima com uma API específica.

**Governança como processo, não como evento**

Definir DLP não é uma tarefa de uma tarde. Novos conectores são adicionados pela Microsoft continuamente e, por padrão, entram classificados como Non-Business — o que significa que um conector recém-lançado pode quebrar fluxos existentes ou, pior, abrir uma classificação inesperada. Estabeleça:

* Uma **política de classificação de novos conectores** (o comportamento padrão de novos conectores é configurável na política).
* Monitoramento via **Power Platform admin center** e, para cenários maduros, o **Center of Excellence (CoE) Starter Kit**, que inventaria apps, fluxos e violações de DLP.
* Um **canal de exceção** claro, para que o maker que precisa de um conector bloqueado saiba a quem pedir e em quanto tempo terá resposta — isso é o que evita a TI-sombra.

**Fechando**

DLP bem calibrada é a diferença entre uma Power Platform que escala com segurança e uma que vira um risco silencioso ou um cemitério de tickets. O ponto central é abandonar a ideia de política única e pensar em camadas por ambiente, tratando HTTP e custom connectors com atenção especial. Se sua empresa está expandindo o uso da Power Platform e ainda não tem uma estratégia de DLP e ambientes definida, a Dynamic Soluções pode ajudar a desenhar a governança do zero ou a auditar o que já existe, dentro dos nossos planos de suporte e consultoria.



As Power Apps and Power Automate adoption grows inside an organization, there comes a point when the governance team realizes that any licensed user can connect a flow to Twitter, to a public HTTP endpoint, or to a personal SharePoint — and move corporate data outside the perimeter without anyone noticing. This is where Power Platform DLP (Data Loss Prevention) policies come in. The catch is that most companies either configure no DLP at all, or apply a single, aggressive policy that blocks half of their legitimate use cases. This post shows how to calibrate it.

**What a DLP policy actually does**

A DLP policy in the Power Platform doesn't inspect data content the way a traditional email DLP solution does. It works at a simpler and more powerful level: it **classifies each connector into one of three groups** and prevents connectors from different groups from being used in the same app or flow.

The three groups are:

* **Business** — connectors for corporate data (Dataverse, SharePoint, SQL Server, Outlook 365).
* **Non-Business** — connectors for personal/external data (Gmail, Twitter/X, personal Dropbox).
* **Blocked** — connectors fully forbidden in that scope.

The golden rule: a single flow **cannot combine** a Business connector with a Non-Business one. This prevents a flow from reading an item from corporate SharePoint (Business) and publishing it to an external service (Non-Business), because those two can never coexist in the same automation.

**Why a single tenant-wide policy is a mistake**

Many admins' instinct is to create one policy for all environments and classify anything that isn't obviously corporate as Blocked. The result is predictable: makers start opening tickets because the connector they need for a legitimate project was blocked, and the governance team becomes the very bottleneck the Power Platform promised to eliminate.

The mature approach is to apply **different policies per environment**, reflecting each one's risk level:

* **The Default environment (where everyone lands by default)** — treat it as a low-risk zone. Restrict premium and HTTP connectors, keep only the essentials in Business, and consider moving serious projects out of it.
* **Production environments with sensitive data** — restrictive policy, with an explicit allow-list of connectors and HTTP/custom connectors blocked unless there's a justified exception.
* **Development environments** — a more permissive policy so experimentation isn't blocked, as long as there's no access to real production data.

**The special case of the HTTP connector and custom connectors**

The generic HTTP connector and custom connectors are the points that most often slip through poorly designed policies. A single flow with an HTTP action can send any payload to any endpoint on the internet — it's the equivalent of a back door. Practical recommendations:

1. Put the HTTP connector in the **Blocked** group across all production environments, allowing it only through a controlled environment.
2. Treat custom connectors as named connectors in the policy: they can (and should) be classified individually as Business, Non-Business, or Blocked.
3. Use **endpoint filtering** where available to restrict which URLs/hosts the HTTP connector can call, instead of a full block, when there's a legitimate integration with a specific API.

**Governance as a process, not an event**

Defining DLP isn't an afternoon's task. Microsoft continuously adds new connectors, and by default they arrive classified as Non-Business — which means a newly released connector can break existing flows or, worse, open an unexpected classification. Establish:

* A **classification policy for new connectors** (the default behavior for new connectors is configurable in the policy).
* Monitoring via the **Power Platform admin center** and, for mature scenarios, the **Center of Excellence (CoE) Starter Kit**, which inventories apps, flows, and DLP violations.
* A clear **exception channel**, so a maker who needs a blocked connector knows whom to ask and how quickly they'll get an answer — that's what prevents shadow IT.

**Wrapping up**

Well-calibrated DLP is the difference between a Power Platform that scales securely and one that becomes a silent risk or a graveyard of tickets. The key is to abandon the single-policy idea and think in layers per environment, paying special attention to HTTP and custom connectors. If your company is expanding its Power Platform usage and doesn't yet have a defined DLP and environment strategy, Dynamic Soluções can help design governance from scratch or audit what already exists, within our support and consulting plans.
