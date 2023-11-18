const classesController = require("../controllers/classesController");

async function classes(server) {
  server.get("/classes", async (reply) => {
    try {
      const categorias = await classesController.buscarCategorias(
        server.prisma
      );
      reply.send(categorias);
    } catch (error) {
      reply.status(500).send(error.message);
    }
  });
}

module.exports = classes;
