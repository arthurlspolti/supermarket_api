import Category from "../models/classes.js";

const categoryService = {
  getAllCategories: async () => {
    return await Category.findAll();
  },
};

export default categoryService;
