<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full lg:w-2/3">
      <div class="text-center mb-4">
        <h1 class="text-3xl font-bold">{{ member?.name }}</h1>
        <h2 class="text-xl text-gray-600">#{{ member?.tag }} <a :href="'https://link.clashofclans.com/?action=OpenPlayerProfile&tag=' + member?.tag" target="_blank"><i class="fas fa-external-link-alt"></i></a></h2>
        <hr class="my-4">
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="text-center">
          <p class="text-lg">{{ member?.league?.name }}</p>
          <p class="text-2xl font-bold">{{ member?.trophies }} <i class="fas fa-trophy"></i></p>
          <img :src="member?.league?.iconUrls.medium" alt="League Badge" class="mx-auto mt-2">
        </div>
        <div class="text-center">
          <div class="grid grid-cols-1 gap-2 player-details">
            <div class="flex justify-between">
              <span>Expérience:</span>
              <span><i class="fas fa-certificate"></i> <strong>{{ member?.expLevel }}</strong></span>
            </div>
            <div class="flex justify-between">
              <span>Trophées:</span>
              <span><i class="fas fa-trophy"></i> <strong>{{ member?.trophies }}</strong> | <i class="far fa-trophy"></i> <strong>{{ member?.builderBaseTrophies }}</strong></span>
            </div>
            <div class="flex justify-between">
              <span>Meilleurs Trophées:</span>
              <span><i class="fas fa-trophy-alt"></i> <strong>{{ member?.bestTrophies }}</strong> | <i class="far fa-trophy-alt"></i> <strong>{{ member?.bestBuilderBaseTrophies }}</strong></span>
            </div>
            <div class="flex justify-between">
              <span>Trophées Légendaires:</span>
              <span><i class="fas fa-trophy legend"></i> <strong>{{ member?.legendStatistics.legendTrophies }}</strong></span>
            </div>
            <div class="flex justify-between">
              <span>Dons:</span>
              <span><i class="fas fa-long-arrow-alt-up"></i> <strong>{{ member?.donations }}</strong> | <i class="fas fa-long-arrow-alt-down"></i> <strong>{{ member?.donationsReceived }}</strong></span>
            </div>
            <div class="flex justify-between">
              <span>Ratio:</span>
              <span><strong><i class="fas fa-balance-scale-left"></i>{{ (member?.donations / member?.donationsReceived || 0).toFixed(2) }}</strong></span>
            </div>
            <div class="flex justify-between">
              <span>Activité:</span>
              <span><i class="fad fa-sword"></i> <strong>{{ member?.attackWins }}</strong> | <i class="fas fa-shield-alt"></i> <strong>{{ member?.defenseWins }}</strong></span>
            </div>
          </div>
          <div class="text-center mt-4 ">
            <div class="player-label-holder flex flex-row">
              <img v-for="label in member?.labels" :key="label.id" :src="label.iconUrls.medium" :title="label.name" class="player-label mx-2">
            </div>
          </div>
        </div>

        <div class="text-center">
          <p class="text-lg font-bold">{{ member?.clan.name }}</p>
          <p class="text-2xl semibold">{{ translateRole(member?.role) }}</p>
          <img :src="member?.clan?.badgeUrls?.large" alt="Clan Badge" class="mx-auto mt-2">
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
      const memberTag = this.$route.params.memberTag; // Utiliser directement le tag du membre sans le #
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
.player-label {
  height: 32px;
  width: 32px;
}
</style>
