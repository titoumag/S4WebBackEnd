import express from "express";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import GoogleStrategy from 'passport-google-oidc';
import bcrypt from "bcrypt";
import db from "./db.js";
import jwt from 'jsonwebtoken'
import session from "express-session";

const router = express.Router();

router.post("/login/local", (req,res)=>{
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).send(["erreur interne",err]);
        if (!user) return res.status(401).send({err:"Cannot log in",info});
        req.logIn(user, function (err) {
            console.log("bien enrregistré",err)
            if (err) return res.status(500).send(["erreur interne 2",err]);
            return res.status(200).send({success: 1, data: user, token: generateToken(user)})
        });
    })(req,res)
})

router.post("/login/google", (req,res)=>{
    passport.authenticate('google', (err, user, info) => {
        if (err) return res.status(500).send(["erreur interne",err]);
        if (!user) return res.status(401).send({err:"Cannot log in",info});
        req.logIn(user, function (err) {
            console.log("bien enrregistré",err)
            if (err) return res.status(500).send(["erreur interne 2",err]);
            return res.status(200).send({success: 1, data: user, token: generateToken(user)})
        });
    })(req,res)
})

router.post("/redirect/google", (req,res)=>{
    res.redirect('https://www.fouziquest.marrantmaispastrop.fun/');
})

router.post("/logout", (req,res)=>{
    req.logout();
    res.status(200).send({success:1,data:"logout"})
})

router.post("/isConnected", (req,res)=>{
    console.log(req.body)
    console.log(req.user)
    if (req.isAuthenticated()) {
        res.status(200).send({success:1,data:req.user})
    } else {
        res.status(401).send({success:0,data:"not connected"})
    }
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

// Utilisation Google :
// <a href="/login/google" class="button">Sign in with Google</a>
passport.use(new GoogleStrategy({
        clientID: "pseudo",
        clientSecret: "mdp",
        callbackURL: 'https://localhost:3010/redirect/google'
    }, function verify(pseudo, mdp, cb) {
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
    console.log("serializeUser",user.idUser)
    cb(null, user.idUser);
})
passport.deserializeUser(function (id, cb) {
    console.log("deserializeUser",id)
    db.user.findOne({where: {idUser: id}})
        .then(user => {
            console.log("deserializeUser",user)
            cb(null, user);
        }).catch(err => cb(err));
})

const tokenSecret = 'mysecret'
const generateToken =  (user) => {
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '1h'})
}

export default router;