<template>
  <div class="flex flex-col lg:flex-row w-full mb-4 lg:mb-0" v-if="isClanAvailable">
    <ClanInfo :clan="clan" :icons="icons" :leagues="leagues" :unrankedLeagueIcon="unrankedLeagueIcon" @goToWarsDetail="goToWarsDetail" @goToCapitalRaid="goToCapitalRaid" class="w-10/12 lg:w-1/3 mb-4 lg:mb-0"/>
    <ClanDescription :clan="clan" :icons="icons" class="w-10/12 lg:w-1/3 mb-4 lg:mb-0"/>
    <WarStats :clan="clan" class="w-10/12 lg:w-1/3"/>
  </div>
  <div v-else>
    <p class="text-center">Chargement des informations du clan...</p>
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
    icons: {
      type: Object,
      required: true
    },
    leagues: {
      type: Array,
      required: true
    },
    unrankedLeagueIcon: {
      type: String,
      required: true
    }
  },
  computed: {
    isClanAvailable() {
      return this.clan !== null;
    }
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
