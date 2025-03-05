<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto py-8">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-4 text-center">{{ member?.name }}</h1>
        <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
          <div class="lg:w-1/2 mb-4 lg:mb-0">
            <p class="text-lg"><strong>Rôle :</strong> {{ translateRole(member?.role) }}</p>
            <p class="text-lg"><strong>Niveau :</strong> {{ member?.expLevel }}</p>
            <p class="text-lg"><strong>HDV :</strong> {{ member?.townHallLevel }}</p>
            <p class="text-lg"><strong>Base de l'ouvrier :</strong> {{ member?.builderHallLevel }}</p>
            <p class="text-lg"><strong>Trophées :</strong> {{ member?.trophies }}</p>
            <p class="text-lg"><strong>Trophées de la base de l'ouvrier :</strong> {{ member?.builderBaseTrophies }}</p>
          </div>
          <div class="lg:w-1/2">
            <img :src="member.league?.iconUrls.large" alt="League Badge" class="w-32 h-32 mx-auto mb-4">
            <p class="text-lg"><strong>Ligue :</strong> {{ member.league?.name }}</p>
          </div>
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
      member: null
    };
  },
  created() {
    this.fetchMemberDetails();
  },
  methods: {
    fetchMemberDetails() {
      const memberTag = this.$route.params.memberTag; // Supprime l'ajout de # ici
      apiService.getMemberDetails(memberTag).then(response => {
        this.member = response;
        console.log('Détails du membre :', this.member);
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du membre :', error);
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
    }
  }
}
</script>

<style scoped>
/* Tes styles ici */
</style>
