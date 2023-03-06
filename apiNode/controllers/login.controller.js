import db from "../models/index.js"
import bcrypt from "bcrypt"
import {generateToken} from "../middleware/authentification.js";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";



const login = async (req, res) => {
    // const pseudo = req.body.pseudo;
    // const mdp = req.body.password;
    // passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // })
    res.send("salut")
}

passport.use(new LocalStrategy(function verify(pseudo, mdp, cb) {
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
            }).catch(err => cb(err));
        }).catch(err => cb(err));
}))


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

export default {login, register}