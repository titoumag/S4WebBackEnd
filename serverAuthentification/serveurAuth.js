import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
const app = express();
dotenv.config();

import session from "express-session";
import passport from "passport";
import authentificationControleur from "./auth.js";

const port = process.env.PORT;
// app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth",authentificationControleur);
app.get("/*", (req, res) => {
    res.status(404).send("Page not found");
});

app.listen(port,()=>{
    console.log("Le serveur ecoute sur port " + port);
});