import express from "express";
import AuthMiddlewares from "../middlewares/authMiddleware.js";
import BlogController from "../controllers/BlogController.js";

const router = express.Router();

router.post('/', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, BlogController.createBlog);
router.put('/likes', AuthMiddlewares.authMiddleware, BlogController.likeBlog);
router.put('/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, BlogController.updateBlog);
router.delete('/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, BlogController.deleteBlog);
router.get('/:id', BlogController.getBlog);
router.get('/', BlogController.getAllBlogs);

export default router;