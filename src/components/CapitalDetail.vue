<template>
  <!-- Bandeau des Statistiques des Raids de Capital -->
  <div :class="['p-4 fixed top-0 left-0 right-0 z-10', raidStateClass]">
    <div class="container mx-auto flex flex-col lg:flex-row justify-between items-center text-white">
      <!-- Bloc gauche : Infos du Clan -->
      <div class="flex items-center">
        <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class="h-16 w-16 mr-4 cursor-pointer" :key="clan.tag"
             @click="getClanDetails(clan.tag)">
        <div>
          <h1 class="text-2xl font-bold">{{ clan?.name || "Nom du Clan" }}</h1>
        </div>
      </div>

      <!-- Bloc central : Infos de la Capitale -->
      <div class="flex flex-col items-center text-white">
        <h2 class="text-lg font-bold">Capitale du Clan</h2>
        <p class="text-sm">Niveau Capital : {{ clan?.clanCapital?.capitalHallLevel || "N/A" }}</p>
        <img
          :src="getLeagueIcon(clan?.capitalLeague?.name)"
          alt="Ligue des Raids"
          class="mt-2"
        />
      </div>

      <!-- Bloc droit : Statistiques des Raids -->
      <div class="text-right">
        <h2 class="text-lg font-bold">Statistiques des Raids</h2>
        <p class="text-sm">État : {{ capitalRaid.state === "ongoing" ? "En cours" : "Terminé" }}</p>
        <p class="text-sm">Loot Total : {{ capitalRaid.capitalTotalLoot || "N/A" }}</p>
        <p class="text-sm">Capital Détruite : {{ capitalRaid.raidsCompleted || "N/A" }}</p>
        <p class="text-sm">Districts Détruits : {{ capitalRaid.enemyDistrictsDestroyed || "N/A" }}</p>
        <p class="text-sm">Attaques Totales : {{ capitalRaid.totalAttacks || "N/A" }}</p>
      </div>
    </div>
  </div>

  <!-- Contenu Principal -->
  <div class="flex justify-center py-16 mt-24">
    <div class="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md flex space-x-8">
      <div class="w-1/2">
        <h2 class="text-xl font-bold mb-4 text-center">Membres avec Attaques</h2>
        <div class="space-y-4">
          <div v-for="member in activeMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg text-center">
            <p class="text-lg font-bold">{{ member.name }}</p>
            <div class="flex flex-row justify-between">
              <p class="text-sm">Attaques : {{ member.attacks }}/6</p>
              <p class="text-lg">Ressources Lootées : {{ member.capitalResourcesLooted }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-1/2">
        <h2 class="text-xl font-bold mb-4 text-center">Membres sans Attaques</h2>
        <div class="space-y-4">
          <div v-for="member in zeroAttackMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg text-center">
            <p class="text-lg font-bold">{{ member.name }}</p>
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
      }).catch(error => {
        console.error("Erreur lors de la récupération des membres du clan :", error);
      });
    },
    // Récupère les détails du clan
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
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
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    // Récupère l'icône correspondant au nom d'une ligue
    getLeagueIcon(leagueName) {
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    // Gère l'affichage/masquage de la liste des membres à 0 attaques
    toggleZeroAttackList() {
      this.showZeroAttackList = !this.showZeroAttackList;
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
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

</style>

