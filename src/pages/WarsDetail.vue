<template>
  <div class="min-h-screen bg-gray-100">
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
</template>

<script>
import apiService from "../apiService.js";
import icons from "@/assets/icons.js";
import WarList from "@/components/WarsComponent/WarList.vue";
import CWLDetails from "@/components/WarsComponent/CWLDetails.vue";
import ClanHeader from "@/components/ClanHeader.vue";

export default {
  components: {
    ClanHeader,
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
      loading: true,
      error: null,
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
      document.title = `Détail des 60 dernières GDC du clan - ${this.clan?.name}`;
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
