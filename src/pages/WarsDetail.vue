<template>
  <div class="min-h-screen bg-gray-100">
    <clan-header
      :clan="clan"
      :icons="icons"
      :leagues="leagues"
      :unrankedLeagueIcon="unrankedLeagueIcon"/>
      <h1 class="font-bold text-3xl leading-tight text-center mt-10">Statisitque GDC et LDC</h1>
    <div class="container mx-auto py-16">
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
import ClanWarStats from '@/components/ClanWarStats.vue'
import ClanHeader from '@/components/ClanHeader.vue'

export default {
  components: {
    ClanHeader,
    ClanWarStats,
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
