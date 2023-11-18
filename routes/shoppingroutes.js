const shoppingroutesController = require("../controllers/shoppingroutesController");

async function shoppingRoutes(server) {
  server.post("/shoppingroutes", async (request, reply) => {
    try {
      const idsProdutos = request.body;
      const produtos = await shoppingroutesController.buscarGrupos(
        server.prisma,
        idsProdutos
      );

      if (!produtos.length) {
        return reply
          .status(404)
          .json({ error: "Nenhum produto achado para seus IDs" });
      }

      const produtosAdicionais =
        await shoppingroutesController.buscarProdutosAdicionais(
          server.prisma,
          produtos,
          idsProdutos
        );
      const todosProdutos = [...produtos, ...produtosAdicionais];
      const produtosAgrupados = shoppingroutesController.agruparProdutos(
        todosProdutos,
        idsProdutos
      );

      reply.send(produtosAgrupados);
    } catch (error) {
      console.error(error);
      reply
        .status(500)
        .json({ error: "Um erro ocorreu durante o seu request." });
    }
  });
}

module.exports = shoppingRoutes;
