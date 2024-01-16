import ShoppingRoute from "../models/shoppingRoute.js";

const shoppingRouteService = {
  getShoppingRoutes: async (idsProdutos) => {
    const produtos = await ShoppingRoute.findProductsByIds(idsProdutos);
    const produtosAdicionais = await buscarProdutosAdicionais(
      produtos,
      idsProdutos
    );
    const todosProdutos = [...produtos, ...produtosAdicionais];
    const todasCategorias = await ShoppingRoute.findAllCategories();
    const produtosAgrupados = agruparProdutos(
      todosProdutos,
      idsProdutos,
      todasCategorias
    );
    return produtosAgrupados;
  },
};

export default shoppingRouteService;
