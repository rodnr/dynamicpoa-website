---
title: Como impedir usuários de utilizarem versões antigas de um Power Apps
description: >-
  Saiba como impedir que algum usuário utilize as versões antigas do seu Power
  Apps
date: '2023-05-08 03:16:31'
thumbnail: /assets/img/blog/group-893.png
---
Descubra como criar um controle de versões de aplicativo para Power Apps de forma simples e rápida! Com apenas alguns passos, você poderá resolver o problema da demora na atualização para nova versão ao publicá-la e garantir que seus usuários sempre usem a versão mais recente. 

Se você precisa já precisou publicar uma nova versão de um aplicativo em Power Apps, de repente por conta de algum bug, ou melhoria, como por exemplo, obrigar o preenchimento de algum campo em um formulário e percebeu que os usuários continuavam utilizando a versão antiga, este passo a passo será útil pois irá te ajudar a criar um controle de versões de aplicativo usando listas do SharePoint. O problema ocorre majoritariamente devido ao cache do navegador ou de uma demora na sincronização na Microsoft, mas você pode resolver de uma forma bem simples:

1.Crie uma nova lista no SharePoint: A primeira coisa que você precisa fazer é criar uma nova lista no SharePoint. Você pode dar o nome que quiser, como "Versões Power Apps". Certifique-se de que a lista seja acessível a todos os usuários do seu aplicativo.

![](/assets/img/blog/passo-1.jpg "Passo 1")

2.Crie uma coluna para preencher a versão do aplicativo: Na lista criada no passo anterior, adicione uma nova coluna chamada "Versão Power Apps". Essa coluna será usada para armazenar a versão atual do seu aplicativo, e você pode utilizar a mesma lista para controlar vários aplicativos.

3.Crie uma nova tela de alerta: Agora, crie uma nova tela que será usada para alertar o usuário sobre uma nova versão do aplicativo. Essa tela pode ser renomeada com qualquer nome, como "TelaAtualizacao", ou no caso da imagem, "Screen1", e personalize ela da maneira que desejar.

4.Atualize a propriedade OnStart do aplicativo: Defina a tela de alerta criada no passo anterior como a tela inicial do seu aplicativo. Para isso, adicione a fórmula abaixo à propriedade StartScreen:

If(Lookup('Versões Power Apps';ID=1;'Versão Power Apps')="v1.0";Screen1;NOVO_Home)

Basicamente, estamos utilizando o ID do item que criamos na lista para consultar qual valor está preenchido na coluna "Versão Power Apps", e comparar com um valor que digitamos manualmente na fórmula. Na imagem, por exemplo, o aplicativo está na "v1.4", e só irá abrir a tela "NOVO_Home" (uma tela que seria a página inicial do aplicativo) caso na lista do SharePoint, o item com ID 1 também esteja com "v1.4".

![](/assets/img/blog/passo-4.jpg "Passo 4")

5.Publique a nova versão do aplicativo: Quando você publicar uma nova versão do aplicativo, basta atualizar o valor na coluna na lista do SharePoint e na fórmula da propriedade StartScreen do aplicativo. Isso garantirá que seus usuários passem a entrar automaticamente na tela de aviso de nova versão disponível até que o Power Apps seja devidamente atualizado.

Gostou deste passo-a-passo? Essa é apenas uma forma básica de resolver este problema, para casos mais específicos ou variados, entre em contato com a gente!
