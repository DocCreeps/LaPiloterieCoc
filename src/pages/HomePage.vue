<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-8 text-center">Quel Clan Analyser</h1>
    <div v-if="loading" class="text-center">Chargement des clans...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="clan in clans"
        :key="clan?.tag"
        class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div class="p-4 cursor-pointer" @click="goToClan(clan?.tag)">
          <img
            v-if="clan?.badgeUrls?.medium"
            :src="clan?.badgeUrls?.medium"
            :alt="`Badge du clan ${clan?.name}`"
            class="mx-auto"
          />
          <div v-else class="text-center">Image non disponible</div>
          <h2 class="mt-4 text-xl font-semibold text-center">
            {{ clan?.name || 'Nom inconnu' }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../apiService.js';

export default {
  data() {
    return {
      clans: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchClans();
  },
  mounted() {
    document.title = 'Choix du clan à analyser';
  },
  methods: {
    async fetchClans() {
      this.loading = true;
      this.error = null;
      const clanTags = ['2G2LVRVR9', '2RCJY9QPY'];

      try {
        this.clans = await Promise.all(
          clanTags.map((tag) => apiService.getClanDetails(tag))
        );
      } catch (err) {
        console.error('Erreur lors de la récupération des détails des clans :', err);
        this.error = 'Erreur lors de la récupération des clans. Veuillez réessayer.';
      } finally {
        this.loading = false;
      }
    },
    goToClan(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
  },
};
</script>

<style scoped>
/* Ajoute tes styles ici, par exemple : */
.shadow-md:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
