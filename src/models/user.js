import prisma from "../lib/prisma.js";

class User {
  static async findUniqueEmail(email) {
    return await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }

  static async findUniquePhone(phone) {
    return await prisma.users.findUnique({
      where: {
        phone: phone,
      },
    });
  }

  static async createUser(data) {
    return await prisma.users.create({
      data,
    });
  }

  static async findUniqueEmail(email) {
    return await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }

  static async findUniquePhone(phone) {
    return await prisma.users.findUnique({
      where: {
        phone: phone,
      },
    });
  }

  static async updateUser(id, data) {
    return await prisma.users.update({
      where: {
        id: Number(id),
      },
      data,
    });
  }
}

export default User;
