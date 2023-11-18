// Função para buscar promoções
const buscarPromocoes = async (prisma) => {
  try {
    return await prisma.Products.findMany({
      where: {
        discount_percentage: {
          gt: 0,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar promoções");
  }
};

module.exports = { buscarPromocoes };
