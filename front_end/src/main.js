import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'
import DatetimePicker from 'vuetify-datetime-picker'

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.use(DatetimePicker)
// import GAuth from 'vue-google-oauth2'
// Vue.use(GAuth, {clientId: ""})
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
