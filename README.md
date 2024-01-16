# Nome do Projeto

Este projeto é uma API RESTful construída com Node.js e Prisma que permite aos usuários gerenciar produtos e categorias em um banco de dados.

## Funções da API

### Produtos

- **GET /products**: Retorna todos os produtos do banco de dados. Você pode filtrar os produtos por classes passando os IDs das classes como parâmetros de consulta (por exemplo, `/products?classes=1,2,3`).
- **POST /products**: Adiciona um novo produto ao banco de dados. Requer um corpo de solicitação com `name`, `category`, `base_price`, `discount_percentage` e `image_url`.
- **PUT /products**: Atualiza um produto existente no banco de dados. Requer um corpo de solicitação com `id`, `name`, `category`, `base_price`, `discount_percentage` e `image_url`.

### Promoções

- **GET /promotions**: Retorna todos os produtos que estão em promoção.

### Rotas de Compras

- **POST /shoppingroutes**: Retorna produtos agrupados por corredores. Requer um corpo de solicitação com uma lista de IDs de produtos.

### Usuários

- **POST /register**: Registra um novo usuário. Requer um corpo de solicitação com `name`, `email`, `password` e `phoneNumber`.
- **POST /login**: Autentica um usuário. Requer um corpo de solicitação com `email`/`phoneNumber` e `password`.
- **PUT /users**: Atualiza um usuário existente. Requer um corpo de solicitação com `id`, `name`, `email`, `password` e `phoneNumber`.

## Como usar

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Inicie o servidor com `npm start`.

## Desenvolvido por

Desenvolvido por @arthurlspolti
