import prisma from "../lib/prisma.js";

class Product {
  static async findMany(idsClasses) {
    if (idsClasses.length > 0) {
      return await prisma.products.findMany({
        where: {
          category: {
            in: idsClasses,
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    } else {
      return await prisma.products.findMany({
        orderBy: {
          name: "asc",
        },
      });
    }
  }

  static async createProduct(data) {
    return await prisma.products.create({
      data,
    });
  }

  static async findUnique(id) {
    return await prisma.products.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  static async updateProduct(id, data) {
    return await prisma.products.update({
      where: {
        id: Number(id),
      },
      data,
    });
  }
}

export default Product;
