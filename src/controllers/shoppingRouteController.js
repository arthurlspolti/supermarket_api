import shoppingRouteService from "../services/shoppingRouteService.js";

const shoppingRouteController = {
  getShoppingRoutes: async (req, res) => {
    try {
      const idsProdutos = req.body;
      const produtosAgrupados = await shoppingRouteService.getShoppingRoutes(
        idsProdutos
      );
      res.json(produtosAgrupados);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Um erro ocorreu durante o seu request." });
    }
  },
};

export default shoppingRouteController;
