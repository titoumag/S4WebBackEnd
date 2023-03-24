import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();


dotenv.config();
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from 'cors'
// import fileUpload from 'express-fileupload';
import modifImage from "./modifImage.js";

const port = process.env.PORT;
import users from './routes/user.router.js';
import evenements from './routes/evenement.router.js';
import stands from './routes/stand.router.js';
import produits from './routes/produit.router.js';
import boutique from './routes/boutique.router.js';
import reserverProduits from "./routes/reserverProduit.router.js";
import loginRouter from "./routes/login.router.js";
import mailRouter from "./routes/mail.router.js";
import gestionTournoiRouter from "./routes/gestionTournoi.router.js";
import gestionParticipantRouter from "./routes/gestionParticipant.router.js";

/** Swagger Initialization - START */
const swaggerOption = {
    swaggerDefinition: (swaggerJsdoc.Options = {
        info: {
            title: "my-notes app",
            description: "API documentation",
            servers: ["http://localhost:3000/"],
        },
    }),
    apis: ["server.js", "./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOption);

app.use(cors())

// app.use(express.static('public'));
app.use('/tmp',express.static('tmp'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //?

app.use("/users",users);
app.use("/evenements",evenements);
app.use("/stands",stands);
app.use("/produits",produits);
app.use("/boutique",boutique);
app.use("/reservations",reserverProduits);
app.use("/connection",loginRouter);
app.use("/mail", mailRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/gestionTournoi",gestionTournoiRouter);
app.use("/gestionParticipant",gestionParticipantRouter);

app.post("/upload",modifImage)

app.get("/",(req, res)=>{
    res.status(200).send("salutHome");
})

app.get("/*", (req, res) => {
    res.status(404).send("Page not found");
});

app.listen(port,()=>{
    console.log("Le serveur ecoute sur port " + port);
});
