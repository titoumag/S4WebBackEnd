import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from 'cors'
const app = express();
dotenv.config();

import session from "express-session";
import passport from "passport";
import authentificationControleur from "./auth.js";

const port = process.env.PORT;
app.use(cors())
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:3000");
//     res.header('Access-Control-Allow-Headers', true);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     next();
// });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use((req,res,next)=>{console.log(req.user,req.body); next()})
/*app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) },
}));
*/
app.use(passport.initialize());
//app.use(passport.session());
app.use((req,res,next)=>{console.log(req.user); next()})
app.use("/auth",authentificationControleur);
app.get("/*", (req, res) => {
    res.status(404).send("Page not found");
});

app.listen(port,()=>{
    console.log("Le serveur ecoute sur port " + port);
});