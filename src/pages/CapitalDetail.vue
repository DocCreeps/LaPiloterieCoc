<template>
  <div v-if="clan" :class="['p-4 fixed top-0 left-0 right-0 z-10', raidStateClass]">
    <div class="container mx-auto flex justify-center text-white cursor-pointer" :key="clan.tag"
         @click="getClanDetails(clan.tag)">
      <img :src="clan.badgeUrls?.medium" alt="Clan Badge" class="h-16 w-16 mr-4">
      <div>
        <h2 class="text-2xl font-bold">{{ clan.name || "Nom du Clan" }}</h2>
        <h1 class="text-2xl font-bold">Capital de clan</h1>
      </div>
    </div>
  </div>

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

export default {
  components: {
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
      raidStateClass: 'bg-green-500',
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
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
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
