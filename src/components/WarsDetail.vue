<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Bandeau des Statistiques de Guerre Générales -->
    <div class="bg-blue-500 text-white p-4 fixed top-0 left-0 right-0 z-10">
      <div class="container mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-4 md:mb-0">Statistiques de Guerre</h1>
        </div>

        <div>
          <img
            :src="getLeagueIcon(clan?.warLeague?.name)"
            alt="Ligue de Guerre"
            class="h-20 w-20 mb-2"
          />
        </div>
        <div class="flex flex-wrap justify-center">
          <div class="flex flex-col items-center bg-green-600 p-2 rounded-lg m-1">
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
            <p class="text-lg text-white">{{ totalWars }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="container mx-auto py-16 mt-24">

        <!-- Affichage des Guerres en Cours -->
        <div v-if="currentWar" :class="getWarResultClass(currentWar)" class="p-2 mb-2 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-center">
          <div class="text-center  cursor-pointer" @click="getClanDetails(currentWar.clan.tag)">
            <img :src="currentWar.clan.badgeUrls.medium" alt="Badge" class="mx-auto md:mx-0">
            <h4 class="text-lg font-semibold">{{ currentWar.clan.name }}</h4>
          </div>

          <div class="text-center md:w-1/4">
            <strong class="font-bold">{{ currentWar.clan.stars }}</strong>
            <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block ml-5 mr-2" />
            <strong> - </strong>
            <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-5 ml-2" />
            <strong class="font-bold"> {{ currentWar.opponent.stars }}</strong>
            <p class="text-gray-600">({{ (currentWar.clan.destructionPercentage).toFixed(2) }}%) - ({{ (currentWar.opponent.destructionPercentage).toFixed(2) }}%)</p>
            <p class="text-gray-600">{{ currentWar.teamSize }} vs {{ currentWar.teamSize }}</p>
          </div>

          <div class="text-center cursor-pointer" @click="getClanDetails(currentWar.opponent.tag)">
            <img :src="currentWar.opponent.badgeUrls.medium" alt="Badge" class=" mx-auto md:mx-0">
            <h4 class="text-lg font-semibold">{{ currentWar.opponent.name }}</h4>
          </div>

        </div>




      <!-- Bloc déroulable pour les GDC (Guerres de Clans) -->
      <div class="mb-8">
        <div class="bg-gray-300 w-full p-4 rounded-lg text-left" @click="toggleGdc">
          <h2 class="text-xl font-bold">60 dernière Guerres de Clans </h2>
        </div>
        <div v-show="showGdc" class="bg-white p-4 rounded-lg shadow-md">
          <!-- Lignes des Guerres de Clans -->
          <div v-for="war in paginatedWars" :key="war.endTime" :class="getResultClass(war.result)" class="p-2 mb-2 rounded-lg flex flex-col md:flex-row gap-4 ">
            <div class="flex items-center justify-center md:justify-start md:w-1/4">
              <div class="hidden md:block">
                <div class="text-gray-500">{{ formatDate(war.endTime) }}</div>
              </div>
            </div>

            <div class="text-center md:text-right md:w-1/4">
              <h4 class="text-lg font-semibold">{{ war.clan.name }}</h4>
              <p class="text-gray-600">({{ (war.clan.destructionPercentage).toFixed(2) }}%)</p>
            </div>

            <div class="hidden md:flex items-center justify-center md:w-1/4 cursor-pointer"
              :key="clan.tag"
              @click="getClanDetails(clan.tag)">
              <img :src="war.clan.badgeUrls.small" alt="Badge" class="w-16 h-16">
            </div>

            <div class="text-center md:w-1/4">
              <div class="font-bold">
                <strong>
                  {{ war.clan.stars }}
                  <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block  mx-2"/>
                  -
                  <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mx-2" />
                  {{ war.opponent.stars }}
                </strong>
              </div>
              <p class="text-gray-600">{{ war.teamSize }} vs {{ war.teamSize }}</p>
            </div>

            <div class="hidden md:flex items-center justify-center md:w-1/4 cursor-pointer"
                 :key="clan.tag"
                 @click="getClanDetails(war.opponent.tag)">
              <img :src="war.opponent.badgeUrls.small" alt="Badge" class="w-16 h-16">
            </div>

            <div class="text-center md:text-left md:w-1/4">
              <h4 class="text-lg font-semibold"> {{ war.opponent.name }}</h4>
              <p class="text-gray-600">({{ (war.opponent.destructionPercentage).toFixed(2) }}%)</p>
            </div>

          </div>

          <!-- Pagination -->
          <div class="flex justify-center mt-4">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 mx-1 bg-gray-300 rounded-lg"
            >
              Précédent
            </button>
            <span class="px-4 py-2 mx-1">{{ currentPage }} / {{ totalPages }}</span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 mx-1 bg-gray-300 rounded-lg"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <!-- Bloc déroulable pour les Ligues -->
      <div>
        <div class="bg-gray-300 w-full p-4 rounded-lg text-left" @click="toggleLeague">
          <h2 class="text-xl font-bold">Ligues de Clans</h2>
        </div>
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
import icons from '@/assets/icons.js';

export default {
  data() {
    return {
      clan: null,
      wars: [],
      leagues: [],
      unrankedLeagueIcon: '',
      showGdc: false,
      showLeague: false,
      currentPage: 1,
      itemsPerPage: 10,
      currentWar: null,
      icons : icons,
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchWarDetails();
    this.fetchCurrentWarDetails();
    this.fetchLeagues();
  },
  mounted() {
    document.title = `Détail des 60 dernières GDC du clan - ${this.clan?.name }`;
  },
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
        document.title = `Détail des 60 dernières GDC du clan - ${this.clan?.name }`;
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
      });
    },
    fetchWarDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getWarLog(clanTag).then(response => {
        this.wars = response.items;

      }).catch(error => {
        console.error('Erreur lors de la récupération des détails des guerres de clans :', error);
      });
    },
    fetchCurrentWarDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getCurrentWar(clanTag).then(response => {
        this.currentWar = response;
      }).catch(error => {
        console.error("Erreur lors de la récupération des détails de la guerre en cours :", error);
      });
    },
    fetchLeagues() {
      apiService.getLeagues().then(response => {
        this.leagues = response.items;
        const unrankedLeague = this.leagues.find(league => league.name === 'Unranked');
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.medium;
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
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
    },
    getLeagueIcon(leagueName) {
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    formatDate(endTime) {
      const date = new Date(endTime);
      const now = new Date();
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      return `${diff}d ago`;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
    getWarResultClass(war) {
      if (war.clan.stars > war.opponent.stars) {
        return 'bg-green-100'; // Léger fond vert si la guerre est en train d'être gagnée
      } else {
        return 'bg-red-100'; // Léger fond rouge sinon
      }
    },
  },
  computed: {
    filteredWars() {
      return this.wars.filter(war => war.opponent && war.opponent.name);
    },
    paginatedWars() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredWars.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredWars.length / this.itemsPerPage);
    },
    totalWars() {
      return (this.clan?.warWins || 0) + (this.clan?.warLosses || 0) + (this.clan?.warTies || 0);
    },

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
