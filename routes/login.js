const loginController = require("../controllers/loginController");

async function login(server, options) {
  server.post("/login", async (request, reply) => {
    const { email, password: senha } = request.body;

    try {
      loginController.verificarCamposObrigatoriosLogin(email, senha);
      const usuario = await loginController.buscarUsuario(server.prisma, email);
      await loginController.validarSenha(senha, usuario.password);
      reply.status(200).send("Login bem-sucedido!");
    } catch (error) {
      console.error(error);
      reply.status(500).send(error.message);
    }
  });
}

module.exports = login;
