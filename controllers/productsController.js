// Função para buscar produtos
const buscarProdutos = async (prisma, idsClasses) => {
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
};

module.exports = { buscarProdutos };
