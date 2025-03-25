<template>
  <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 lg:mr-4 mb-4 lg:mb-0">
    <div class="flex flex-col items-center mb-4">
      <img :src="clan?.badgeUrls?.medium" :alt="`Badge du clan ${clan?.name}`" class="h-25 w-25" />
      <h1 class="text-2xl font-bold mt-2">{{ clan?.name || 'Nom du Clan' }}</h1>
    </div>

    <div class="flex justify-around items-center mt-4">
      <div class="flex flex-col items-center cursor-pointer" @click="$emit('goToWarsDetail', clan.tag)" v-if="clan?.isWarLogPublic">
        <img :src="warLeagueIcon" :alt="`Ligue des Guerres ${clan?.warLeague?.name}`" class="h-20 w-20 mb-1" />
        <p class="text-sm text-gray-600">Ligue</p>
      </div>
      <div class="flex flex-col items-center cursor-pointer" v-else>
        <img :src="warLeagueIcon" :alt="`Ligue des Guerres ${clan?.warLeague?.name}`" class="h-20 w-20 mb-1" />
        <p class="text-sm text-gray-600">Ligue</p>
      </div>

      <div class="text-center">
        <div class="flex flex-row">
          <img :src="icons['icon/clanxp']" alt="Expérience du clan" class="h-10 w-10 xs:h-8 xs:w-8" />
          <p class="text-lg ml-2">lvl {{ clan?.clanLevel || 0 }}</p>
        </div>
        <hr class="my-2" />
        <div class="flex flex-row">
          <img :src="icons['icon/Trophy']" alt="Trophées du clan" class="h-10 w-10 xs:h-8 xs:w-8" />
          <p class="text-lg ml-2">{{ clan?.clanPoints || 0 }}</p>
        </div>
      </div>

      <div class="flex flex-col items-center cursor-pointer" @click="$emit('goToCapitalRaid', clan.tag)">
        <img :src="capitalLeagueIcon" :alt="`Ligue des Raids ${clan?.capitalLeague?.name}`" class="mb-1" />
        <p class="text-sm text-gray-600">Raids</p>
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
  computed: {
    capitalLeagueIcon() {
      const league = this.leagues.find(league => league.name === this.clan?.capitalLeague?.name);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    warLeagueIcon() {
      return this.icons[`league/${this.clan?.warLeague?.name}`];
    },
  },
};
</script>
