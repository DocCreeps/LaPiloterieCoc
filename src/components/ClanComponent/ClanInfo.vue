<template>
  <div class="bg-white p-4 rounded-lg shadow-md w-10/12 sm:w-11/12 md:w-5/6 lg:w-1/3 lg:mr-4 mb-4 lg:mb-0 mx-auto">
    <div class="flex flex-col items-center mb-4">
      <img :src="clan?.badgeUrls?.medium" :alt="`Badge du clan ${clan?.name}`" class="h-20 w-20 sm:h-24 sm:w-24" />
      <h1 class="text-xl sm:text-2xl font-bold mt-2">{{ clan?.name || 'Nom du Clan' }}</h1>
    </div>

    <div class="flex flex-col sm:flex-row justify-around items-center mt-4">
      <div class="flex flex-col items-center cursor-pointer mb-4 sm:mb-0" @click="$emit('goToWarsDetail', clan.tag)">
        <img :src="warLeagueIcon" :alt="`Ligue des Guerres ${clan?.warLeague?.name}`" class="h-16 w-16 sm:h-20 sm:w-20 mb-1" />
        <p class="text-sm text-gray-600 font-bold">Ligue</p>
      </div>

      <div class="flex flex-row">
        <div class="mb-4 sm:mb-0">
          <div class="flex items-center flex-row justify-around sm:flex-col sm:items-center">
            <div class="flex items-center mb-2 sm:mb-0 mx-4">
              <img :src="icons['icon/clanxp']" alt="Expérience du clan" class="h-8 w-8 sm:h-10 sm:w-10" />
              <p class="text-base sm:text-lg ml-2 font-bold">lvl {{ clan?.clanLevel || 0 }}</p>
            </div>
            <hr class="my-2 border-l sm:border-t sm:border-l-0 h-10 w-0 sm:h-0 sm:w-full sm:mx-0" />
            <div class="flex flex-col sm:flex-row">
              <div class="flex items-center mx-4">
                <img :src="icons['icon/Trophy']" alt="Trophées du clan" class="h-8 w-8 sm:h-10 sm:w-10" />
                <p class="text-base sm:text-lg ml-2 font-bold">{{ clan?.clanPoints || 0 }}</p>
              </div>
              <div class="flex items-center mx-4 mt-2 sm:mt-0">
                <img :src="icons['icon/mdo_trophy']" alt="Trophées du clan" class="h-8 w-8 sm:h-10 sm:w-10" />
                <p class="text-base sm:text-lg ml-2 font-bold">{{ clan?.clanBuilderBasePoints || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center cursor-pointer" @click="$emit('goToCapitalRaid', clan.tag)">
        <img :src="capitalLeagueIcon" :alt="`Ligue des Raids ${clan?.capitalLeague?.name}`" class="h-16 w-16 sm:h-20 sm:w-20 mb-1" />
        <p class="text-sm text-gray-600 font-bold">Raids</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clan: {
      type: Object,
      required: true
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
    capitalLeagueIcon() {
      if (!this.clan || !this.leagues) return this.unrankedLeagueIcon;
      const league = this.leagues.find(league => league.name === this.clan.capitalLeague?.name);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    warLeagueIcon() {
      if (!this.clan) return '';
      return this.icons[`league/${this.clan.warLeague?.name}`] || '';
    }
  }
};
</script>

<style scoped>
/* Vos styles ici */
</style>
