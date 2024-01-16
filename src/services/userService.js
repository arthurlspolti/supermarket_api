import bcrypt from "bcryptjs";
import User from "../models/user.js";

const userService = {
  register: async (data) => {
    const { name, email, phone, password } = data;
    const saltRounds = 10;

    if (email) {
      const existingUser = await User.findUniqueEmail(email);
      if (existingUser) {
        throw new Error("Já existe um usuário com este email");
      }
    }

    if (phone) {
      const existingUser = await User.findUniquePhone(phone);
      if (existingUser) {
        throw new Error("Já existe um usuário com este telefone");
      }
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return newUser;
  },

  login: async (data) => {
    const { email, phone, password } = data;

    let user;
    if (email) {
      user = await User.findUniqueEmail(email);
    } else if (phone) {
      user = await User.findUniquePhone(phone);
    }

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new Error("Senha incorreta");
    }

    return user;
  },

  updateUser: async (data) => {
    const { id, name, email, password, phone } = data;
    const saltRounds = 10;

    const existingUser = await User.findUnique(id);
    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updatedUser = await User.updateUser(id, {
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return updatedUser;
  },
};

export default userService;
