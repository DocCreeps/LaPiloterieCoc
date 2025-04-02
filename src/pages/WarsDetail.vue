<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto py-8">
    <clan-header
      :clan="clan"
      :icons="icons"
      :leagues="leagues"
      :unrankedLeagueIcon="unrankedLeagueIcon"
    />

    <h1 class="font-bold text-3xl leading-tight text-center mt-10">Statistique GDC et LDC</h1>

    <div class="container mx-auto py-16">
      <div v-if="loading">Chargement des données...</div>
      <div v-else-if="error">Une erreur est survenue : {{ error }}</div>
      <div v-else>
        <CurrentCWL :warLeagueGroup="warLeagueGroup" @clanClicked="getClanDetails" :icons="icons"/>
        <CurrentWars
          :wars="wars"
          :currentWar="currentWar"
          :icons="icons"
          @clanClicked="getClanDetails"
        />
        <WarList
          :wars="wars"
          :currentWar="currentWar"
          :icons="icons"
          @clanClicked="getClanDetails"
        />
        <CWLDetails
          :leagues="leagues"
          :wars="wars"
          :icons="icons"
          @clanClicked="getClanDetails"
        />
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import apiService from "../apiService.js";
import icons from "@/assets/icons.js";
import CurrentWars from '@/components/WarsComponent/CurrentWars.vue'
import WarList from "@/components/WarsComponent/WarList.vue";
import CWLDetails from "@/components/WarsComponent/CWLDetails.vue";
import ClanHeader from "@/components/ClanHeader.vue";
import CurrentCWL from "@/components/WarsComponent/CurrentCWL.vue"; // Importez le composant CurrentCWL

export default {
  components: {
    CurrentWars,
    ClanHeader,
    WarList,
    CWLDetails,
    CurrentCWL, // Ajoutez CurrentCWL aux composants
  },
  data() {
    return {
      clan: null,
      wars: [],
      leagues: [],
      unrankedLeagueIcon: "",
      currentWar: null,
      icons: icons,
      loading: true,
      error: null,
      warLeagueGroup: null, // Ajoutez warLeagueGroup
    };
  },

  async created() {
    try {
      const clanTag = this.$route.params.clanTag;
      this.clan = await apiService.getClanDetails(clanTag);
      this.wars = (await apiService.getWarLog(clanTag)).items;
      this.currentWar = await apiService.getCurrentWar(clanTag);
      const leaguesResponse = await apiService.getLeagues();
      this.leagues = leaguesResponse.items;
      const unrankedLeague = this.leagues.find((league) => league.name === "Unranked");
      if (unrankedLeague) {
        this.unrankedLeagueIcon = unrankedLeague.iconUrls.medium;
      }
      this.warLeagueGroup = await apiService.getCurrentWarLeague(clanTag); // Récupérez les données de la ligue de guerre
      document.title = `GDC/LDC - ${this.clan?.name}`;
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace("#", "");
      this.$router.push(`/clan/${cleanedClanTag}`);
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
