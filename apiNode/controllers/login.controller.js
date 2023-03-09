import db from "../models/index.js"
import bcrypt from "bcrypt"
import {generateToken} from "../middleware/authentification.js";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";



const login = async (req, res) => {
    console.log("ok")
    res.status(200).send({success: 1, data: req.user, token: generateToken(req.user)})
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

passport.serializeUser(function (user, cb) {
    cb(null, user.idUser);
})
passport.deserializeUser(function (id, cb) {
    db.user.findOne({where: {idUser: id}})
        .then(user => {
            cb(null, user);
        }).catch(err => cb(err));
})

 const verificationDroit2 = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);

        if (!user)
            return res.status(400).send([user, "Cannot log in", info]);

        req.logIn(user, function (err) {
            if (err) return next(err);

            next()
        });
            // return res.send("Logged in");
    })(req,res,next)
}

const register = async (req, res) => {
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const pseudo = req.body.pseudo;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.idRole;
    const isNotif = req.body.isNotif;
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            return res.status(500).send({success: 0, data: err})
        } else {
            db.user.create({
                nom: nom,
                prenom: prenom,
                pseudo: pseudo,
                password: hash,
                email: email,
                isNotif: isNotif,
                idRole: role
            }).then(user => {
                return res.status(200).send({success: 1, data: user, token: generateToken(user)})
            }).catch(err => {
                return res.status(501).send({success: 0, data: err})
            });
        }
    });
}

export default {login, register,verificationDroit2}