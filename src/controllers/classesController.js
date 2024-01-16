import categoryService from "../services/classesService.js";

const classesController = {
  getAllClasses: async (req, res) => {
    try {
      const classes = await categoryService.getAllCategories();
      res.json(classes);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

export default classesController;
