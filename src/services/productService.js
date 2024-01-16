import Product from "../models/product.js";

const productService = {
  getProducts: async (idsClasses) => {
    return await Product.findMany(idsClasses);
  },
};

export default productService;
