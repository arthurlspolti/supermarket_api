import { Router } from "express";
import classesController from "../controllers/classesController.js";
import productController from "../controllers/productController.js";
import promotionController from "../controllers/promotionController.js";
import shoppingRouteController from "../controllers/shoppingRouteController.js";
import userController from "../controllers/userController.js";

const router = Router();

router.get("/classes", classesController.getAllClasses);

router.get("/products", productController.getProducts);
router.post("/products", productController.addProduct);
router.put("/products", productController.updateProduct);

router.get("/promotions", promotionController.getPromotions);

router.post("/shoppingroutes", shoppingRouteController.getShoppingRoutes);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/users", userController.updateUser);

export default router;
