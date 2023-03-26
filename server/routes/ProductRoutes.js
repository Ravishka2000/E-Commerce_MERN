import express from "express";
import ProductController from "../controllers/ProductController.js";

const router = express.Router();

router.post('/', ProductController.createProduct);
router.get('/:id', ProductController.getaProduct);
router.get('/', ProductController.getAllProducts);

export default router;