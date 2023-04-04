import express from "express";
import AuthMiddlewares from "../middlewares/authMiddleware.js";
import BlogCategoryController from "../controllers/BlogCategoryController.js";

const router = express.Router();

router.post('/', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, BlogCategoryController.createCategory);
router.put('/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, BlogCategoryController.updateCategory);
router.delete('/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, BlogCategoryController.deleteCategory);
router.get('/', AuthMiddlewares.authMiddleware, BlogCategoryController.getAllCategory);
router.get('/:id', AuthMiddlewares.authMiddleware, BlogCategoryController.getACategory);

export default router;