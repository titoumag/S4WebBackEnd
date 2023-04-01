import express from "express";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
// import GoogleStrategy from 'passport-google-oidc';
// import {Strategy as GoogleStrategy} from 'passport-google';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as JwtStrategy,ExtractJwt} from "passport-jwt";
import bcrypt from "bcrypt";
import db from "./db.js";
import jwt from 'jsonwebtoken'
import session from "express-session";

const router = express.Router();
const tokenSecret = 'mysecret'

router.post("/login/local", (req,res)=>{
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).send(["erreur interne",err]);
        if (!user) return res.status(401).send({err:"Cannot log in",info});
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

//-----------------partie locale----------------

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
                } else {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
            });
        }).catch(err => cb(err));
}))

//-----------------partie google----------------

router.get("/google",passport.authenticate('google',{ scope: ['email'] }))
router.get("/redirect/google", passport.authenticate('google'),
    (req,res)=>{
        // console.log(req.body)
        // console.log(req.user)
        // res.json(req.user)
        if (req.isAuthenticated())
            res.status(200).send({success:1,data:req.user})
            // res.redirect("http://localhost:3000/")
        else
            res.status(401).send({err:"Cannot log in"});
            // res.redirect("http://localhost:3000/login")
    })

// Utilisation Google :
// <a href="/login/google" class="button">Sign in with Google</a>
passport.use(new GoogleStrategy({
        clientID: "352336312565-2m85js8n5mm6u4oeq0idls53noks5h2b.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: 'http://localhost:3010/auth/redirect/google'
    }, function verify(accessToken, refreshToken, profile, cb) {
            const email = profile._json.email
            db.user.findOne({where: {email: email}})
                .then(user => {
                    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
                    else
                        return cb(null, user);
                }).catch(err => cb(err));
}))
passport.serializeUser(function (user, cb) {
    cb(null, user);
})
passport.deserializeUser(function (id, cb) {
    console.log("deserializeUser",id)
    cb(null,id)
})

//---------------partie JWT------------------

const generateToken =  (user) => {
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '1h'})
}

const opts={
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

export default router;