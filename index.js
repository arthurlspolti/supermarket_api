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
});

// Iniciar o servidor
server
  .listen({ port: 3000 })
  .then(() => console.log(`Servidor rodando no http://localhost:3000`))
  .catch((err) => console.error(err));
