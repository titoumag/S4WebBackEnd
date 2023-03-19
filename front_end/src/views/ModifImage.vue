<template>
    <div>
        <h1>ModifImage</h1>
            <h3>Parametres : </h3>
        <div style="display: flex">
           <div style="width: 50%; padding: 10px; border: black 1px solid">
                <input type="file" id="file" ref="inputFile" @change="newFile">
                <br>
                <img :src="image" alt="image" v-if="image!=null" style="width: 100%">
           </div>
            <div style="width: 50% ; padding: 10px; border: black 1px solid">
                <label for="gris">En noir et blanc : </label>
                <input type="checkbox" id="gris" name="gris" v-model="gris">
                <br>
                <label for="taille">Redimmensioner (en %) (100=rien) : </label>
                <input type="number" id="taille" name="taille" v-model="taille" min="20" max="300" style="border: black 1px solid">
                <br>
                <label for="enAuto">Enregistrer automatiquement image resultat : </label>
                <input type="checkbox" id="enAuto" name="enAuto" v-model="enAuto">
                <br>
            </div>
        </div>
        <br>
        <v-btn color="primary" @click="onSubmit">Changer</v-btn>
        <v-btn v-if="derniereImage!=null" color="primary" @click="enregistrer(derniereImage,derniereImageName)">Enregistrer dernière image</v-btn>
        <br>
<!--        <img :src="`data:image/png;base64,${imageFin}`" alt="image" width="200" height="200" v-if="imageFin!=null">-->
<!--        <img :src="'http://localhost:3000/tmp/'+imageFin.nomFichier" alt="image" width="200" height="200" v-if="imageFin!=null">-->
        <div>
            <h3>Sorties :</h3>
            <img v-for="(img,index) in imageFin" :key="index"
                :src="img" alt="image" style="margin: 10px; max-width: 500px">
        </div>

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
            derniereImage:null,
            derniereImageName:"",
            gris:false,
            taille:100,
            enAuto:true
        }
    },
    methods: {
        newFile() {
            let file = this.$refs.inputFile.files[0];
            if (file!==undefined)
                this.image=URL.createObjectURL(file);
            // let reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.onload = () => {
            //     this.image = reader.result;
            // }
        },
        _arrayBufferToBase64( buffer ) {
            var binary = '';
            var bytes = new Uint32Array( buffer );
            console.log(bytes)
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return window.btoa( binary );
        },
        onSubmit() {
            let file = this.$refs.inputFile.files[0];
            let formData = new FormData();
            formData.append('file', file);
            formData.append('p_gris',this.gris)
            formData.append('p_taille', this.taille)
            console.log(file)
            myaxios.post('/upload', formData, {
                responseType: 'blob'//tres tres important si on veut recevoir un blob en reponse
            }).then((response) => {
                // this.imageFin.push("http://localhost:3000/tmp/"+response.data.nomFichier +`?v=${new Date().getTime()}`)
                console.log(response)
                this.downloadFiles(response, "imageModifiee.png", "png")
            }).catch((error) => {
                console.log(error);
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
            this.imageFin.push(URL.createObjectURL(file))
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