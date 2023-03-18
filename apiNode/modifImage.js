import fileUpload from "express-fileupload";
import express from "express";
import {Image} from "image-js";

const router = express.Router();
const __dirname = process.cwd()+"\\tmp\\"

router.use(fileUpload({debug:true}))
router.use(async (req, res) => {
    // console.log(`${process.cwd()}\\tmp`)
        console.log(req.files)
        console.log(req.body)
        const file = req.files.file
        console.log(file.data)
        console.log(typeof file.data)
        await file.mv(__dirname+file.name)
        console.log("fin")

        const image = await Image.load(__dirname+file.name);
        const newImage = image.grey();
        newImage.save(__dirname+file.name);

        res.status(200).send({message:"ok",nomFichier:file.name,size:file.size});
        // res.status(200).sendFile(__dirname+file.name,{
        //     headers: {
        //         'Content-Type': 'image/png',
        //         'Content-Disposition': 'attachment; filename="image.png"'
        //     }
        // })
})

export default router;