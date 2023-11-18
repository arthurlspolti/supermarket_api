const promotionsController = require("../controllers/promotionsController");

async function promotions(server) {
  server.get("/promotions", async (reply) => {
    try {
      const promocoes = await promotionsController.buscarPromocoes(
        server.prisma
      );
      reply.send(promocoes);
    } catch (error) {
      console.error(error);
      reply.status(500).send(error.message);
    }
  });
}

module.exports = promotions;
