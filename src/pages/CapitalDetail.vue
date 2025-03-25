<template>
  <div>
    <capital-header
      :clan="clan"
      :leagues="leagues"
      :unrankedLeagueIcon="unrankedLeagueIcon"
      :icons="icons"
    />

    <div class="container mx-auto py-16 mt-24">
      <div v-if="loading">Chargement des données...</div>
      <div v-else-if="error">Une erreur est survenue : {{ error }}</div>
      <div v-else>
        <CapitalDistricts :clan="clan" :leagues="leagues" :unrankedLeagueIcon="unrankedLeagueIcon" :icons="icons" />
        <CapitalRaidInfo
          :raids="raids"
          :selectedRaidIndex="selectedRaidIndex"
          :icons="icons"
          @update:selectedRaidIndex="updateSelectedRaidIndex"
          @raid-selected="handleRaidSelected"
        />
        <CapitalRaidMembers :selectedRaid="selectedRaid" :icons="icons" :clanMembers="clanMembers" :loadingMembers="loadingMembers"/>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../apiService.js';
import icons from '@/assets/icons.js';
import CapitalDistricts from '@/components/CapitalComponent/CapitalDistricts.vue';
import CapitalRaidInfo from '@/components/CapitalComponent/CapitalRaidInfo.vue';
import CapitalRaidMembers from '@/components/CapitalComponent/CapitalRaidMembers.vue';
import CapitalHeader from '@/components/CapitalComponent/CapitalHeader.vue';

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
      selectedRaidIndex: 0,
      selectedRaid: {},
      leagues: [],
      unrankedLeagueIcon: '',
      clanMembers: [],
      icons: icons,
      loading: true,
      loadingMembers: true,
      error: null,
    };
  },
  async created() {
    try {
      const clanTag = this.$route.params.clanTag;
      this.clan = await apiService.getClanDetails(clanTag);
      document.title = `Raids capital - ${this.clan?.name}`;
      this.raids = (await apiService.getCapitalDetails(clanTag)).items || [];
      if (this.raids.length > 0) {
        this.updateSelectedRaid();
      }
      const leaguesResponse = await apiService.getLeagues();
      this.leagues = leaguesResponse.items;
      const unrankedLeague = this.leagues.find((league) => league.name === 'Unranked');
      if (unrankedLeague) {
        this.unrankedLeagueIcon = unrankedLeague.iconUrls.medium;
      }
      await this.fetchClanMembers();
    } catch (err) {
      console.error('Erreur lors de la récupération des données :', err);
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    updateSelectedRaid() {
      this.selectedRaid = this.raids[this.selectedRaidIndex] || {};
    },
    formatDate(dateString) {
      if (!dateString) {
        return 'Date inconnue';
      }
      try {
        const formattedString = dateString.replace(
          /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d+)?Z$/,
          '$1-$2-$3T$4:$5:$6Z'
        );
        const date = new Date(formattedString);
        if (isNaN(date)) {
          throw new Error('Date invalide');
        }
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (error) {
        console.error('Date invalide :', dateString);
        return 'Date inconnue';
      }
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
    async fetchClanMembers() {
      const clanTag = this.$route.params.clanTag;
      try {
        const response = await apiService.getClanDetails(clanTag);
        this.clanMembers = response.memberList;
      } catch (error) {
        console.error('Erreur lors de la récupération des membres du clan :', error);
      } finally {
        this.loadingMembers = false;
      }
    },
    handleRaidSelected(index) {
      this.selectedRaidIndex = index;
      this.updateSelectedRaid();
    },
    updateSelectedRaidIndex(index) {
      this.selectedRaidIndex = index;
      this.updateSelectedRaid();
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
