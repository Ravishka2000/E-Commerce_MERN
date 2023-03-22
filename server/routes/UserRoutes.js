import express from "express";
import UserControllers from "../controllers/UserController.js";

const router = express.Router();

router.post('/register', UserControllers.createUser);
router.post('/login', UserControllers.loginUser);
router.get('/all-users', UserControllers.getAllUsers);
router.get('/:id', UserControllers.getUser);
router.delete('/:id', UserControllers.deleteUser);
router.put('/:id', UserControllers.updateUser);

export default router;