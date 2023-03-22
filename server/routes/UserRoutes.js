import express from "express";
import UserControllers from "../controllers/UserController.js";

const router = express.Router();

router.post('/register', UserControllers.createUser);
router.post('/login', UserControllers.loginUser);

export default router;