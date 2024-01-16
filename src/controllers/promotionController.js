import promotionService from "../services/promotionService.js";

const promotionController = {
  getPromotions: async (req, res) => {
    try {
      const promocoes = await promotionService.getPromotions();
      res.json(promocoes);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
};

export default promotionController;
