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

  addProduct: async (req, res) => {
    const { name, category, base_price, discount_percentage, image_url } =
      req.body;
    const data = { name, category, base_price, discount_percentage, image_url };
    try {
      const result = await productService.addProduct(data);
      res.status(result.status).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao adicionar produto ao banco de dados.");
    }
  },

  updateProduct: async (req, res) => {
    const { id, name, category, base_price, discount_percentage, image_url } =
      req.body;
    const data = { name, category, base_price, discount_percentage, image_url };
    try {
      if (!id) {
        throw new Error("O campo id é obrigatório");
      }
      const produtoAtualizado = await productService.updateProduct(id, data);
      res.status(200).json(produtoAtualizado);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
};

export default productController;
