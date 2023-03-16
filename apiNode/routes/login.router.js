import express from "express";
import loginController from "../controllers/login.controller.js";
import passport from "passport";
const router = express.Router();

router.post("/login", loginController.login)

router.post("/isConnected", loginController.isConnected)

router.post("/register", loginController.register)

export default router;