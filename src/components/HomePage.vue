<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="clan in clans"
        :key="clan?.tag"
      class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
      <div class="p-4">
        <img :src="clan?.badgeUrls?.small" alt="Clan Badge" class="w-16 h-16 mx-auto">
        <h2 class="mt-4 text-xl font-semibold text-center">{{ clan?.name }}</h2>
        <p class="text-gray-600 text-center">Membres : {{ clan?.members }}</p>
        <p class="text-gray-600 text-center">Niveau : {{ clan?.clanLevel }}</p>
        <button
          @click="goToClan(clan?.tag)"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 block mx-auto"
        >
          Voir Détails
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import apiService from '../apiService';

export default {
  data() {
    return {
      clans: []
    };
  },
  created() {
    this.fetchClans();
  },
  methods: {
    fetchClans() {
      const clanTags = ['2G2LVRVR9', '2RCJY9QPY']; // Remplace par les tags réels de tes clans
      Promise.all(clanTags.map(tag => apiService.getClanDetails(tag)))
        .then(clansData => {
          this.clans = clansData;
          console.log('Clans data :', this.clans);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des détails des clans :', error);
        });
    },
    goToClan(clanTag) {
      this.$router.push(`/clan/${clanTag}`);
    }
  }
}
</script>

<style scoped>
/* Tes styles ici */
</style>
