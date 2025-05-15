import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../pages/HomePage.vue')
  },
  {
    path: '/clan/:clanTag',
    component: () => import(/* webpackChunkName: "clan-details" */ '../pages/ClanDetails.vue'),
    name: 'ClanDetails'
  },
  {
    path: '/players/:memberTag',
    name: 'MemberDetails',
    component: () => import(/* webpackChunkName: "member-details" */ '../pages/MemberDetails.vue')
  },
  {
    path: '/wars/:clanTag',
    name: 'WarsDetails',
    component: () => import(/* webpackChunkName: "wars-details" */ '../pages/WarsDetail.vue')
  },
  {
    path: '/clan/:clanTag/CapitalRaid',
    name: 'CapitalRaid',
    component: () => import(/* webpackChunkName: "capital-details" */ '../pages/CapitalDetail.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
