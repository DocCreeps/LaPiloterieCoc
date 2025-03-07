<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Bandeau des Statistiques des Raids de Capital -->
    <div :class="['p-4 fixed top-0 left-0 right-0 z-10', raidStateClass]">
      <div class="container mx-auto flex flex-col lg:flex-row justify-between items-center text-white">
        <!-- Bloc gauche : Infos du Clan -->
        <div class="flex items-center">
          <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class="h-16 w-16 mr-4">
          <div>
            <h1 class="text-2xl font-bold">{{ clan?.name || "Nom du Clan" }}</h1>
          </div>
        </div>

        <!-- Bloc central : Infos de la Capitale -->
        <div class=" flex flex-col items-center text-white">
          <h2 class="text-lg font-bold">Capitale du Clan</h2>
          <p class="text-sm">Niveau Capital : {{ clan?.clanCapital?.capitalHallLevel || "N/A" }}</p>
          <img
            :src="getLeagueIcon(clan?.capitalLeague?.name)"
            alt="Ligue des Raids"
            class="mt-2 "
          />
        </div>

        <!-- Bloc droit : Statistiques des Raids -->
        <div class="text-right">
          <h2 class="text-lg font-bold">Statistiques des Raids</h2>
          <p class="text-sm">État : {{ capitalRaid.state === "ongoing" ? "En cours" : "Terminé" }}</p>
          <p class="text-sm">Loot Total : {{ capitalRaid.capitalTotalLoot || "N/A" }}</p>
          <p class="text-sm">Districts Détruits : {{ capitalRaid.enemyDistrictsDestroyed || "N/A" }}</p>
          <p class="text-sm">Attaques Totales : {{ capitalRaid.totalAttacks || "N/A" }}</p>
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="container mx-auto py-16 mt-24">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4">Résultat Raids</h2>

        <!-- Membres avec plus de 0 attaques -->
        <div v-for="member in activeMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg mb-2 flex justify-between items-center">
          <div>
            <p class="text-lg font-bold">{{ member.name }}</p>
          </div>
          <div>
            <p class="text-lg">Attaques : {{ member.attacks }}</p>
            <p class="text-lg">Ressources Lootées : {{ member.capitalResourcesLooted }}</p>
          </div>
        </div>

        <!-- Liste déroulante pour les membres avec 0 attaques -->
        <div class="bg-gray-200 p-4 rounded-lg">
          <div class="flex justify-center">
            <button @click="toggleZeroAttackList" class="bg-gray-400 px-4 py-2 rounded-lg text-white">
              {{ showZeroAttackList ? 'Masquer' : 'Afficher' }} les Membres à 0 Attaques
            </button>
          </div>
        </div>

        <div v-show="showZeroAttackList" class="mt-4">
          <div v-for="member in zeroAttackMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg mb-2 flex justify-between items-center">
            <div>
              <p class="text-lg font-bold">{{ member.name }}</p>
              <p class="text-sm text-gray-600">Tag : {{ member.tag }}</p>
            </div>
            <div>
              <p class="text-lg">Attaques : {{ member.attacks }}</p>
              <p class="text-lg">Ressources Lootées : {{ member.capitalResourcesLooted }}</p>
            </div>
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
      clan: null, // Détails du clan
      capitalRaid: {}, // Détails des raids de capitale
      members: [], // Membres participant aux raids
      clanMembers: [], // Membres du clan
      leagues: [], // Liste des ligues disponibles
      unrankedLeagueIcon: '', // Icône pour "Non classé"
      showZeroAttackList: false, // Indicateur d'affichage de la liste déroulante
      isLoading: false, // Indicateur de chargement
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchClanMembers();
    this.fetchCapitalRaidDetails();
    this.fetchLeagues(); // Récupération des données de ligues pour les icônes
  },
  mounted() {
    // Définit dynamiquement le titre de la page
    document.title = `Détail des raids Capital du clan - ${this.clan?.name || 'Chargement...'}`;
  },
  methods: {
    fetchClanMembers() {
      const clanTag = this.$route.params.clanTag;
      return apiService.getClanDetails(clanTag).then(response => {
        this.clanMembers = response.memberList;
        console.log("Membres du Clan :", this.clanMembers);
      }).catch(error => {
        console.error("Erreur lors de la récupération des membres du clan :", error);
      });
    },
    // Récupère les détails du clan
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
        console.log('Détails du Clan :', this.clan);
        // Met à jour le titre une fois les données récupérées
        document.title = `Détail des raids Capital du clan - ${this.clan.name}`;
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
      });
    },
    // Récupère les détails des raids de capitale
    fetchCapitalRaidDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getCapitalDetails(clanTag).then(response => {
        this.capitalRaid = response.items[0];
        this.members = this.capitalRaid.members || [];
        console.log('Détails des Raids de Capital :', this.capitalRaid);
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails des raids de capital :', error);
      });
    },
    // Récupère la liste des ligues pour les icônes
    fetchLeagues() {
      apiService.getLeagues().then(response => {
        this.leagues = response.items;
        // Définir l'icône par défaut pour "Non classé"
        const unrankedLeague = this.leagues.find(league => league.name === 'Unranked');
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.medium;
        }
        console.log('Ligues Disponibles :', this.leagues);
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    // Récupère l'icône correspondant au nom d'une ligue
    getLeagueIcon(leagueName) {
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    // Rafraîchir les données
    refreshData() {
      this.isLoading = true; // Active l'indicateur de chargement
      Promise.all([this.fetchClanDetails(), this.fetchCapitalRaidDetails()])
        .then(() => console.log('Données actualisées.'))
        .finally(() => {
          this.isLoading = false; // Désactive l'indicateur de chargement
        });
    },
    // Gère l'affichage/masquage de la liste des membres à 0 attaques
    toggleZeroAttackList() {
      this.showZeroAttackList = !this.showZeroAttackList;
    },
  },
  computed: {
    // Fusion des données des membres de clan et de raids
    enrichedMembers() {
      const mergedMembers = this.clanMembers.map(clanMember => {
        const raidMember = this.members.find(member => member.tag === clanMember.tag);
        return raidMember || {
          tag: clanMember.tag,
          name: clanMember.name,
          attacks: 0,
          attackLimit: 0,
          bonusAttackLimit: 0,
          capitalResourcesLooted: 0,
        };
      });
      // Trier par ressources lootées (ordre décroissant)
      return mergedMembers.sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted);
    },
    // Membres actifs ayant effectué au moins une attaque
    activeMembers() {
      return this.enrichedMembers.filter(member => member.attacks > 0);
    },
    // Membres avec 0 attaques
    zeroAttackMembers() {
      return this.enrichedMembers.filter(member => member.attacks === 0);
    },
    // Retourne la classe CSS pour l'état des raids (en cours ou terminé)
    raidStateClass() {
      return this.capitalRaid.state === "ongoing" ? 'bg-green-500' : 'bg-red-500';
    },
  },
};
</script>



<style scoped>
.bg-green-500 {
  background-color: #48bb78; /* Vert pour les raids en cours */
}
.bg-red-500 {
  background-color: #f56565; /* Rouge pour les raids terminés */
}
.text-white {
  color: #ffffff;
}
.loader {
  border: 3px solid #f3f3f3; /* Couleur de l'animation */
  border-top: 3px solid #3498db; /* Couleur active */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

