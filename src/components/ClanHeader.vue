<template>
  <div class="flex flex-col lg:flex-row w-full mb-4 lg:mb-0" v-if="clan">
    <ClanInfo :clan="clan" :icons="icons" :leagues="leagues" :unrankedLeagueIcon="unrankedLeagueIcon" @goToWarsDetail="goToWarsDetail" @goToCapitalRaid="goToCapitalRaid" />
    <ClanDescription :clan="clan" :icons="icons" />
    <WarStats :clan="clan" />
  </div>
  <div v-else>
    <p>Chargement des informations du clan...</p>
  </div>
</template>

<script>
import ClanInfo from './ClanComponent/ClanInfo.vue';
import ClanDescription from './ClanComponent/ClanDescription.vue';
import WarStats from './WarsComponent/WarStats.vue';

export default {
  components: {
    ClanInfo,
    ClanDescription,
    WarStats,
  },
  props: {
    clan: {
      type: Object,
      default: null,
    },
    icons: Object,
    leagues: Array,
    unrankedLeagueIcon: String,
  },
  methods: {
    goToWarsDetail(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/wars/${cleanedClanTag}`);
    },
    goToCapitalRaid(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}/CapitalRaid`);
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
