import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../components/HomePage.vue')
  },
  {
    path: '/clan/:clanTag',
    component: () => import(/* webpackChunkName: "clan-details" */ '../components/ClanDetails.vue'),
    name: 'ClanDetails'
  },
  {
    path: '/players/:memberTag',
    name: 'MemberDetails',
    component: () => import(/* webpackChunkName: "member-details" */ '../components/MemberDetails.vue')
  },
  {
    path: '/wars/:clanTag',
    name: 'WarsDetails',
    component: () => import(/* webpackChunkName: "wars-details" */ '../components/WarsDetail.vue')
  },
  {
    path: '/clan/:clanTag/CapitalRaid',
    name: 'CapitalRaid',
    component: () => import(/* webpackChunkName: "capital-details" */ '../components/CapitalDetail.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
