<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto py-8">
      <clan-header
        :clan="clan"
        :icons="icons"
        :leagues="leagues"
        :unrankedLeagueIcon="unrankedLeagueIcon"
      />

      <h1 class="font-bold text-3xl leading-tight text-center mt-10">GDC/LDC</h1>

      <div class="container mx-auto py-16">
        <div v-if="loading">Chargement des données...</div>
        <div v-else-if="error">Une erreur est survenue : {{ error }}</div>
        <div v-else>
          <CurrentCWL
            v-if="!isCWLNotFound"
            :warLeagueGroup="warLeagueGroup"
            :warDetails="warDetails"
            @clanClicked="getClanDetails"
            :icons="icons"
          />

          <CurrentWars
            :wars="wars"
            :currentWar="currentWar"
            :icons="icons"
            @clanClicked="getClanDetails"
          />
          <h2 class="font-bold text-3xl leading-tight text-center mt-10">Statistique GDC et LDC</h2>
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
import CurrentWars from "@/components/WarsComponent/CurrentWars.vue";
import WarList from "@/components/WarsComponent/WarList.vue";
import CWLDetails from "@/components/WarsComponent/CWLDetails.vue";
import ClanHeader from "@/components/ClanHeader.vue";
import CurrentCWL from "@/components/WarsComponent/CurrentCWL.vue";

export default {
  components: {
    CurrentWars,
    ClanHeader,
    WarList,
    CWLDetails,
    CurrentCWL,
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
      warLeagueGroup: null,
      warDetails: {},
      isCWLNotFound: false,
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

      try {
        const cwlResponse = await apiService.getCurrentWarLeague(clanTag);
        this.warLeagueGroup = cwlResponse;
        this.isCWLNotFound = false;

        if (this.warLeagueGroup && this.warLeagueGroup.rounds) {
          for (const round of this.warLeagueGroup.rounds) {
            for (const warTag of round.warTags) {
              if (warTag !== "#0" && !this.warDetails[warTag]) {
                try {
                  const war = await apiService.getWarDetails(warTag);
                  this.warDetails[warTag] = Object.assign({}, war);
                } catch (error) {
                  console.error(`Erreur lors de la récupération des détails de la guerre ${warTag} :`, error);
                  this.warDetails[warTag] = { error: "Erreur de chargement" };
                }
              }
            }
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.reason === 'notFound') {
          this.isCWLNotFound = true;
          this.warLeagueGroup = null;
        } else {
          console.error("Erreur lors de la récupération des données de la LDC :", error);
          this.error = this.error || "Erreur lors du chargement des données de la LDC.";
        }
      }

      document.title = `GDC/LDC - ${this.clan?.name}`;
    } catch (err) {
      console.error("Erreur lors de la récupération des données initiales :", err);
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
