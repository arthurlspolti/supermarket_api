const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/classes", async (req, res) => {
  let categories;
  try {
    categories = await prisma.Category.findMany({
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

app.get("/promotions", async (req, res) => {
  let promotions;
  try {
    promotions = await prisma.Products.findMany({
      where: {
        discount_percentage: {
          gt: 0,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar promocões");
    return;
  }

  res.json(promotions);
});

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

app.post("/shopping-list", async (req, res) => {
  const shoppingList = req.body;
  let corredors = [];
});

// Iniciar o servidor
app.listen(3000, () =>
  console.log("Servidor rodando na porta 3000, no http://localhost:3000")
);
