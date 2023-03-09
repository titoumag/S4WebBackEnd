import express from "express";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcrypt";
import db from "./db.js";
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post("/login", (req,res)=>{
    passport.authenticate('local', (err, user, info) => {
        console.log("ok")
        console.log(err,user,info)
        if (err) return res.status(401).send(["erreur interne",err]);
        if (!user) return res.status(401).send({err:"Cannot log in",info});
        req.logIn(user, function (err) {
            if (err) return res.status(401).send(["erreur interne 2",err]);
            return res.status(200).send({success: 1, data: user, token: generateToken(user)})
        });
    })(req,res)
})



passport.use(new LocalStrategy({
    usernameField: 'pseudo',
    passwordField: 'password'
},function verify(pseudo, mdp, cb) {
    db.user.findOne({where: {pseudo: pseudo}})
        .then(user => {
            if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
            bcrypt.compare(mdp, user.password, function (err, result) {
                if (result) {
                    return cb(null, user);
                    // return res.status(200).send({success: 1, data: user, token: generateToken(user)})
                } else {
                    // return res.status(403).send({success: 0, data: "wrong password"})
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
            });
        }).catch(err => cb(err));
}))

passport.serializeUser(function (user, cb) {
    cb(null, user.idUser);
})
passport.deserializeUser(function (id, cb) {
    db.user.findOne({where: {idUser: id}})
        .then(user => {
            cb(null, user);
        }).catch(err => cb(err));
})

const tokenSecret = 'mysecret'
const generateToken = (user) => {
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '1h'})
}

export default router;