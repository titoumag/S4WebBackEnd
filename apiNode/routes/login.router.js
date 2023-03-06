import express from "express";
import loginController from "../controllers/login.controller.js";
import passport from "passport";
const router = express.Router();

router.post("/login",
    passport.authenticate('local', { failureRedirect: '/' })
    ,loginController.login)

router.post("/register", loginController.register)

export default router;