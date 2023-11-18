const bcrypt = require("bcryptjs");

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

module.exports = {
  verificarCamposObrigatoriosLogin,
  buscarUsuario,
  validarSenha,
};
