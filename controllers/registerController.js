const bcrypt = require("bcryptjs");

// Função para verificar se os campos obrigatórios estão presentes
const verificarCamposObrigatorios = (nome, email, senha) => {
  if (!nome || !email || !senha) {
    throw new Error("Os campos nome, email e senha são obrigatórios");
  }
};

// Função para verificar se o usuário já existe
const verificarUsuarioExistente = async (prisma, email) => {
  const usuarioExistente = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (usuarioExistente) {
    throw new Error("Já existe um usuário com este email");
  }
};

// Função para criptografar a senha
const criptografarSenha = async (senha, rodadasSalt) => {
  return await bcrypt.hash(senha, rodadasSalt);
};

// Função para criar um novo usuário
const criarNovoUsuario = async (prisma, nome, email, senhaCriptografada) => {
  return await prisma.users.create({
    data: {
      name: nome,
      email: email,
      password: senhaCriptografada,
    },
  });
};

module.exports = {
  verificarCamposObrigatorios,
  verificarUsuarioExistente,
  criptografarSenha,
  criarNovoUsuario,
};
