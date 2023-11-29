const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// Função para buscar categorias
const buscarCategorias = async (prisma) => {
  try {
    return await prisma.Category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar categorias");
  }
};

// Função para buscar produtos
const buscarProdutos = async (prisma, idsClasses) => {
  if (idsClasses.length > 0) {
    return await prisma.products.findMany({
      where: {
        category: {
          in: idsClasses,
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  } else {
    return await prisma.products.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
};

// Função para buscar promoções
const buscarPromocoes = async (prisma) => {
  try {
    return await prisma.Products.findMany({
      where: {
        discount_percentage: {
          gt: 0,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar promoções");
  }
};

// Função para buscar produtos
const buscarGrupos = async (prisma, idsProdutos) => {
  return await prisma.products.findMany({
    where: {
      id: {
        in: idsProdutos,
      },
    },
    include: {
      Category: true,
    },
  });
};

// Função para buscar produtos em promoção
const buscarProdutosAdicionais = async (prisma, produtos, idsProdutos) => {
  let produtosAdicionais = [];
  let idsAdicionais = []; // Novo array para armazenar os IDs dos produtos adicionais
  for (let id of idsProdutos) {
    const produto = produtos.find((produto) => produto.id === id);
    if (produto && produto.Category) {
      const produtosPromocao = await buscarProdutosPromocao(
        prisma,
        produto,
        idsProdutos,
        idsAdicionais // Passa o array de IDs para a função buscarProdutosPromocao
      );
      produtosAdicionais = [...produtosAdicionais, ...produtosPromocao];
      idsAdicionais = [
        ...idsAdicionais,
        ...produtosPromocao.map((produto) => produto.id),
      ]; // Adiciona os IDs dos novos produtos ao array
    }
  }
  return produtosAdicionais;
};

const buscarProdutosPromocao = async (
  prisma,
  produto,
  idsProdutos,
  idsAdicionais
) => {
  const produtosPromocao = await prisma.products.findMany({
    where: {
      Category: {
        id: produto.Category.id,
        localization: produto.Category.localization,
      },
      discount_percentage: {
        gt: 0,
      },
      id: {
        notIn: [...idsProdutos, ...idsAdicionais], // Verifica se o produto já foi adicionado
      },
    },
    include: {
      Category: true,
    },
  });
  return produtosPromocao;
};

// Função para agrupar produtos
const agruparProdutos = (todosProdutos, idsProdutos) => {
  const agrupados = todosProdutos.reduce((agrupados, produto) => {
    const chave = produto.Category
      ? produto.Category.localization
      : "Sem categoria";
    if (!agrupados[chave]) {
      agrupados[chave] = { AisleNumber: chave, products: [], promotions: [] };
    }
    if (idsProdutos.includes(produto.id)) {
      agrupados[chave].products.push(produto);
    } else {
      agrupados[chave].promotions.push(produto);
    }
    return agrupados;
  }, {});

  // Converte o objeto agrupado em um array
  return Object.values(agrupados);
};

// Função para verificar se os campos obrigatórios estão presentes
const verificarCamposObrigatorios = (nome, email, senha) => {
  if (!nome || !email || !senha) {
    throw new Error("Os campos nome, email e senha são obrigatórios");
  }
};

// Função para verificar se o usuário já existe
const verificarUsuarioExistente = async (prisma, email) => {
  const usuarioExistente = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (usuarioExistente) {
    throw new Error("Já existe um usuário com este email");
  }
};

// Função para criptografar a senha
const criptografarSenha = async (senha, rodadasSalt) => {
  return await bcrypt.hash(senha, rodadasSalt);
};

// Função para criar um novo usuário
const criarNovoUsuario = async (prisma, nome, email, senhaCriptografada) => {
  return await prisma.users.create({
    data: {
      name: nome,
      email: email,
      password: senhaCriptografada,
    },
  });
};

// Função para verificar se os campos obrigatórios estão presentes
const verificarCamposObrigatoriosLogin = (email, senha) => {
  if (!email || !senha) {
    throw new Error("Os campos email e senha são obrigatórios");
  }
};

// Função para buscar usuário
const buscarUsuario = async (prisma, email) => {
  const usuario = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!usuario) {
    throw new Error("Email ou senha inválidos");
  }

  return usuario;
};

// Função para validar senha
const validarSenha = async (senha, senhaCriptografada) => {
  const senhaValida = await bcrypt.compare(senha, senhaCriptografada);

  if (!senhaValida) {
    throw new Error("Email ou senha inválidos");
  }
};

// Rota para puxar todas as classes do banco
app.get("/classes", async (req, res) => {
  try {
    const categorias = await buscarCategorias(prisma);
    res.json(categorias);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para mostrar todos os produtos do banco
app.get("/products", async (req, res) => {
  const { classes } = req.query;
  const idsClasses = classes ? classes.split(",").map(Number) : [];

  try {
    const produtos = await buscarProdutos(prisma, idsClasses);
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar produtos");
  }
});

const adicionarProduto = async (
  name,
  category,
  base_price,
  discount_percentage,
  image_url
) => {
  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: category },
    });
    if (!categoryExists) {
      return {
        status: 400,
        message: "A categoria informada não existe no banco de dados.",
      };
    }
    const novoProduto = await prisma.products.create({
      data: {
        name: name,
        category: category,
        base_price: base_price,
        discount_percentage: discount_percentage,
        image_url: image_url,
      },
    });
    return {
      status: 201,
      message: "Produto adicionado com sucesso!",
      data: novoProduto,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Erro ao adicionar produto ao banco de dados.",
    };
  }
};
app.post("/products", async (req, res) => {
  const { name, category, base_price, discount_percentage, image_url } =
    req.body;
  const result = await adicionarProduto(
    name,
    category,
    base_price,
    discount_percentage,
    image_url
  );
  res.status(result.status).json(result);
});

// Rota para mostrar todos os produtos com promoção no banco
app.get("/promotions", async (req, res) => {
  try {
    const promocoes = await buscarPromocoes(prisma);
    res.json(promocoes);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Rota para mostrar os produtos agrupados por corredores
app.post("/shoppingroutes", async (req, res) => {
  try {
    const idsProdutos = req.body;
    const produtos = await buscarGrupos(prisma, idsProdutos);

    if (!produtos.length) {
      return res
        .status(404)
        .json({ error: "Nenhum produto achado para seus IDs" });
    }

    const produtosAdicionais = await buscarProdutosAdicionais(
      prisma,
      produtos,
      idsProdutos
    );
    const todosProdutos = [...produtos, ...produtosAdicionais];
    const produtosAgrupados = agruparProdutos(todosProdutos, idsProdutos);

    res.json(produtosAgrupados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Um erro ocorreu durante o seu request." });
  }
});

app.post("/register", async (req, res) => {
  const rodadasSalt = 10;
  const {
    name: nome,
    email,
    password: senha,
    phoneNumber: telefone,
  } = req.body;

  try {
    if (email && !telefone) {
      verificarCamposObrigatorios(nome, email, senha);
      await verificarUsuarioExistente(prisma, email);
      const senhaCriptografada = await criptografarSenha(senha, rodadasSalt);
      const novoUsuario = await criarNovoUsuario(
        prisma,
        nome,
        email,
        senhaCriptografada
      );
      res.status(201).json(novoUsuario);
    } else if (!email && telefone) {
      verificarCamposObrigatoriosPhone(nome, telefone, senha);
      await verificarUsuarioExistentePhone(prisma, telefone);
      const senhaCriptografada = await criptografarSenha(senha, rodadasSalt);
      const novoUsuario = await criarNovoUsuarioPhone(
        prisma,
        nome,
        telefone,
        senhaCriptografada
      );
      res.status(201).json(novoUsuario);
    } else {
      throw new Error("Por favor, forneça um email ou um número de telefone");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const verificarCamposObrigatoriosPhone = (nome, telefone, senha) => {
  if (!nome || !telefone || !senha) {
    throw new Error("Os campos nome, telefone e senha são obrigatórios");
  }
  if (!/^\d{11}$/.test(telefone)) {
    throw new Error("O telefone deve ter 11 dígitos numéricos");
  }
};

const verificarUsuarioExistentePhone = async (prisma, telefone) => {
  const usuarioExistente = await prisma.users.findUnique({
    where: {
      phone: telefone,
    },
  });
  if (usuarioExistente) {
    throw new Error("Já existe um usuário com este telefone");
  }
};

const criarNovoUsuarioPhone = async (
  prisma,
  nome,
  telefone,
  senhaCriptografada
) => {
  return await prisma.users.create({
    data: {
      name: nome,
      phone: telefone,
      password: senhaCriptografada,
    },
  });
};

// Rota para logar um usuário
app.post("/login", async (req, res) => {
  const { email, password: senha, phoneNumber: telefone } = req.body;

  try {
    if (email && !telefone) {
      verificarCamposObrigatoriosLogin(email, senha);
      const usuario = await buscarUsuario(prisma, email);
      await validarSenha(senha, usuario.password);
      res.status(200).json(usuario);
    } else if (!email && telefone) {
      verificarCamposObrigatoriosLoginPhone(telefone, senha);
      const usuario = await buscarUsuarioPhone(prisma, telefone);
      await validarSenha(senha, usuario.password);
      res.status(200).json(usuario);
    } else {
      throw new Error("Por favor, forneça um email ou um número de telefone");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const verificarCamposObrigatoriosLoginPhone = (telefone, senha) => {
  if (!telefone || !senha) {
    throw new Error("Os campos telefone e senha são obrigatórios");
  }
};

const buscarUsuarioPhone = async (prisma, telefone) => {
  const usuario = await prisma.users.findUnique({
    where: {
      phone: telefone,
    },
  });

  if (!usuario) {
    throw new Error("Telefone ou senha inválidos");
  }

  return usuario;
};

app.put("/users", async (req, res) => {
  const {
    id,
    name: nome,
    email,
    password: senha,
    phoneNumber: telefone,
  } = req.body;

  try {
    if (!id || !nome || !email || !senha) {
      throw new Error("Os campos id, nome, email e senha são obrigatórios");
    }
    const usuarioExistente = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado");
    }
    const senhaCriptografada = await criptografarSenha(senha, rodadasSalt);
    const usuarioAtualizado = await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name: nome,
        email: email,
        password: senhaCriptografada,
        phone: telefone ? Number(telefone) : undefined,
      },
    });
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Iniciar o servidor
app.listen(3000, () =>
  console.log("Servidor rodando na porta 3000, no http://localhost:3000")
);
