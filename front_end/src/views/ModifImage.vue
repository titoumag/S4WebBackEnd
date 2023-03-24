<template>
    <div>
        <h1 style="text-align: center">ModifImage</h1>
        <v-container style="display: flex">
           <div style="width: 50%; padding: 10px; border: black 1px solid">
                <input type="file" id="file" ref="inputFile" @change="newFile" accept="image/*">
                <br>
                <img :src="image" alt="image" v-if="image!=null" style="max-width: 100%; max-height: 300px">
               <br>
               <v-btn color="primary" @click="onSubmit" v-if="image!=null">Changer</v-btn>
           </div>
            <div style="width: 50% ; padding: 10px; border: black 1px solid">
                <div>
                    <div v-for="(champ,index) in champs" :key="index">
                        <label :for="champ.nom">{{champ.texte}} : </label>
                        <input :type="champ.type" :id="champ.nom" :name="champ.nom" v-model="champ.valeur" :min="champ.min" :max="champ.max">
                        <br>
                    </div>
                    <v-select label="Extraire couleur :" v-model="rgb" :items="['Pas de changement', 'Rouge', 'Vert', 'Bleu']" />
                </div>
                <hr>
                    <h3>Information sur l'image :</h3>
                    <p>{{textInfo}}</p>
                <hr>
                    <label for="enAuto">Enregistrement automatique des images : </label>
                    <input type="checkbox" id="enAuto" name="enAuto" v-model="enAuto">
                <p>Cliquer sur une image pour la télécharger</p>
<!--                    <v-btn v-if="imageFin.length>0" color="primary" @click="enregistrer(derniereImage,derniereImageName)">Enregistrer dernière image</v-btn>-->
            </div>
        </v-container>
        <v-row>
            <v-col v-for="(img,index) in imageFin" :key="index" cols="3">
                <img :src="img.img" alt="image"
                    @click="enregistrer(img.file,img.nom)" style="margin: 20px; width: 100%">
            </v-col>
        </v-row>

    </div>
</template>

<script>
import myaxios from '../services/axios.js'

export default {
    name: "ModifImage",
    data() {
        return {
            image: null,
            imageFin: [],
            enAuto:false,
            textInfo:"",

            champs:[
                {nom:"gris",type:"checkbox",valeur:false,texte:"En ton de gris"},
                {nom:"tailleP",type:"number",valeur:100, texte: "Redimmensioner (en %) (100=rien)",min:20,max:300},
                {nom:"binaire",type:"checkbox",valeur:false, texte: "En noir et blanc (binaire)"},
                {nom:"inversion",type:"checkbox",valeur:false, texte: "Inversion"},
                {nom:"flou",type:"number",valeur:0, texte: "Flou",min:0,max:20},
                {nom:"rotation",type:"number",valeur:0, texte: "Rotation (en °) (sens horaire) (0=rien)",min:-180,max:180},
                {nom:"retourX",type:"checkbox",valeur:false, texte: "Retourner en X"},
                {nom:"retourY",type:"checkbox",valeur:false, texte: "Retourner en Y"},
                {nom:"modifLong", type: "number", valeur: 0, texte: "Changer la longueur"},
                {nom:"modifLarg", type: "number", valeur: 0, texte: "Changer la hauteur"},
            ],
            rgb:""
        }
    },
    methods: {
        newFile() {
            let file = this.$refs.inputFile.files[0];
            if (file!==undefined) {
                this.image = URL.createObjectURL(file);
                console.log(file)

                let formData = new FormData();
                formData.append('file', file);
                myaxios.post('/upload?info', formData).then((response) => {
                    response.data.taille = file.size/1000000 +"Mo"
                    this.textInfo = response.data
                    this.champs.find(champ=>champ.nom==="modifLong").valeur=response.data.width
                    this.champs.find(champ=>champ.nom==="modifLarg").valeur=response.data.height
                }).catch((error) => {
                    console.log(error)
                    alert("impossible d'envoyer les données au serveur")
                })
            }else
                this.image=null
        },
        onSubmit() {
            let file = this.$refs.inputFile.files[0];
            // console.log(file)
            let formData = new FormData();
            formData.append('file', file);
            formData.append('rgb', this.rgb)
            console.log(formData)
            for (let champ of this.champs){
                formData.append(champ.nom,champ.valeur)
            }
            myaxios.post('/upload', formData, {
                responseType: 'blob'//tres tres important si on veut recevoir un blob en reponse
            }).then((response) => {
                this.downloadFiles(response, "imageModifiee.png", "png")
            }).catch((error) => {
                console.log(error)
                alert("impossible d'envoyer les données au serveur")
            })
        },
        enregistrer(file,file_name){
            if (window.navigator.msSaveOrOpenBlob)
                window.navigator.msSaveOrOpenBlob(file, file_name);
            else {
                var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = file_name;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        downloadFiles(data, file_name) {
            var file = data.data
            this.imageFin.push({img:URL.createObjectURL(file),file:file,nom:file_name})
            this.derniereImage=file
            this.derniereImageName=file_name
            if(this.enAuto) {
                this.enregistrer(file,file_name)
            }
        }
    }
}
</script>

<style scoped>
</style>