import Vue from 'vue'
import VueRouter from 'vue-router'
import CarteView from '../views/CarteView.vue'
import AccueilView from "@/views/AccueilView";
import StandDetailView from "@/views/StandDetailView";
import StandView from "@/views/StandView";
import EvenementView from "@/views/EvenementView.vue";
import LoginView  from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/carte',
    name: 'carte',
    component: CarteView
  },
  {
    path: '/',
    name: 'Accueil',
    component: AccueilView
  },
  {
    path: '/stand/:id',
    name: 'stand',
    component: StandDetailView
  },
  {
    path: '/stand',
    name: 'stands',
    component: StandView
  },
  {
    path: '/evenement',
    name: 'evenement',
    component: EvenementView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path:'/boutique/:idStand',
    name:'boutique',
    component: () => import('../views/BoutiqueView.vue'),
    props: route => ({ idStand: parseInt(route.params.idStand) })
  },
  {
    path:'/reservations',
    name:'reservation',
    component: () => import('../views/ReserverProduitView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
