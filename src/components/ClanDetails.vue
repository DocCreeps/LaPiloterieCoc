<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto py-8 flex flex-col lg:flex-row lg:justify-between">
      <!-- Bloc de gauche : Infos du clan -->
      <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mb-4 lg:mb-0">
        <img :src="clan?.badgeUrls?.small" alt="Clan Badge" class="w-16 h-16 mx-auto mb-4">
        <h1 class="text-3xl font-bold text-center">{{ clan?.name }}</h1>
        <p class="text-lg text-center">Niveau : {{ clan?.clanLevel }}</p>
        <p class="text-lg text-center">Trophées Généraux : {{ clan?.clanPoints }}</p>
      </div>

      <!-- Bloc du milieu : Autres informations -->
      <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mb-4 lg:mb-0">
        <p class="text-lg">{{ clan?.description }}</p>
        <p class="text-lg">Ligue des Guerres : {{ clan?.warLeague?.name }}</p>
        <p class="text-lg">Ligue des Raids : {{ clan?.capitalLeague?.name }}</p>
      </div>

      <!-- Bloc de droite : Bandeau des statistiques de guerre -->
      <div class="bg-blue-500 p-4 rounded-lg shadow-md text-white w-full lg:w-1/3">
        <h2 class="text-xl font-bold mb-4 text-center">Statistiques de Guerre</h2>
        <div class="flex flex-wrap justify-center">
          <div class="flex flex-col items-center bg-green-500 p-2 rounded-lg m-1">
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
        </div>
        <div class="flex flex-col items-center bg-black p-2 rounded-lg m-1 mt-4">
          <p class="text-lg font-bold text-white">Total</p>
          <p class="text-lg text-white">{{ clan?.warWins + clan?.warLosses + clan?.warTies }}</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto py-8">
      <h2 class="text-2xl font-bold mb-4 text-center">Liste des Membres</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="member in clan?.memberList"
          :key="member.tag"
          @click="goToMemberDetails(member.tag)"
        class="bg-white p-4 rounded-lg shadow-md cursor-pointer"
        >
        <div class="flex items-center mb-4">
          <img :src="member.league?.iconUrls.small" alt="League Badge" class="w-12 h-12 mr-4">
          <div>
            <h3 class="text-xl font-semibold">{{ member.name }}</h3>
            <p class="text-gray-600">{{ translateRole(member.role) }}</p>
          </div>
        </div>
        <p class="text-gray-600">Niveau : {{ member.expLevel }}</p>
        <p class="text-gray-600">Trophées : {{ member.trophies }}</p>
        <p class="text-gray-600">HDV : {{ member.townHallLevel }}</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import apiService from '../apiService';
export default {
  data() {
    return {
      clan: null
    };
  },
  created() {
    this.fetchClanDetails();
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
    translateRole(role) {
      const roles = {
        leader: 'Chef',
        coLeader: 'Adjoint',
        admin: 'Aîné',
        member: 'Membre'
      };
      return roles[role] || role;
    },
    goToMemberDetails(memberTag) {
      this.$router.push(`/players/${encodeURIComponent(memberTag)}`);
    }
  }
}
</script>

<style scoped>
/* Tes styles ici */
</style>
