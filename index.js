const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/classes/produtos", async (req, res) => {
  try {
    const ids = req.query.ids;
    if (!ids) {
      return res.status(400).json({ error: "Nenhum id fornecido" });
    }

    const idArray = ids.split(",").map(Number);
    if (idArray.some(isNaN)) {
      return res.status(400).json({ error: "Formato de id inválido" });
    }

    const classesProdutos = await prisma.class.findMany({
      where: { id_class: { in: idArray } },
      include: { Products: true },
    });

    if (!classesProdutos.length) {
      return res.status(404).json({ error: "Classe não encontrada" });
    }

    const response = classesProdutos.map((classeProdutos) => ({
      Classe: classeProdutos.name_class,
      Produtos: classeProdutos.Products.map((produto) => produto.name_products),
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao processar sua solicitação" });
  }
});

app.get("/classes/corredor", async (req, res) => {
  try {
    const ids = req.query.ids;
    if (!ids) {
      return res.status(400).json({ error: "Nenhum id fornecido" });
    }

    const idArray = ids.split(",").map(Number);
    if (idArray.some(isNaN)) {
      return res.status(400).json({ error: "Formato de id inválido" });
    }

    const classesCorredores = await prisma.class.findMany({
      where: { id_class: { in: idArray } },
      include: { Shelf: true },
    });

    if (!classesCorredores.length) {
      return res.status(404).json({ error: "Classe não encontrada" });
    }

    const response = classesCorredores.map((classeCorredor) => ({
      Classe: classeCorredor.name_class,
      Corredores: {
        idCorredor: classeCorredor.Shelf.id_shelf,
        Corredor: classeCorredor.Shelf.name_shelf,
      },
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao processar sua solicitação" });
  }
});

app.get("/classes/promocoes", async (req, res) => {
  try {
    const ids = req.query.ids;
    if (!ids) {
      return res.status(400).json({ error: "Nenhum id fornecido" });
    }

    const idArray = ids.split(",").map(Number);
    if (idArray.some(isNaN)) {
      return res.status(400).json({ error: "Formato de id inválido" });
    }

    const classesPromocoes = await prisma.class.findMany({
      where: { id_class: { in: idArray } },
      include: { Promotion: true },
    });

    if (!classesPromocoes.length) {
      return res.status(404).json({ error: "Classe não encontrada" });
    }

    const response = classesPromocoes.map((classePromocao) => ({
      Classe: classePromocao.name_class,
      Promoções: classePromocao.Promotion.map((promocao) => ({
        Produto: promocao.name_prod,
        Preço: promocao.price,
      })),
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao processar sua solicitação" });
  }
});

app.get("/classes", async (req, res) => {
  let categories;
  try {
    categories = await prisma.class.findMany({
      select: {
        name_class: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar categorias");
    return;
  }

  res.json(categories);
});

app.get("/products", async (req, res) => {
  const { classes } = req.query;
  const classIds = classes ? classes.split(",").map(Number) : [];

  let products;
  try {
    if (classIds.length > 0) {
      products = await prisma.products.findMany({
        where: {
          id_class: {
            in: classIds,
          },
        },
        select: {
          name_products: true,
        },
      });
    } else {
      products = await prisma.products.findMany({
        select: {
          name_products: true,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar produtos");
    return;
  }

  res.json(products);
});
// Iniciar o servidor
app.listen(3000, () =>
  console.log("Servidor rodando na porta 3000, no http://localhost:3000")
);
