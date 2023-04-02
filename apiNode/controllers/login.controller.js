import db from "../models/index.js"
import bcrypt from "bcrypt"
import axios from "axios";
import passport from "passport";
import {Strategy as JwtStrategy,ExtractJwt} from "passport-jwt";


const login = async (req, res) => {
    axios.post("http://localhost:3010/auth/login", {
        pseudo: req.body.pseudo,
        password: req.body.password
    }).then((response) => {
        res.status(200).send(response.data)
    }).catch((err) => {
        res.status(401).send({success:0,data:"nom autorisé"})
    })
}

const tokenSecret = 'mysecret'
const opts={jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey:tokenSecret}
passport.use('jwt',new JwtStrategy(opts, function(jwt_payload, done) {
    const user = jwt_payload.data
    //methode verif role
    console.log("aaa",jwt_payload.data)
    return done(null, user);
}));

const isConnected = async (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        console.log("user",err,user)
        if (err) return res.status(500).send(["erreur interne",err]);
        if (!user) return res.status(401).send({success:0,data:"not connected"});
        return res.status(200).send({success: 1, data: user})
    })(req,res)
}


// -----> il faudra deplacer la methode dans le serveur d'auth
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
                return res.status(200).send({success: 1, data: user, token: "ACHANGER"})
            }).catch(err => {
                return res.status(501).send({success: 0, data: err})
            });
        }
    });
}

export default {login, register,isConnected}