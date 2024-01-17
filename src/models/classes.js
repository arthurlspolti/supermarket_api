import prisma from "../lib/prisma.js";

class Category {
  static async findAll() {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  static async findUnique(id) {
    return await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });
  }
}

export default Category;
