import prisma from "../lib/prisma.js";

class Promotion {
  static async findPromotions() {
    return await prisma.products.findMany({
      where: {
        discount_percentage: {
          gt: 0,
        },
      },
    });
  }
}

export default Promotion;
