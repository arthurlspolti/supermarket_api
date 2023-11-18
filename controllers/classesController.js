// Função para buscar categorias
const buscarCategorias = async (prisma) => {
  try {
    return await prisma.Category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar categorias");
  }
};

module.exports = { buscarCategorias };
