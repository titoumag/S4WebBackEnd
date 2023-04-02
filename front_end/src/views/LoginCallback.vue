<template>
    <div>
        <h1>LoginCallback</h1>
            <h2 v-if="created">Compte créé avec google</h2>
            <h2 v-else>Compte existant, connecté avec google</h2>
            <pre>{{ user }}</pre>
    </div>
</template>

<script>
import {mapMutations} from "vuex";
import {ADMIN, PRESTA, roles} from "@/services/roles";

export default {
    name: "LoginCallback",
    data:()=>({
           user: null,
            created: false
        }),
    methods: {
        ...mapMutations(['setCurrentUser']),
    },
    created() {
        this.user= JSON.parse(this.$route.query.user);
        this.createdd = this.user.created;
        const data=this.user;
        data.role = roles[data.idRole];
        data.token = this.$route.query.token;
        this.setCurrentUser(data);
        this.$cookies.set("currentUser", data, "1h");
        if (data.idRole === PRESTA) {
            this.$router.push('/prestataire/home');
        } else if (data.idRole === ADMIN) {
            this.$router.push('/admin');
        } else {
            if (this.createdd)
                this.$router.push('/user?new=true');
            else
                this.$router.push('/user');
        }
    }
}
</script>

<style scoped>

</style>