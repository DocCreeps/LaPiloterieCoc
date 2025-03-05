// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import ClanDetails from '../components/ClanDetails.vue'
import MemberDetails from '../components/MemberDetails.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/clan/:clanTag', component: ClanDetails },
  {
    path: '/players/:memberTag',
    name: 'MemberDetails',
    component: MemberDetails
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
