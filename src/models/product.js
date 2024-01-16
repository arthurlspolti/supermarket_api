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
}

export default Product;
