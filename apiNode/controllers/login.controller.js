import db from "../models/index.js"
import bcrypt from "bcrypt"
import axios from "axios";


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

export default {login, register}