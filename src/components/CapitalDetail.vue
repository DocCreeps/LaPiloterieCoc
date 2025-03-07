<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Bandeau des Statistiques des Raids de Capital -->
    <div :class="['p-4 fixed top-0 left-0 right-0 z-10', raidStateClass]">
      <div class="container mx-auto text-center">
        <h1 class="text-2xl font-bold mb-2">Détails des Raids de Capital</h1>
        <div class="flex flex-wrap justify-center md:justify-between items-center mt-2 text-sm md:text-lg text-white">
          <span>État : {{ capitalRaid.state === "ongoing" ? "En cours" : "Terminé" }}</span>
          <span>Loot Total : {{ capitalRaid.capitalTotalLoot }}</span>
          <span>Raids Complétés : {{ capitalRaid.raidsCompleted }}</span>
          <span>Districts Détruits : {{ capitalRaid.enemyDistrictsDestroyed }}</span>
          <span>Attaques Totales : {{ capitalRaid.totalAttacks }}</span>
        </div>
        <!-- Bouton Actualiser avec Animation -->
        <div class="flex justify-center mt-4">
          <button
            @click="refreshData"
            :disabled="isLoading"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <span v-if="isLoading" class="loader mr-2"></span> <!-- Animation -->
            {{ isLoading ? 'Actualisation...' : 'Actualiser les Données' }}
          </button>
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
            <p class="text-sm text-gray-600">Tag : {{ member.tag }}</p>
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
      clan: null,
      capitalRaid: {},
      members: [],
      clanMembers: [],
      showZeroAttackList: false,
      isLoading: false, // Indicateur de chargement
    };
  },
  created() {
    this.fetchClanMembers();
    this.fetchCapitalRaidDetails();
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
    fetchCapitalRaidDetails() {
      const clanTag = this.$route.params.clanTag;
      return apiService.getCapitalDetails(clanTag).then(response => {
        this.capitalRaid = response.items[0];
        this.members = this.capitalRaid.members || [];
        console.log("Détails des Raids de Capital :", this.capitalRaid);
      }).catch(error => {
        console.error("Erreur lors de la récupération des détails des raids de capital :", error);
      });
    },
    refreshData() {
      this.isLoading = true; // Active le chargement
      Promise.all([this.fetchClanMembers(), this.fetchCapitalRaidDetails()])
        .then(() => {
          console.log('Données actualisées.');
        })
        .finally(() => {
          this.isLoading = false; // Désactive le chargement
        });
    },
    toggleZeroAttackList() {
      this.showZeroAttackList = !this.showZeroAttackList;
    },
  },
  computed: {
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
      return mergedMembers.sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted);
    },
    activeMembers() {
      return this.enrichedMembers.filter(member => member.attacks > 0);
    },
    zeroAttackMembers() {
      return this.enrichedMembers.filter(member => member.attacks === 0);
    },
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

