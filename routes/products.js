const productsController = require("../controllers/productsController");

async function products(server) {
  server.get("/products", async (request, reply) => {
    const { classes } = request.query;
    const idsClasses = classes ? classes.split(",").map(Number) : [];

    try {
      const produtos = await productsController.buscarProdutos(
        server.prisma,
        idsClasses
      );
      reply.send(produtos);
    } catch (error) {
      console.error(error);
      reply.status(500).send("Erro ao buscar produtos");
    }
  });
}

module.exports = products;
