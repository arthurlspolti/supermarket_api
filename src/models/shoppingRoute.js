import prisma from "../lib/prisma.js";

class ShoppingRoute {
  static async findProductsByIds(idsProdutos) {
    return await prisma.products.findMany({
      where: {
        id: {
          in: idsProdutos,
        },
      },
      include: {
        Category: true,
      },
    });
  }

  static async findAllCategories() {
    return await prisma.category.findMany({
      orderBy: {
        localization: "asc",
      },
    });
  }
}

export default ShoppingRoute;
