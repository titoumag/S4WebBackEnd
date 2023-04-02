import express from "express";
import {add,deleteTournoi,editTournoiInfos ,createTournoi, modifStatus,deleteUser,genereArbre, generationTournoi, majTourTounois,listById} from "../controllers/gestionTournoi.controller.js";
import {autorisation, CONNECTE, PRESTA} from "../middleware/authentification.js";


const router = express.Router();
router.get("/:idTournoi",autorisation(PRESTA),genereArbre)

//fin inscription
router.post("/:idTournoi",autorisation(PRESTA),generationTournoi)

router.get("/maj/:idTour",autorisation(PRESTA), majTourTounois)

router.get("/getById/:id", listById)

//inscription tournoi
router.post("/",autorisation(CONNECTE), add)

router.post("/tournoi/create",autorisation(PRESTA), createTournoi)

router.delete("/:idTournoi/:idUser",autorisation(CONNECTE), deleteUser)

router.patch("/:id/status",autorisation(PRESTA), modifStatus)

router.delete("/:id",autorisation(PRESTA), deleteTournoi)

router.patch("/:id",autorisation(PRESTA), editTournoiInfos)

export default router;