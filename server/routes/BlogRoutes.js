import express from "express";
import AuthMiddlewares from "../middlewares/authMiddleware.js";
import BlogController from "../controllers/BlogController.js";

const router = express.Router();

router.post('/', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, BlogController.createBlog);

export default router;