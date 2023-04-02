import express from "express";
import loginController from "../controllers/login.controller.js";
import {autorisation, CONNECTE, PRESTA} from "../middleware/authentification.js";
const router = express.Router();

//router.post("/login", loginController.login)

router.post("/isConnected",autorisation(CONNECTE), (req,res)=>{
    return res.status(200).send({success: 1, data: req.user})
})

router.post("/register", loginController.register)

export default router;