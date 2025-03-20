<template>
  <div class="min-h-screen bg-gray-100" v-if="clan">
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
    </div>


      <ClanMemberList :clan="clan" :icons="icons" />

  </div>
</template>

<script>
import apiService from '../apiService.js';
import icons from '@/assets/icons.js';
import ClanHeader from '@/components/ClanHeader.vue';
import ClanMemberList from '@/components/ClanMemberList.vue';

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
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchUnrankedLeagueIcon();
    this.fetchLeagues();
  },
  mounted() {
    document.title = `Détails du clan - ${this.clan?.name}`;
  },
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService
        .getClanDetails(clanTag)
        .then((response) => {
          this.clan = response;
          document.title = `Détails du Clan - ${this.clan.name}`;
          this.fetchMemberDetails();
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des détails du clan :', error);
        });
    },
    goToWarsDetail(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/wars/${cleanedClanTag}`);
    },
    goToCapitalRaid(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}/CapitalRaid`);
    },
    fetchUnrankedLeagueIcon() {
      apiService
        .getLeagues()
        .then((response) => {
          const unrankedLeague = response.items.find((league) => league.name === 'Unranked');
          if (unrankedLeague) {
            this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des ligues :', error);
        });
    },
    fetchLeagues() {
      apiService
        .getLeagues()
        .then((response) => {
          this.leagues = response.items;
          const unrankedLeague = this.leagues.find((league) => league.name === 'Unranked');
          if (unrankedLeague) {
            this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des ligues :', error);
        });
    },
    fetchMemberDetails() {
      const memberTags = this.clan.memberList.map((member) => member.tag);
      Promise.all(memberTags.map((tag) => apiService.getMemberDetails(tag)))
        .then((responses) => {
          responses.forEach((memberDetails, index) => {
            this.clan.memberList[index] = { ...this.clan.memberList[index], ...memberDetails };
          });
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des détails des membres :', error);
        });
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
