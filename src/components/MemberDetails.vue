<template>
  <div class="min-h-screen bg-gray-100" v-if="member">
    <div class="container mx-auto py-8">
      <!-- Carte Principale en Haut -->
      <div class="bg-white p-8 rounded-lg shadow-md w-full mb-8">
        <div class="text-center mb-4">
          <h1 class="text-3xl font-bold">{{ member?.name }}</h1>
          <h2 class="text-xl text-gray-600">{{ member?.tag }} </h2>
          <hr class="my-4">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="text-center">
            <!-- Badge de Ligue -->
            <img
              :src="member?.league?.iconUrls?.small || unrankedLeagueIcon"
              alt="League Badge"
              class="mx-auto mt-2"
            >
            <!-- Nom de la Ligue -->
            <p class="text-lg">{{ member?.league?.name || "Non classé" }}</p>
            <!-- Points de Trophées -->
            <p class="text-2xl font-bold">{{ member?.trophies || 0 }} <i class="fas fa-trophy"></i></p>
          </div>

          <div class="text-center">
            <div class="grid grid-cols-1 gap-2 player-details">
              <div class="flex justify-between">
                <span>Expérience:</span>
                <span class="flex flex-row"> <img :src="icons['icon/xp']" alt="Experience" class="h-6 w-6"/><strong class="ml-2">{{ member?.expLevel }}</strong></span>
              </div>
              <div class="flex justify-between">
                <span>Trophées:</span>
                <span class="flex flex-row"> <img :src="icons['icon/Trophy']" alt="Trophies" class="h-6 w-6"/> <strong class="ml-2 mr-2">{{ member?.trophies }}</strong> |
                       <img :src="icons['icon/mdo_trophy']" alt="MDO Trophies" class="h-6 w-6 ml-2"/> <strong class="ml-2">{{ member?.builderBaseTrophies }}</strong></span>
              </div>
              <div class="flex justify-between">
                <span>Meilleurs Trophées:</span>
                <span class="flex flex-row"><img :src="icons['icon/Trophy']" alt="Trophies" class="h-6 w-6"/> <strong class="ml-2 mr-2">{{ member?.bestTrophies }}</strong> |
                      <img :src="icons['icon/mdo_trophy']" alt="MDO Trophies" class="h-6 w-6 ml-2"/> <strong class="ml-2">{{ member?.bestBuilderBaseTrophies }}</strong></span>
              </div>

              <div class="flex justify-between">
                <span>Dons:</span>
                <span class="flex flex-row"><img :src="icons['icon/up']" alt="Membres" class="h-5 w-5"/> <strong class="ml-2 mr-2">{{ member?.donations }}</strong> |
                      <img :src="icons['icon/down']" alt="Membres" class="h-5 w-5 ml-2"/> <strong class="ml-2">{{ member?.donationsReceived }}</strong></span>
              </div>
              <div class="flex justify-between">
                <span>Ratio:</span>
                <span class="flex flex-row"><img :src="icons['icon/cdc']" alt="Sword" class="h-7 w-7"/><strong class="ml-2">{{ (member?.donations / member?.donationsReceived || 0).toFixed(2) }}</strong></span>
              </div>
              <div class="flex justify-between">
                <span>Activité:</span>
                <span class="flex flex-row"><img :src="icons['icon/Sword']" alt="Sword" class="h-7 w-7"/> <strong class="ml-2 mr-2">{{ member?.attackWins }}</strong> |
                    <img :src="icons['icon/Shield']" alt="Shield" class="h-7 w-7 ml-2"/> <strong  class="ml-2">{{ member?.defenseWins }}</strong></span>
              </div>
            </div>
            <div class="text-center mt-4 ">
              <div class="player-label-holder flex flex-row justify-center">
                <img v-for="label in member?.labels" :key="label.id" :src="label.iconUrls.medium" :title="label.name" class="player-label mx-2">
              </div>
            </div>
          </div>

          <div class="text-center cursor-pointer"
               :key="member.clan.tag"
               @click="getClanDetails(member?.clan.tag)">
            <img :src="member?.clan?.badgeUrls?.small" alt="Clan Badge" class="mx-auto mt-2">
            <p class="text-lg font-bold">{{ member?.clan.name }}</p>
            <p class="text-2xl semibold">{{ translateRole(member?.role) }}</p>

          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Stats de Guerre à Gauche -->
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4 text-center">Statistiques de Guerre</h2>

        </div>

        <!-- Autres Stats à Droite -->
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4 text-center">Autres Statistiques</h2>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../apiService';
import icons from '@/assets/icons.js';

export default {

  data() {
    return {
      member: null,
      unrankedLeagueIcon: "", // Icône "Non classé"
      icons: icons,
    };
  },
  created() {
    this.fetchUnrankedLeagueIcon(); // Récupérer l'icône "Unranked" lors du chargement
    this.fetchMemberDetails();
  },
  mounted() {
    document.title = `${this.member?.name }`;
  },
  methods: {
    fetchMemberDetails() {
      const memberTag = this.$route.params.memberTag; // Utiliser directement le tag du membre sans le #
      apiService.getMemberDetails(memberTag).then(response => {
        this.member = response;
        document.title = `Détails du clan - ${this.member?.name }`;
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du membre :', error);
      });
    },
    fetchUnrankedLeagueIcon() {
      apiService.getLeagues().then(response => {
        // Trouver l'entrée correspondant à "Unranked"
        const unrankedLeague = response.items.find(league => league.name === "Unranked");
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    translateRole(role) {
      const roles = {
        leader: 'Chef',
        coLeader: 'Adjoint',
        admin: 'Aîné',
        member: 'Membre',
      };
      return roles[role] || role;
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
    },

  },
};
</script>


<style scoped>
/* Tes styles ici */
.player-label {
  height: 32px;
  width: 32px;
}
</style>
