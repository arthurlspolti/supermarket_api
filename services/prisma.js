const fp = require("fastify-plugin");
const { PrismaClient } = require("@prisma/client");

async function prismaDecorator(server, options, next) {
  server.decorate("prisma", new PrismaClient());
  next();
}

module.exports = fp(prismaDecorator);
