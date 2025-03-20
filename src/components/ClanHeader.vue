<template>

  <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mb-4 lg:mb-0">
    <div class="flex flex-col items-center mb-4">
      <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class="h-16 w-16">
      <h1 class="text-2xl font-bold mt-2">{{ clan?.name || "Nom du Clan" }}</h1>
    </div>

    <div class="flex justify-between items-center mt-4">

      <div class="flex flex-col items-center cursor-pointer" @click="goToWarsDetail(clan.tag)" v-if="clan.isWarLogPublic">
        <img :src="getWarLeagueIcon(clan?.warLeague?.name)" alt="Ligue des Guerres" class="h-20 w-20 mb-1">
        <p class="text-sm text-gray-600">Ligue De Clan</p>
      </div>
      <div class="flex flex-col items-center cursor-pointer" v-else>
        <img :src="getWarLeagueIcon(clan?.warLeague?.name)" alt="Ligue des Guerres" class="h-20 w-20 mb-1">
        <p class="text-sm text-gray-600">Ligue De Clan</p>
      </div>

      <div class="text-center">
        <div class="flex flex-row">
          <img :src="icons['icon/clanxp']" alt="experience" class="h-10 w-10 xs:h-8 xs:w-8"/>
          <p class="text-lg ml-2">lvl {{ clan?.clanLevel }}</p>
        </div>
        <hr class="my-2">
        <div class="flex flex-row">
          <img :src="icons['icon/Trophy']" alt="Trophées de clan" class="h-10 w-10 xs:h-8 xs:w-8"/>
          <p class="text-lg ml-2">{{ clan?.clanPoints }}</p>
        </div>
      </div>

      <div class="flex flex-col items-center cursor-pointer" @click="goToCapitalRaid(clan.tag)">
        <img :src="getLeagueIcon(clan?.capitalLeague?.name)" alt="Ligue des Raids" class="mb-1">
        <p class="text-sm text-gray-600">Raids Capital</p>
      </div>

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
    goToWarsDetail(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/wars/${cleanedClanTag}`);
    },
    goToCapitalRaid(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}/CapitalRaid`);
    },
    getLeagueIcon(leagueName) {
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    getWarLeagueIcon(leagueName) {
      const leagueIcons = `league/${leagueName}`;
      return this.icons[leagueIcons];
    },
  },
};
</script>

<style scoped>

</style>
