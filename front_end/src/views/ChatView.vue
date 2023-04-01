<template>
    <div class="login-container my-5">

      <form @submit.prevent="changeHost">
        <input type="text" v-model="currentHost" id="hostname" name="hostname">
        <input type="submit" value="Changer Hostname">
      </form>
      <br>
      <form @submit.prevent="changeInfos">
        <label for="name">Name</label>
        <input type="text" v-model="currentName" id="name" name="name">

        <label for="colorR">Red</label>
        <input type="range" min="0" max="255" step="1" v-model="currentColorR" id="colorR" name="colorR">

        <label for="colorG">Green</label>
        <input type="range" min="0" max="255" step="1" v-model="currentColorG" id="colorG" name="colorG">

        <label for="colorB">Blue</label>
        <input type="range" min="0" max="255" step="1" v-model="currentColorB" id="colorB" name="colorB">
        <p :style="'background-color:black; color:rgb('+currentColorR+','+currentColorG+','+currentColorB+')'">test</p>

        <input type="submit" value="Changer Infos">
      </form>
      <br><br>

        <h1>Chat with nobody TM</h1>
        <div style="overflow-y:scroll; height:400px; width:600px; background:black; color:lime;">
          <p v-for="message in data" :key="message" :style="'color:'+convertToColor(clientsInfos[message[1]].color)">{{clientsInfos[message[1]].name}}> {{message[0]}}</p>
        </div>
        <br>
       <form @submit.prevent="sendChat">
            <input type="text" v-model="texte" id="texte" name="texte">
            <input type="submit" value="Envoyer">
         </form>
    </div>
</template>

<script>
import {io} from "socket.io-client";
// import {mapGetters, mapMutations, mapState} from "vuex";

export default {
    name: "ChatView",
    data() {
        return {
            texte: '',
            data:[],
            socket:null,
            currentHost:"localhost",
            clientsInfos:[],
            currentName:"User",
            currentColorR:0,
            currentColorG:0,
            currentColorB:0,
        }
    },
    methods: {

      convertToColor(color){
        return "rgb("+color.r+","+color.g+","+color.b+")";
      },

      sendChat() {
          if(this.texte === '') return

          this.socket.emit('message', [this.texte,this.socket.id]);
          this.texte = '';
        },

        changeInfos(){
          if(this.currentName == null || this.currentName === "") return;
          this.socket.emit("newUserInfos",{id:this.socket.id,name:this.currentName,color:{r:this.currentColorR,g:this.currentColorG,b:this.currentColorB}});
        },

        changeHost(){
          this.socket.close();
          this.socket = io("http://"+this.currentHost+":4242");
          this.socket.on("allMessages", data => {
            this.data = data[0];
            this.clientsInfos = data[1];
          });
          this.socket.on("userData", data => {
            if(data.id === this.socket.id){
              this.currentName = data.name;
              this.currentColorR = data.color.r;
              this.currentColorG = data.color.g;
              this.currentColorB = data.color.b;
            }
          });
        }
    },
    mounted() {
      this.socket = io("http://"+this.currentHost+":4242");
      this.socket.on("allMessages", data => {
        this.data = data[0];
        this.clientsInfos = data[1];
      });
      this.socket.on("userData", data => {
        if(data.id === this.socket.id){
          this.currentName = data.name;
          this.currentColorR = data.color.r;
          this.currentColorG = data.color.g;
          this.currentColorB = data.color.b;
        }
      });
    },
    beforeUnmount() {
      this.socket.close();
    }
}

</script>

<style scoped>

.login-container {
    width: 650px;
    margin: 0 auto;
    border: 1px solid #ccc;
    padding: 20px;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-top: 10px;
}

input[type="text"], input[type="password"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

input[type="submit"] {
    background-color: #4CAF50;
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

input[type="submit"]:hover {
    background-color: #45a049;
}

</style>