import Promotion from "../models/promotion.js";

const promotionService = {
  getPromotions: async () => {
    return await Promotion.findPromotions();
  },
};

export default promotionService;
