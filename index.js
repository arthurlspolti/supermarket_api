<<<<<<< Updated upstream
const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/classes", async (req, res) => {
  let categories;
  try {
    categories = await prisma.class.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar categorias");
    return;
  }

  res.json(categories);
});

// Rota GET para "/products"
app.get("/products", async (req, res) => {
  // Extrai o parâmetro de consulta "classes" da requisição
  const { classes } = req.query;
  // Converte o parâmetro "classes" em um array de números, ou um array vazio se "classes" não estiver definido
  const classIds = classes ? classes.split(",").map(Number) : [];

  let products;
  try {
    // Se "classIds" não estiver vazio, busca produtos que pertencem às classes especificadas
    if (classIds.length > 0) {
      products = await prisma.products.findMany({
        where: {
          class: {
            in: classIds,
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    } else {
      // Se "classIds" estiver vazio, busca todos os produtos
      products = await prisma.products.findMany({
        orderBy: {
          name: "asc",
        },
      });
    }
  } catch (error) {
    // Em caso de erro, registra o erro e retorna uma resposta com status 500
    console.error(error);
    res.status(500).send("Erro ao buscar produtos");
    return;
  }

  // Retorna os produtos encontrados como um JSON
  res.json(products);
});

app.get("/promotions", async (req, res) => {});

app.post("/register", async (req, res) => {
  const saltRounds = 10;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send("Os campos name, email e password são obrigatórios");
    return;
  }

  // Verificar se o email já existe
  const existingUser = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    res.status(400).send("Já existe um usuário com este email");
    return;
  }

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  let newUser;
  try {
    newUser = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar usuário");
    return;
  }

  res.status(201).json(newUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Os campos email e password são obrigatórios");
    return;
  }

  let user;
  try {
    user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar usuário");
    return;
  }

  if (!user) {
    res.status(401).send("Email ou senha inválidos");
    return;
  }

  // Comparar a senha fornecida com a senha criptografada
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).send("Email ou senha inválidos");
    return;
  }

  res.status(200).send("Login bem-sucedido!");
});

// Rota para agrupar produtos por categoria
app.post("/api/agrupar-por-categoria", async (req, res) => {
  try {
    // Obtendo a lista de IDs dos produtos do corpo da requisição
    const { productIds } = req.body;

    // Consultando os produtos com base nos IDs fornecidos
    const produtos = await prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Agrupando os produtos por categoria
    const produtosAgrupados = produtos.reduce((agrupados, produto) => {
      const categoriaId = produto.category || 0; // 0 para produtos sem categoria
      if (!agrupados[categoriaId]) {
        agrupados[categoriaId] = [];
      }
      agrupados[categoriaId].push(produto);
      return agrupados;
    }, {});

    res.json(produtosAgrupados);
  } catch (error) {
    console.error("Erro ao agrupar produtos por categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
=======
const fastify = require("fastify");
const server = fastify();
const shoppingRoutes = require("./routes/shoppingroutes");
const classes = require("./routes/classes");
const products = require("./routes/products");
const promotions = require("./routes/promotions");
const register = require("./routes/register");
const login = require("./routes/login");
const prismaPlugin = require("./services/prisma");

server.register(shoppingRoutes);
server.register(classes);
server.register(products);
server.register(promotions);
server.register(register);
server.register(login);
server.register(prismaPlugin);

server.addHook("onClose", async (instance, done) => {
  instance.prisma.$disconnect();
  done();
>>>>>>> Stashed changes
});

// Iniciar o servidor
server
  .listen({ port: 3000 })
  .then(() => console.log(`Servidor rodando no http://localhost:3000`))
  .catch((err) => console.error(err));
