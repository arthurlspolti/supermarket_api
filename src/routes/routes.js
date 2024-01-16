import { Router } from "express";
import classesController from "../controllers/classesController.js";
import productController from "../controllers/productController.js";

const router = Router();

router.get("/classes", classesController.getAllClasses);

router.get("/products", productController.getProducts);

export default router;
