<template>
  <div class="flex flex-col lg:flex-row w-full mb-4 lg:mb-0 gap-4">
    <div class="bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-center cursor-pointer" @click="getClanDetails(clan.tag)">
      <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class="w-25 h-25 mb-2"  />
      <h1 class="text-xl font-bold">{{ clan?.name || "Nom du Clan" }}</h1>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-between">
      <div class="flex items-center">
        <img :src="getLeagueIcon(clan?.capitalLeague?.name)" alt="Ligue des Raids" class="w-15 h-15 mr-2" />
        <span class="text-lg font-semibold">{{ clan?.capitalLeague?.name || 'Ligue Inconnue' }}</span>
      </div>

      <div class="flex items-center">
        <img :src="icons['icon/Capital_Trophy']" alt="Trophies Capital" class="w-15 h-15 mr-2" />
        <p class="text-xl font-bold">{{ clan?.clanCapitalPoints || '0' }}</p>
      </div>
    </div>

    <div v-if="clan?.clanCapital?.capitalHallLevel" class="bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-center justify-center">
      <strong class="mb-2">Capital Peak</strong>
      <img v-if="getCapitalHallImage(clan.clanCapital.capitalHallLevel)" :src="getCapitalHallImage(clan.clanCapital.capitalHallLevel)" :title="'Capital ' + clan.clanCapital.capitalHallLevel" :alt="'Capital ' + clan.clanCapital.capitalHallLevel" class="w-35 h-35" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clan: Object,
    icons: Object,
    leagues: Array,
    unrankedLeagueIcon: String,
  },
  methods: {

    getLeagueIcon(leagueName) {
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    getCapitalHallImage(level) {
      if (level >= 1 && level <= 10) {
        const iconName = `HDV/Capital_${level}`;
        return this.icons[iconName];
      }
      return null;
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace("#", "");
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
  },
};
</script>

<style scoped>
.player-label {
  height: 2rem;
  width: 2rem;
}
</style>
