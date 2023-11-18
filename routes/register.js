const registerController = require("../controllers/registerController");

async function register(server) {
  server.post("/register", async (request, reply) => {
    const rodadasSalt = 10;
    const { name: nome, email, password: senha } = request.body;

    try {
      registerController.verificarCamposObrigatorios(nome, email, senha);
      await registerController.verificarUsuarioExistente(server.prisma, email);
      const senhaCriptografada = await registerController.criptografarSenha(
        senha,
        rodadasSalt
      );
      const novoUsuario = await registerController.criarNovoUsuario(
        server.prisma,
        nome,
        email,
        senhaCriptografada
      );
      reply.status(201).json(novoUsuario);
    } catch (error) {
      console.error(error);
      reply.status(500).send(error.message);
    }
  });
}

module.exports = register;
