<template>

  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-8 text-center">Quel Clan Analysé</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="clan in clans"
        :key="clan?.tag"
      class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
      <div class="p-4 cursor-pointer"  @click="goToClan(clan?.tag)">
        <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class=" mx-auto">
        <h2 class="mt-4 text-xl font-semibold text-center">{{ clan?.name }}</h2>
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
  mounted() {
    document.title = `Choix du clan à analysé`;
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
      // Supprimer le caractère # avant de rediriger
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
    }
    }
}
</script>

<style scoped>
/* Tes styles ici */
</style>
