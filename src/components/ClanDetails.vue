<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto py-8 flex flex-col lg:flex-row lg:justify-between">
      <!-- Bloc de gauche : Infos du clan -->
      <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mb-4 lg:mb-0">
        <!-- Icône et Nom du Clan -->
        <div class="flex flex-col items-center mb-4">
          <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class="h-16 w-16">
          <h1 class="text-2xl font-bold mt-2">{{ clan?.name || "Nom du Clan" }}</h1>
        </div>

        <!-- Section Détails : Ligue de Guerre, Infos & Ligue des Raids -->
        <div class="flex justify-between items-center mt-4">
          <!-- Ligue de Guerre -->
          <div class="flex flex-col items-center">
            <img :src="getLeagueIcon(clan?.warLeague?.name)" alt="Ligue des Guerres" class="league-icon mb-1">
            <p class="text-sm text-gray-600">Ligue Guerre</p>
          </div>

          <!-- Niveau et Trophées -->
          <div class="text-center">
            <p class="text-lg font-bold">Niveau</p>
            <p class="text-lg">{{ clan?.clanLevel }}</p>
            <hr class="my-2">
            <p class="text-lg font-bold">Trophées</p>
            <p class="text-lg">{{ clan?.clanPoints }}</p>
          </div>

          <!-- Ligue des Raids Capital -->
          <div class="flex flex-col items-center">
            <img :src="getLeagueIcon(clan?.capitalLeague?.name)" alt="Ligue des Raids" class="league-icon mb-1">
            <p class="text-sm text-gray-600">Capital Raids</p>
<!--            <p class="text-lg">Capital {{ clan?.clanCapital.capitalHallLevel }}</p>-->
          </div>
        </div>
      </div>

      <!-- Bloc du milieu : Autres informations -->
      <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mb-4 lg:mb-0">
        <p class="text-lg">{{ clan?.description || "Description indisponible." }}</p>

        <p class="text-lg">Membres : {{ clan?.members }}/50</p>
        <div class="text-center mt-4 ">
          <div class="player-label-holder flex flex-row justify-center">
            <img v-for="label in clan?.labels" :key="label.id" :src="label.iconUrls.small" :title="label.name" class="player-label mx-2">
          </div>
        </div>


      </div>

      <!-- Bloc de droite : Statistiques de guerre -->
      <div class="bg-blue-500 p-4 rounded-lg shadow-md text-white w-full lg:w-1/3" v-if="clan.isWarLogPublic === 'yes'">
        <h2 class="text-xl font-bold mb-4 text-center">Statistiques de Guerre</h2>
        <div class="flex flex-wrap justify-center">
          <div class="flex flex-col items-center bg-green-600 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Gagné</p>
            <p class="text-lg">{{ clan?.warWins || 0 }}</p>
          </div>
          <div class="flex flex-col items-center bg-red-500 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Perdu</p>
            <p class="text-lg">{{ clan?.warLosses || 0 }}</p>
          </div>
          <div class="flex flex-col items-center bg-gray-500 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Égalité</p>
            <p class="text-lg">{{ clan?.warTies || 0 }}</p>
          </div>
        </div>
        <div class="flex flex-col items-center bg-black p-2 rounded-lg m-1 mt-4">
          <p class="text-lg font-bold text-white">Total</p>
          <p class="text-lg text-white">{{ (clan?.warWins || 0) + (clan?.warLosses || 0) + (clan?.warTies || 0) }}</p>
        </div>
      </div>
      <div class="bg-red-500 p-4 rounded-lg shadow-md text-white w-full lg:w-1/3" v-else>
        <h2 class="text-xl font-bold mb-4 text-center">Journal de Guerre Privé</h2>
        <p class="text-center">Les statistiques de guerre sont privées.</p>
      </div>


    </div>

    <div class="container mx-auto py-8 flex justify-center gap-4">
      <!-- Bouton pour Détails de Guerre -->
      <button v-if="clan.isWarLogPublic === 'yes'"
        @click="goToWarsDetail(clan.tag)"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Voir Détails de Guerre
      </button>

      <!-- Bouton pour Raids de Capital -->
      <button
        @click="goToCapitalRaid(clan.tag)"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Voir Raids de Capital
      </button>
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
      clan: null,
      leagues: [],
      unrankedLeagueIcon: '',
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchUnrankedLeagueIcon();
    this.fetchLeagues();
  },
  mounted() {
    document.title = `Détails du clan - ${this.clan?.name }`;
  },
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
        document.title = `Détails du Clan - ${this.clan.name}`;
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
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
    goToMemberDetails(memberTag) {
      this.$router.push(`/players/${encodeURIComponent(memberTag)}`);
    },
    goToWarsDetail(clanTag) {
      // Redirige vers la page des détails de guerre
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/wars/${cleanedClanTag}`);
    },
    goToCapitalRaid(clanTag) {
      // Redirige vers la page des Raids de Capital
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}/CapitalRaid`);
    },
    fetchUnrankedLeagueIcon() {
      // Récupère l'icône "Non classé"
      apiService.getLeagues().then(response => {
        const unrankedLeague = response.items.find(league => league.name === 'Unranked');
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    fetchLeagues() {
      apiService.getLeagues().then(response => {
        this.leagues = response.items;
        // Récupère l'icône "Non classé"
        const unrankedLeague = this.leagues.find(league => league.name === 'Unranked');
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    getLeagueIcon(leagueName) {
      // Trouve l'icône correspondant au nom de la ligue
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
  },
};
</script>


<style scoped>
/* Tes styles ici */
</style>
