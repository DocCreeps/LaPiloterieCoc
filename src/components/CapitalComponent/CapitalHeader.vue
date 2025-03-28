<template>
  <div class="w-full mb-4 lg:mb-0 bg-gray-100">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <template v-if="clan">
          <div
            class="bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-center cursor-pointer"
            @click="getClanDetails(clan?.tag)"
          >
            <img
              v-if="clan?.badgeUrls?.medium"
              :src="clan.badgeUrls.medium"
              :alt="'Badge du clan ' + clan?.name"
              class="w-20 lg:w-24 h-20 lg:h-24 mb-2"
            />
            <p v-else>Badge non disponible</p>
            <h1 class="text-lg lg:text-xl font-bold">{{ clan?.name || 'Nom du Clan' }}</h1>
          </div>

          <div
            class="bg-white p-4 rounded-lg shadow-md w-full flex flex-col sm:flex-row items-center justify-between"
          >
            <div class="flex items-center mb-2 sm:mb-0">
              <img
                :src="getLeagueIcon(clan?.capitalLeague?.name)"
                :alt="'Ligue des Raids ' + clan?.capitalLeague?.name"
                class="w-10 lg:w-12 h-10 lg:h-12 mr-2"
              />
              <span class="text-base lg:text-lg font-semibold">{{ clan?.capitalLeague?.name || 'Ligue Inconnue' }}</span>
            </div>

            <div class="flex items-center">
              <img :src="icons['icon/Capital_Trophy']" alt="Trophées de la capitale" class="w-10 lg:w-12 h-10 lg:h-12 mr-2" />
              <p class="text-lg font-bold">{{ clan?.clanCapitalPoints || '0' }}</p>
            </div>
          </div>

          <div
            v-if="clan?.clanCapital?.capitalHallLevel"
            class="bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-center justify-center"
          >
            <img
              v-if="getCapitalHallImage(clan.clanCapital.capitalHallLevel)"
              :src="getCapitalHallImage(clan.clanCapital.capitalHallLevel)"
              :title="'Capital ' + clan.clanCapital.capitalHallLevel"
              :alt="'Capital ' + clan.clanCapital.capitalHallLevel"
              class="w-24 lg:w-30 h-24 lg:h-30"
            />
            <p v-else>Image non disponible</p>
          </div>
        </template>
        <template v-else>
          <p>Clan non disponible</p>
        </template>
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
    getLeagueIcon(leagueName) {
      const league = this.leagues?.find((league) => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    getCapitalHallImage(level) {
      if (level >= 1 && level <= 10 && this.icons[`HDV/Capital_${level}`]) {
        return this.icons[`HDV/Capital_${level}`];
      }
      return null;
    },
    getClanDetails(clanTag) {
      if (clanTag) {
        const cleanedClanTag = clanTag.replace('#', '');
        this.$router.push(`/clan/${cleanedClanTag}`);
      }
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
