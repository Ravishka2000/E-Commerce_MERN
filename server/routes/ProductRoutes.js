import express from "express";
import ProductController from "../controllers/ProductController.js";
import AuthMiddlewares from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post('/', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, ProductController.createProduct);
router.get('/:id', ProductController.getaProduct);
router.get('/', ProductController.getAllProducts);
router.put('/wishlist', AuthMiddlewares.authMiddleware, ProductController.addToWishlist);
router.put('/rating', AuthMiddlewares.authMiddleware, ProductController.rating);
router.put('/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, ProductController.updateProduct);
router.delete('/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, ProductController.deleteProduct);

export default router;