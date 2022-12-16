import express from "express";
import standController from "../controllers/stand.controller.js";
import evenementController from "../controllers/evenement.controller.js";

var router = express.Router()
router.get("/typeStand",standController.listeTypeStand)
/**
 * @swagger
 * /stands/typeStand/:
 *  get:
 *      description: Liste touts les types de stands
 *      tags:
 *          - Stands
 *      responses:
 *          '200':
 *              description: type de stands retourné avec succés
 *          '404':
 *              description: Erreur lors de l'envoi des types de stands
 */

router.get("/",standController.listStand)
/**
 * @swagger
 * /stands/:
 *  get:
 *      description: Liste touts les stands
 *      tags:
 *          - Stands
 *      responses:
 *          '200':
 *              description: Stands retourné avec succés
 *          '404':
 *              description: Erreur lors de l'envoi des stands
 */

router.post("/",standController.newStand)
/**
 * @swagger
 * /stands/:
 *  post:
 *      description: Ajoute un stand dans la base de données
 *      tags:
 *          - Stands
 *      parameters:
 *          - in: formData
 *            name: idStand
 *            type: int
 *            required: true
 *          - in: formData
 *            name: descriptionStand
 *            type: string
 *            required: true
 *          - in: formData
 *            name: nomStand
 *            type: string
 *            required: true
 *          - in: formData
 *            name: idPrestataire
 *            type: int
 *            required: true
 *          - in: formData
 *            name: idTypeStand
 *            type: int
 *            required: true
 *      responses:
 *          '200':
 *              description: Stand ajouté avec succés
 *          '404':
 *              description: Erreur lors de l'ajout du stand
 */

router.delete("/:id",standController.deleteStand)
/**
 * @swagger
 * /stands/{id}:
 *  delete:
 *      description: Supprime un stand de la base de données
 *      tags:
 *          - Stands
 *      parameters:
 *          - in: path
 *            name: id
 *            type: integer
 *            required: true
 *      responses:
 *          '200':
 *              description: Stand supprimé avec succés
 *          '404':
 *              description: Erreur lors de la suppression du stand
 */

//route a faire avec swagger
//utilise aussi la table commantaire
router.get("/:id",standController.getStand)
/**
 * @swagger
 * /stands/{id}:
 *  get:
 *      description: Retourne le stand ayant l'id correspondant à celui du path
 *      tags:
 *          - Stands
 *      parameters:
 *          - in: path
 *            name: id
 *            type: integer
 *            required: true
 *      responses:
 *          '200':
 *              description: Stand retourné avec succés
 *          '404':
 *              description: Erreur lors de l'envoi du stand
 */
router.post("/:id/commentaire",standController.newCommentaire)
/**
 * @swagger
 * /stands/{id}/commentaire:
 *  post:
 *      description: Ajoute un commentaire à un stand
 *      tags:
 *          - Stands
 *          - Commentaires
 *      parameters:
 *          - in: path
 *            name: id
 *            type: int
 *            required: true
 *          - in: formData
 *            name: commentaire
 *            type: string
 *            required: true
 *      responses:
 *          '200':
 *              description: Commentaire ajouté avec succés au stand
 *          '404':
 *              description: Erreur lors de l'ajout du commentare au stand
 */

export default router;