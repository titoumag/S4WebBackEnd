import fileUpload from "express-fileupload";
import express from "express";
import {Image} from "image-js";
import fs from "fs";

const router = express.Router();
const __dirname = process.cwd()+"\\tmp\\"

var number = 0;

router.use(fileUpload({debug:true}))
router.use(async (req, res) => {
    // console.log(`${process.cwd()}\\tmp`)
    //     console.log(req.files)
        const param = req.body
        console.log(param)
        const file = req.files.file
        const i = file.name.lastIndexOf(".")
        const newNom = file.name.substring(0,i)+"_"+number+file.name.substring(i)
        // console.log(file.data)
        // console.log(typeof file.data)
        await file.mv(__dirname+newNom)
        console.log("fin")

        var image = await Image.load(__dirname+newNom);
        if (param.p_gris==="true")
            image = image.grey();
        console.log(__dirname+newNom)
        await image.save(__dirname + newNom);
        number++;
            // setTimeout(()=>{
            //         fs.unlink(__dirname+newNom,(err)=>{if (err) console.log(err)})
            // },1000*30)

        // res.status(200).send({message:"ok",nomFichier:newNom,size:file.size,width:image.width,height:image.height});
        res.status(200).sendFile(__dirname+newNom,()=>{
                fs.unlink(__dirname+newNom,(err)=>{if (err) console.log(err)})
        })
        // res.download(__dirname+newNom)
})

export default router;