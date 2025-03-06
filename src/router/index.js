// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import ClanDetails from '../components/ClanDetails.vue'
import MemberDetails from '../components/MemberDetails.vue'
import WarsDetail from '../components/WarsDetail.vue'
import CapitalDetails from '../components/CapitalDetail.vue'


const routes = [
  { path: '/', component: HomePage },
  { path: '/clan/:clanTag', component: ClanDetails, name: 'ClanDetails' },
  {
    path: '/players/:memberTag',
    name: 'MemberDetails',
    component: MemberDetails
  },
  {
    path: '/wars/:clanTag',
    name: 'WarsDetails',
    component: WarsDetail,
  },
  {
    path: '/clan/:clanTag/CapitalRaid',
    name: 'CapitalRaid',
    component: CapitalDetails
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
