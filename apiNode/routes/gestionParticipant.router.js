import express from "express";
import {listAllParticipant,listParticipantById,deleteParticipant,addParticipant} from "../controllers/gestionParticipant.controller.js";
import {autorisation, CONNECTE, PRESTA} from "../middleware/authentification.js";

const router = express.Router();

router.all("/allParticipant", listAllParticipant);

router.get("/listParticipantById/:id", listParticipantById);

router.delete("/deleteParticipant/:idUser/:idTournoi",autorisation(CONNECTE), deleteParticipant);

router.post("/addParticipant",autorisation(CONNECTE), addParticipant);

export default router;