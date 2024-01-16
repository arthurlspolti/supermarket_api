import productService from "../services/productService.js";

const productController = {
  getProducts: async (req, res) => {
    const { classes } = req.query;
    const idsClasses = classes ? classes.split(",").map(Number) : [];
    try {
      const produtos = await productService.getProducts(idsClasses);
      res.json(produtos);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar produtos");
    }
  },
};

export default productController;
