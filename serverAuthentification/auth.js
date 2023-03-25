import express from "express";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as JwtStrategy,ExtractJwt} from "passport-jwt";
import bcrypt from "bcrypt";
import db from "./db.js";
import jwt from 'jsonwebtoken'
import session from "express-session";

const router = express.Router();
const tokenSecret = 'mysecret'

router.post("/login", (req,res)=>{
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).send(["erreur interne",err]);
        if (!user) return res.status(401).send({err:"Cannot log in",info});
        // req.logIn(user, function (err) {
        //     console.log("bien enrregistré",err)
        //     if (err) return res.status(500).send(["erreur interne 2",err]);
        //     return res.status(200).send({success: 1, data: user, token: generateToken(user)})
        // });
        return res.status(200).send({success: 1, data: user, token: generateToken(user)})
    })(req,res)
})

router.post("/logout", (req,res)=>{
    req.logout();
    res.status(200).send({success:1,data:"logout"})
})

router.post("/isConnected", (req,res)=>{
    // console.log(req.body)
    // console.log(req.user)
    // if (req.isAuthenticated()) {
    //     res.status(200).send({success:1,data:req.user})
    // } else {
    //     res.status(401).send({success:0,data:"not connected"})
    // }
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        console.log("user",err,user)
        if (err) return res.status(500).send(["erreur interne",err]);
        if (!user) return res.status(401).send({success:0,data:"not connected"});
        return res.status(200).send({success: 1, data: user})
        // return res.status(200).send({success: 1, data: user, token: generateToken(user)})
    })(req,res)
})

const generateToken =  (user) => {
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '1h'})
}

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

const opts={
    // jwtFromRequest: req => {
    //     console.log("dgyzhskj",req.headers)
    //     req.authorization
    // },
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:tokenSecret
}
passport.use('jwt',new JwtStrategy(opts, function(jwt_payload, done) {
    const user = jwt_payload.data
    //methode verif role
    console.log("aaa",jwt_payload.data)
    if (user) {
        return done(null, user);
    }else
        return done(null, false);
}));


/*
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
})*/

export default router;