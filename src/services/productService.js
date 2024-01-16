import Product from "../models/product.js";
import Category from "../models/classes.js";

const productService = {
  getProducts: async (idsClasses) => {
    return await Product.findMany(idsClasses);
  },

  addProduct: async (data) => {
    const categoryExists = await Category.findUnique(data.category);
    if (!categoryExists) {
      return {
        status: 400,
        message: "A categoria informada não existe no banco de dados.",
      };
    }
    const novoProduto = await Product.createProduct(data);
    return {
      status: 201,
      message: "Produto adicionado com sucesso!",
      data: novoProduto,
    };
  },

  updateProduct: async (id, data) => {
    const produtoExistente = await Product.findUnique(id);
    if (!produtoExistente) {
      throw new Error("Produto não encontrado");
    }
    const produtoAtualizado = await Product.updateProduct(id, data);
    return produtoAtualizado;
  },
};

export default productService;
