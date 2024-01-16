import prisma from "../lib/prisma.js";

class Category {
  static async findAll() {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}

export default Category;
