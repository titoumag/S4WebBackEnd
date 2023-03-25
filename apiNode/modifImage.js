import fileUpload from "express-fileupload";
import express from "express";
import {Image} from "image-js";
import fs from "fs";

const router = express.Router();
const __dirname = process.cwd() + "\\tmp\\"

var number = 0;

router.use(fileUpload())
router.use(async (req, res) => {
    const param = req.body
    const file = req.files.file
    if (file===undefined) res.status(400).send("no file")
    const i = file.name.lastIndexOf(".")
    const newNom = file.name.substring(0, i) + "_" + number + file.name.substring(i)

    await file.mv(__dirname + newNom)
    var image = await Image.load(__dirname + newNom);

    Object.keys(param).forEach((key) => {
        if (param[key] === "true") param[key] = true
        else if (param[key] === "false") param[key] = false
        else if (!isNaN(param[key])) param[key] = Number(param[key])
    })

    if(req.query.info===""){
        res.status(200).send({
            width: image.width,
            height: image.height,
            colorModel: image.colorModel,
            components: image.components,
            alpha: image.alpha,
            channels: image.channels,
            bitDepth: image.bitDepth
        })
        fs.unlink(__dirname + newNom, (err) => {
            if (err) console.log(err)
        })
    }
    else{
        image = traitement(image, param)
        await image.save(__dirname + newNom);
        // var stream = fs.createReadStream('TEST.txt')
        // stream.pipe(response)

        res.status(200).sendFile(__dirname + newNom, () => {
            fs.unlink(__dirname + newNom, (err) => {
                if (err) console.log(err)
            })
        })
    }
    number++;

})

function traitement(image, param) {
    if (param.tailleP!==100) //en premier pour reduire calculs suivants
        image = image.resize({factor: param.tailleP/100});
    if ((param.modifLong!==image.width || param.modifLarg!==image.height) && param.tailleP===100)
        image = image.resize({width: param.modifLong, height: param.modifLarg});
    if (param.inversion)  image = image.invert();
    if (param.retourX)  image = image.flipX();
    if (param.retourY)  image = image.flipY();
    if (param.rotation!==0)  image = image.rotate(param.rotation);
    if (param.flou!==0) {
        image = image.gaussianFilter({radius:parseInt(param.flou/3+1),sigma:param.flou});
    //     console.log("ghjkl")
    }
    if (param.binaire) {
        image = image.grey();
        image = image.mask();
    }
    if (param.gris) image = image.grey();
    if (["Rouge","Vert","Bleu"].includes(param.rgb))
        image = image.split()[["Rouge","Vert","Bleu"].indexOf(param.rgb)]
    return image;
}

export default router;