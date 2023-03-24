import express from "express";
import UserControllers from "../controllers/UserController.js";
import AuthMiddlewares from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', UserControllers.createUser);
router.post('/login', UserControllers.loginUser);
router.get('/all-users', UserControllers.getAllUsers);
router.get('/refresh', UserControllers.handleRefreshToken);
router.get('/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, UserControllers.getUser);
router.delete('/:id', UserControllers.deleteUser);
router.put('/update-user', AuthMiddlewares.authMiddleware, UserControllers.updateUser);
router.put('/block-user/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, UserControllers.blockUser);
router.put('/unblock-user/:id', AuthMiddlewares.authMiddleware, AuthMiddlewares.isAdmin, UserControllers.unBlockUser);

export default router;