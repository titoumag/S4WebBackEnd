<template>
    <div class="login-container my-5">
        <h1>Connexion</h1>
        <img v-if="failedEnoughTimes()" style="text-align:center; width:250px; height:250px;" src="https://en.meming.world/images/en/b/b8/You_Are_Not_a_Clown._You_Are_The_Entire_Circus.jpg" alt="You are not a clown, you are the entire circus">
        <form v-if="!failedEnoughTimes()" @submit.prevent="login">
            <label for="pseudo">Nom d'utilisateur :</label>
            <input type="text" v-model="pseudo" id="pseudo" name="pseudo">
            <br>
            <label for="password">Mot de passe :</label>
            <input type="password" v-model="password" id="password" name="password">
            <br>
            <input type="submit" value="Se connecter">
        </form>

        <div v-show="!profile" id="g-signin2"></div>
        <div v-if="profile">
            <pre>{{ profile }}</pre>
            <button @click="signOut">Sign Out</button>
        </div>

        pas de compte ?
        <router-link to="/register">S'inscrire !</router-link>
    </div>
</template>

<script>
import myaxios from "@/services/axios";
import {mapMutations} from "vuex";
import {ADMIN, PRESTA, roles} from "@/services/roles";
// import axios from "axios";
// import {mapGetters, mapMutations, mapState} from "vuex";



export default {
    name: "LoginView",
    data() {
        return {
            pseudo: '',
            password: '',
            fail: 0,
            // isInit: false,
            // isSignIn: false
            profile:null
        }
    },
    methods: {
        ...mapMutations(['setCurrentUser']),

        failedEnoughTimes(){
          return this.fail >= 3;
        },

        onSignIn(user) {
            const profile = user.getBasicProfile();
            const fullName = profile.getName();
            const email = profile.getEmail();
            const imageUrl = profile.getImageUrl();
            this.profile = { fullName, email, imageUrl };
        },

        signOut() {
            var auth2 = window.gapi.auth2.getAuthInstance();
            auth2.signOut().then(() => {
                console.log("User signed out");
                this.profile = null;
            });
        },

        initGoogleAuth() {
            window.gapi.load("auth2", function () {
                window.gapi.auth2.init();
            });
        },

        renderGoogleAuthButton() {
            window.gapi.signin2.render("g-signin2", {
                onsuccess: this.onSignIn
            });
        },

        login() {
            if (this.pseudo === "") {
                this.fail++;
                alert("pas de pseudo ecrit");
                return
            }
            if (this.password === "") {
                this.fail++;
                alert("pas de password ecrit");
                return
            }
            myaxios.post('/connection/login', {
                pseudo: this.pseudo,
                password: this.password
            }).then(response => {
                if (response.data.success) {
                    let data = response.data.data;
                    data.role = roles[data.idRole];
                    data.token = response.data.token;
                    this.setCurrentUser(data);
                    this.$cookies.set("currentUser", data, "1h");
                    if (data.idRole === PRESTA) {
                        this.$router.push('/prestataire/home');
                    } else if (data.idRole === ADMIN) {
                        this.$router.push('/admin');
                    } else {
                        if (this.$route.query.redirect)
                            this.$router.push(this.$route.query.redirect);
                        else
                            this.$router.push('/user');
                    }
                } else {
                    alert(response.data.data);
                }
            }).catch(() => {
                this.fail++;
                alert('Mauvais identifiants');
            });
        }
    },
    mounted(){
        // let that = this
        // let checkGauthLoad = setInterval(function(){
        //     that.isInit = that.$gAuth.isInit
        //     that.isSignIn = that.$gAuth.isAuthorized
        //     if(that.isInit) clearInterval(checkGauthLoad)
        // }, 1000);
        this.initGoogleAuth();
        this.renderGoogleAuthButton();

    }
}

</script>

<style scoped>

.login-container {
    width: 300px;
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