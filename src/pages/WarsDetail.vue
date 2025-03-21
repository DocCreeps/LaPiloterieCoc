<template>
  <div class="min-h-screen bg-gray-100">
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

    <div class="container mx-auto py-16 mt-24">
      <WarList
        :wars="wars"
        :currentWar="currentWar"
        :icons="icons"
        @clanClicked="getClanDetails"
      />
      <CWLDetails :leagues="leagues"
                  :wars="wars"
                  :icons="icons"
                  @clanClicked="getClanDetails"/>
    </div>
  </div>
</template>

<script>
import apiService from "../apiService.js";
import icons from "@/assets/icons.js";
import WarList from "@/components/WarList.vue";
import CWLDetails from "@/components/CWLDetails.vue";

export default {
  components: {
    WarList,
    CWLDetails,
  },
  data() {
    return {
      clan: null,
      wars: [],
      leagues: [],
      unrankedLeagueIcon: "",
      currentWar: null,
      icons: icons,
    };
  },

  created() {
    this.fetchClanDetails();
    this.fetchWarDetails();
    this.fetchCurrentWarDetails();
    this.fetchLeagues();
  },

  mounted() {
    document.title = `Détail des 60 dernières GDC du clan - ${this.clan?.name}`;
  },

  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService
        .getClanDetails(clanTag)
        .then((response) => {
          this.clan = response;
          document.title = `Détail des 60 dernières GDC du clan - ${this.clan?.name}`;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des détails du clan :", error);
        });
    },
    fetchWarDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService
        .getWarLog(clanTag)
        .then((response) => {
          this.wars = response.items;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des détails des guerres de clans :", error);
        });
    },
    fetchCurrentWarDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService
        .getCurrentWar(clanTag)
        .then((response) => {
          this.currentWar = response;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des détails de la guerre en cours :", error);
        });
    },
    fetchLeagues() {
      apiService
        .getLeagues()
        .then((response) => {
          this.leagues = response.items;
          const unrankedLeague = this.leagues.find((league) => league.name === "Unranked");
          if (unrankedLeague) {
            this.unrankedLeagueIcon = unrankedLeague.iconUrls.medium;
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des ligues :", error);
        });
    },
    getLeagueIcon(leagueName) {
      const league = this.leagues.find((league) => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace("#", "");
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
  },

  computed: {
    totalWars() {
      return (this.clan?.warWins || 0) + (this.clan?.warLosses || 0) + (this.clan?.warTies || 0);
    },
  },
};
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
</style>
