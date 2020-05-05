<h1 align="center">
    <img alt="Launchbase" src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png" width="400px" />
</h1>

<h3 align="center">
  Desafio: Construindo Foodfy
</h3>

<blockquote align="center">“Sua única limitação é você mesmo!”</blockquote>

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>
</p>

### Sobre o Desafio :rocket:

Construir um site completo para uma empresa de receitas chamada Foodfy.

<div align="center">
  <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/mockup.png" />
</div>


### Dicas e regras

- Na página de receitas, quando o usuário clica em uma receita, um modal deve aparecer em tela contendo as mesmas informações da receita que ele clicou;

<h3 align="center">
  Desafio: Refatorando o Foodfy
</h3> 

### Sobre o Desafio :rocket:

Nesse desafio tivemos que refatorar, ou seja, reescrever algumas partes, do código do desafio anterior, o Foodfy.

### O que foi feito :memo:

Criação do servidor utilizando as seguintes tecnologias:

- NodeJS
- Express
- Nunjucks
- Nodemon

Com o servidor configurado, configuramos as rotas no arquivo `server.js` e colocamos todos os dados das receitas em um arquivo `data.js`.

Em seguida deixamos o Front-end que estava com os dados estáticos, em algo dinámico utilizando o `Nunjucks` como template engine, nos permitindo usar variáveis no código HTML e buscar os dados dinamicamente.

#### Detalhe da receita

<div align="center">
  <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/mockup-detalhe-receita.png" />
</div>

- Ao clicar em uma receita agora o usuário deve ser redirecionado para uma nova página contendo todas informações da receita como ingredientes, modo de preparo e informações adicionais (todas essas informações estão contidas no arquivo `data.js`).
- Na página de listagem não é mais necessário abrir o modal como tínhamos no desafio anterior do Foodfy.

#### Ação de mostrar/esconder

Dentro da página do detalhe da receita, em cada seção "Ingredientes", "Modo de preparo" e "Informações adicionais" há um botão `Mostrar` ou `Esconder` que ao ser clicado deve mostrar ou esconder o texto abaixo do título baseado em seu estado de visibilidade.