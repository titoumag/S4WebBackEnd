<template>
    <div class="login-container my-5">

      <form @submit.prevent="changeHost">
        <input type="text" v-model="currentHost" id="hostname" name="hostname">
        <input type="submit" value="Changer Hostname">
      </form>
      <br><br>

        <h1>Chat with nobody TM</h1>
        <div style="overflow-y:scroll; height:400px; width:300px; background:black; color:lime;">
          <p v-for="message in data" :key="message" :style="'color:'+message[1]">> {{message[0]}}</p>
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
            currentHost:"localhost"
        }
    },
    methods: {


      sendChat() {
          if(this.texte === '') return

          this.socket.emit('message', [this.texte,this.socket.id]);
          this.texte = '';
        },

        changeHost(){
          this.socket.close();
          this.socket = io("http://"+this.currentHost+":4242");
          this.socket.on("allMessages", data => {
            this.data = data;
          });
        }
    },
    mounted() {
      this.socket = io("http://"+this.currentHost+":4242");
      this.socket.on("allMessages", data => {
        this.data = data;
      });
    },
    beforeUnmount() {
      this.socket.close();
    }
}

</script>

<style scoped>

.login-container {
    width: 350px;
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