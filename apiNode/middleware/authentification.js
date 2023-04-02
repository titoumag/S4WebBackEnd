import jwt from 'jsonwebtoken'

const tokenSecret = 'mysecret'
const ADMIN = 1, PRESTA = 2, CONNECTE = 3, VISITEUR = 0

const autorisation = (niveau)=>{
    if (niveau===VISITEUR){
        return (req, res, next) => {
            next()
        }
    }else {
        return (req, res, next) => {
            const token = req.headers.authorization
            if (!token) res.status(403).json({error: "please provide a token"})
            else {
                jwt.verify(token, tokenSecret, (err, decoded) => {
                    if (err) res.status(403).json({error: "invalid token"})
                    else {
                        req.user = decoded.data
                        if (niveau === ADMIN && req.user.idRole !== ADMIN) res.status(403).json({error: "vous n'avez pas les droits admins"})
                        else if (niveau === PRESTA && req.user.idRole > PRESTA) res.status(403).json({error: "vous n'avez pas les droits prestataires"})
                        else next()
                    }
                })
            }
        }
    }
}

export {autorisation, ADMIN, PRESTA, CONNECTE, VISITEUR}