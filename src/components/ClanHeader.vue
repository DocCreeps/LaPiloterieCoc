<template>
  <div class="flex flex-col lg:flex-row w-full mb-4 lg:mb-0">
    <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 lg:mr-4 mb-4 lg:mb-0">
      <div class="flex flex-col items-center mb-4">
        <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class="h-25 w-25" />
        <h1 class="text-2xl font-bold mt-2">{{ clan?.name || "Nom du Clan" }}</h1>
      </div>

      <div class="flex justify-around items-center mt-4">
        <div class="flex flex-col items-center cursor-pointer" @click="goToWarsDetail(clan.tag)" v-if="clan.isWarLogPublic">
          <img :src="getWarLeagueIcon(clan?.warLeague?.name)" alt="Ligue des Guerres" class="h-20 w-20 mb-1" />
          <p class="text-sm text-gray-600">Ligue</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" v-else>
          <img :src="getWarLeagueIcon(clan?.warLeague?.name)" alt="Ligue des Guerres" class="h-20 w-20 mb-1" />
          <p class="text-sm text-gray-600">Ligue</p>
        </div>

        <div class="text-center">
          <div class="flex flex-row">
            <img :src="icons['icon/clanxp']" alt="experience" class="h-10 w-10 xs:h-8 xs:w-8" />
            <p class="text-lg ml-2">lvl {{ clan?.clanLevel }}</p>
          </div>
          <hr class="my-2" />
          <div class="flex flex-row">
            <img :src="icons['icon/Trophy']" alt="Trophées de clan" class="h-10 w-10 xs:h-8 xs:w-8" />
            <p class="text-lg ml-2">{{ clan?.clanPoints }}</p>
          </div>
        </div>

        <div class="flex flex-col items-center cursor-pointer" @click="goToCapitalRaid(clan.tag)">
          <img :src="getLeagueIcon(clan?.capitalLeague?.name)" alt="Ligue des Raids" class="mb-1" />
          <p class="text-sm text-gray-600">Raids</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 lg:mr-4 mb-4 lg:mb-0">
      <p class="text-lg text-center">{{ clan?.description || "Description indisponible." }}</p>
      <div class="flex flex-row justify-center mt-2">
        <img :src="icons['icon/member']" alt="Membres" class="h-7 w-7" />
        <p class="text-lg ml-2"> {{ clan?.members }}/50</p>
      </div>
      <div class="text-center mt-4">
        <div class="player-label-holder flex flex-row justify-center">
          <img v-for="label in clan?.labels" :key="label.id" :src="label.iconUrls.small" :title="label.name" class="player-label mx-2" />
        </div>
      </div>
    </div>

    <div :class="clan?.isWarLogPublic ? 'bg-blue-500' : 'bg-red-500'" class="p-4 rounded-lg shadow-md text-white w-full lg:w-1/3 mb-4 lg:mb-0">
      <h2 class="text-xl font-bold mb-4 text-center">{{ clan?.isWarLogPublic ? "Statistiques de Guerre" : "Journal de Guerre Privé" }}</h2>
      <div v-if="clan?.isWarLogPublic" class="flex flex-col justify-center">
        <div class="flex flex-row justify-center mb-4">
          <div class="flex flex-col items-center bg-green-600 p-2 rounded-lg m-1 w-1/3">
            <p class="text-lg font-bold">Gagné</p>
            <p class="text-lg">{{ clan?.warWins || 0 }}</p>
          </div>
          <div class="flex flex-col items-center bg-red-500 p-2 rounded-lg m-1 w-1/3">
            <p class="text-lg font-bold">Perdu</p>
            <p class="text-lg">{{ clan?.warLosses || 0 }}</p>
          </div>
          <div class="flex flex-col items-center bg-gray-500 p-2 rounded-lg m-1 w-1/3">
            <p class="text-lg font-bold">Égalité</p>
            <p class="text-lg">{{ clan?.warTies || 0 }}</p>
          </div>
        </div>
        <div class="flex flex-col items-center bg-black p-2 rounded-lg m-1 w-full">
          <p class="text-lg font-bold text-white">Total</p>
          <p class="text-lg text-white">{{ (clan?.warWins || 0) + (clan?.warLosses || 0) + (clan?.warTies || 0) }}</p>
        </div>
      </div>
      <p v-else class="text-center">Les statistiques de guerre sont privées.</p>
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
.player-label {
  height: 2rem;
  width: 2rem;
}
</style>
