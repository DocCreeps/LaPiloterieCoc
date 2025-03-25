<template>
  <div class="min-h-screen bg-gray-100" v-if="!loading && clan">
    <div class="container mx-auto py-8 flex flex-col lg:flex-row lg:justify-between">
      <ClanHeader
        :clan="clan"
        :icons="icons"
        :leagues="leagues"
        :unrankedLeagueIcon="unrankedLeagueIcon"
      />
    </div>

    <div class="container mx-auto py-8 flex justify-center gap-4">
      <button
        v-if="clan.isWarLogPublic"
        @click="goToWarsDetail(clan.tag)"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Détails des Guerres
      </button>
      <button
        @click="goToCapitalRaid(clan.tag)"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Raids de Capital
      </button>
      <p v-if="!clan.isWarLogPublic">Les guerres de ce clan ne sont pas publiques.</p>
    </div>

    <ClanMemberList :clan="clan" :icons="icons" />
  </div>
  <div v-else-if="loading" class="min-h-screen flex justify-center items-center">
    Chargement des détails du clan...
  </div>
  <div v-else-if="error" class="min-h-screen flex justify-center items-center text-red-500">
    {{ error }}
  </div>
</template>

<script>
import apiService from '../apiService.js';
import icons from '@/assets/icons.js';
import ClanHeader from '@/components/ClanHeader.vue';
import ClanMemberList from '@/components/ClanComponent/ClanMemberList.vue';

export default {
  components: {
    ClanHeader,
    ClanMemberList,
  },
  data() {
    return {
      clan: null,
      leagues: [],
      unrankedLeagueIcon: '',
      icons: icons,
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    document.title = `Détails du clan - ${this.clan?.name}`;
  },
  methods: {
    async fetchData() {
      try {
        await this.fetchClanDetails();
        await this.fetchLeagues();
        await this.fetchMemberDetails();
      } catch (err) {
        this.error = 'Erreur lors de la récupération des données. Veuillez réessayer.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      this.clan = await apiService.getClanDetails(clanTag);
      document.title = `Détails du Clan - ${this.clan.name}`;
    },
    goToWarsDetail(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/wars/${cleanedClanTag}`);
    },
    goToCapitalRaid(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}/CapitalRaid`);
    },
    async fetchLeagues() {
      const response = await apiService.getLeagues();
      this.leagues = response.items;
      const unrankedLeague = this.leagues.find(
        (league) => league.name === 'Unranked'
      );
      if (unrankedLeague) {
        this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
      }
    },
    async fetchMemberDetails() {
      const memberTags = this.clan.memberList.map((member) => member.tag);
      const responses = await Promise.all(
        memberTags.map((tag) => apiService.getMemberDetails(tag))
      );
      responses.forEach((memberDetails, index) => {
        this.clan.memberList[index] = {
          ...this.clan.memberList[index],
          ...memberDetails,
        };
      });
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
