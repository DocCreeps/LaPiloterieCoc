<template>

  <capital-header :clan="clan" :leagues="leagues" :unrankedLeagueIcon="unrankedLeagueIcon" :icons="icons"/>

  <div class="container mx-auto py-16 mt-24">
    <CapitalDistricts :clan="clan" :leagues="leagues" :unrankedLeagueIcon="unrankedLeagueIcon" :icons="icons"/>
    <CapitalRaidInfo :raids="raids" :selectedRaidIndex="selectedRaidIndex" :icons="icons" @update:selectedRaidIndex="updateSelectedRaidIndex" @raid-selected="handleRaidSelected"/>
    <CapitalRaidMembers :selectedRaid="selectedRaid" :icons="icons" :clanMembers="clanMembers"/>
  </div>
</template>

<script>
import apiService from '../apiService.js';
import icons from '@/assets/icons.js';
import CapitalDistricts from '@/components/CapitalDistricts.vue';
import CapitalRaidInfo from '@/components/CapitalRaidInfo.vue';
import CapitalRaidMembers from '@/components/CapitalRaidMembers.vue';
import CapitalHeader from '@/components/CapitalHeader.vue'

export default {
  components: {
    CapitalHeader,
    CapitalDistricts,
    CapitalRaidInfo,
    CapitalRaidMembers,
  },
  data() {
    return {
      clan: null,
      raids: [],
      selectedRaidIndex: 0, // Initialisé à 0
      selectedRaid: {},
      leagues: [],
      unrankedLeagueIcon: '',
      clanMembers: [],
      icons: icons,
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchCapitalRaidDetails();
    this.fetchLeagues();
    this.fetchClanMembers();
  },
  mounted() {

  },
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
        document.title = `Raids capital - ${this.clan?.name}`;
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
      });
    },
    fetchCapitalRaidDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getCapitalDetails(clanTag).then(response => {
        this.raids = response.items || [];
        if (this.raids.length > 0) {
          this.updateSelectedRaid();
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des raids de capital :', error);
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
    updateSelectedRaid() {
      this.selectedRaid = this.raids[this.selectedRaidIndex] || {};
    },
    formatDate(dateString) {
      if (!dateString) {
        return "Date inconnue";
      }
      try {
        const formattedString = dateString.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d+)?Z$/, "$1-$2-$3T$4:$5:$6Z");
        const date = new Date(formattedString);
        if (isNaN(date)) {
          throw new Error("Date invalide");
        }
        return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
      } catch (error) {
        console.error("Date invalide :", dateString);
        return "Date inconnue";
      }
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
    fetchClanMembers() {
      const clanTag = this.$route.params.clanTag;
      return apiService.getClanDetails(clanTag).then(response => {
        this.clanMembers = response.memberList;
      })
    },
    handleRaidSelected(index) {
      this.selectedRaidIndex = index;
      this.updateSelectedRaid();
    },
    updateSelectedRaidIndex(index) {
      this.selectedRaidIndex = index;
      this.updateSelectedRaid();
    }
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
