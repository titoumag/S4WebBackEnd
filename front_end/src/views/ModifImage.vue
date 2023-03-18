<template>
    <div>
        <h1>ModifImage</h1>
        <input type="file" id="file" ref="inputFile" @change="newFile">
        <br>
        <img :src="image" alt="image" width="200" height="200" v-if="image!=null">
        <br>
<!--        <img :src="`data:image/png;base64,${imageFin}`" alt="image" width="200" height="200" v-if="imageFin!=null">-->
<!--        <img :src="'http://localhost:3000/tmp/'+imageFin.nomFichier" alt="image" width="200" height="200" v-if="imageFin!=null">-->
        <img :src="imageFin" alt="image" width="200" height="200" v-if="imageFin!=null">
        <br>
        <v-btn color="primary" @click="onSubmit">Changer</v-btn>

    </div>
</template>

<script>
import myaxios from '../services/axios.js'

export default {
    name: "ModifImage",
    data() {
        return {
            image: null,
            imageFin: null
        }
    },
    methods: {
        newFile() {
            let file = this.$refs.inputFile.files[0];
            // let reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.onload = () => {
            //     this.image = reader.result;
            // }
            this.image=URL.createObjectURL(file);
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
            formData.append('test',"hrgnrjkghntfklf")
            console.log(file)
            myaxios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                // this.imageFin =HTMLImageElement.("http://localhost:3000/tmp/"+response.data.nomFichier)
                this.imageFin ="http://localhost:3000/tmp/"+response.data.nomFichier +`?v=${new Date().getTime()}`
                // console.log(this.imageFin)
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>

<style scoped>

</style>