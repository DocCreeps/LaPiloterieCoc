<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Bandeau des Statistiques de Guerre Générales -->
    <div class="bg-blue-500 text-white p-4 fixed top-0 left-0 right-0 z-10">
      <div class="container mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-4 md:mb-0">Statistiques de Guerre</h1>
          <p class="text-lg mb-2">Ligue de Clan : {{ clan?.warLeague?.name }}</p>
        </div>
        <div class="flex flex-wrap justify-center">
          <div class="flex flex-col items-center bg-green-500 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Gagné</p>
            <p class="text-lg">{{ clan?.warWins }}</p>
          </div>
          <div class="flex flex-col items-center bg-red-500 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Perdu</p>
            <p class="text-lg">{{ clan?.warLosses }}</p>
          </div>
          <div class="flex flex-col items-center bg-gray-500 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Égalité</p>
            <p class="text-lg">{{ clan?.warTies }}</p>
          </div>
          <div class="flex flex-col items-center bg-black p-2 rounded-lg m-1 mt-4 md:mt-0">
            <p class="text-lg font-bold text-white">Total</p>
            <p class="text-lg text-white">{{ clan?.warWins + clan?.warLosses + clan?.warTies }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="container mx-auto py-16 mt-24">
      <!-- Bloc déroulable pour les GDC (Guerres de Clans) -->
      <div class="mb-8">
        <button class="bg-gray-300 w-full p-4 rounded-lg text-left" @click="toggleGdc">
          <h2 class="text-xl font-bold">Guerres de Clans</h2>
        </button>
        <div v-show="showGdc" class="bg-white p-4 rounded-lg shadow-md">
          <!-- Lignes des Guerres de Clans -->
          <div v-for="war in wars" :key="war.endTime" :class="getResultClass(war.result)" class="p-2 mb-2 rounded-lg flex justify-between items-center">
            <div class="flex items-center">
              <img :src="war.clan.badgeUrls.small" alt="Badge" class="w-8 h-8 mr-2">
              <span class="font-bold">{{ war.clan.name }}</span>
            </div>
            <span class="text-lg">{{ war.clan.stars }} </span>
            <span class="text-lg">{{ (war.clan.destructionPercentage).toFixed(2) }}%</span>
            <span class="text-lg">VS</span>
            <span class="text-lg">{{ (war.opponent.destructionPercentage).toFixed(2) }}%</span>
            <span class="text-lg">{{ war.opponent.stars }} </span>
            <div class="flex items-center">
              <span class="font-bold">{{ war.opponent.name }}</span>
              <img :src="war.opponent.badgeUrls.small" alt="Badge" class="w-8 h-8 mr-2">
            </div>
          </div>
        </div>
      </div>

      <!-- Bloc déroulable pour les Ligues -->
      <div>
        <button class="bg-gray-300 w-full p-4 rounded-lg text-left" @click="toggleLeague">
          <h2 class="text-xl font-bold">Ligues de Clans</h2>
        </button>
        <div v-show="showLeague" class="bg-white p-4 rounded-lg shadow-md">
          <!-- Contenu des Ligues de Clans -->
          <p>Détails des ligues de clans...</p>
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
      clan: null,
      wars: [],
      showGdc: false, // Ouvert par défaut
      showLeague: false
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchWarDetails();
  },
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
        console.log('Détails du clan :', this.clan);
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
      });
    },
    fetchWarDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getWarLog(clanTag).then(response => {
        this.wars = response.items;
        console.log('Détails des guerres de clans :', this.wars);
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails des guerres de clans :', error);
      });
    },
    toggleGdc() {
      this.showGdc = !this.showGdc;
    },
    toggleLeague() {
      this.showLeague = !this.showLeague;
    },
    getResultClass(result) {
      return {
        'bg-green-100': result === 'win',
        'bg-gray-100': result === 'draw',
        'bg-red-100': result === 'lose'
      };
    }
  }
}
</script>

<style scoped>
.stat-item {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  margin-bottom: 0;
}
.stat-item:hover {
  transform: scale(1.05);
  opacity: 0.8;
}
.bg-green-100 {
  background-color: #d4edda;
}
.bg-gray-100 {
  background-color: #f8f9fa;
}
.bg-red-100 {
  background-color: #f8d7da;
}
</style>
