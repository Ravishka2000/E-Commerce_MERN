import express from "express";
import ProductController from "../controllers/ProductController.js";

const router = express.Router();

router.post('/', ProductController.createProduct);

export default router;