<template>
  <!-- Bandeau des Statistiques des Raids de Capital -->
  <div v-if="clan" :class="['p-4 fixed top-0 left-0 right-0 z-10', raidStateClass]">
    <div class="container mx-auto flex justify-center text-white cursor-pointer" :key="clan.tag"
         @click="getClanDetails(clan.tag)">
      <img :src="clan.badgeUrls?.medium" alt="Clan Badge" class="h-16 w-16 mr-4">
      <div>
        <h2 class="text-2xl font-bold">{{ clan.name || "Nom du Clan" }}</h2>
        <h1 class="text-2xl font-bold">Capital de clan</h1>
      </div>
    </div>
  </div>

  <!-- Carte de la Capitale -->
  <div class="container mx-auto py-16 mt-24">
    <div class="bg-white p-6 rounded-lg shadow-lg mx-auto mb-8 max-w-4xl text-center">
      <div class="flex flex-col items-center mb-4">
        <img
          :src="getLeagueIcon(clan?.capitalLeague?.name)"
          alt="Ligue des Raids"
          class="h-12 w-12 mb-2"
        />
        <h2 class="text-xl font-bold">Détails Capitale</h2>
      </div>

      <div v-if="clan?.clanCapital?.districts && clan.clanCapital.districts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(district, index) in clan.clanCapital.districts" :key="index" class="p-4 border rounded bg-gray-100 text-center">
          <p class="text-sm">
            <strong>{{ district.name || "N/A" }} </strong>
          </p>
          <div class="flex justify-center items-center">
            <img
              v-if="district.name === 'Capital Peak' && getCapitalHallImage(district.districtHallLevel)"
              :src="getCapitalHallImage(district.districtHallLevel)"
              :title="'Capital ' + district.districtHallLevel "
              :alt="'Capital' + district.districtHallLevel "
              class="w-20 h-20"
            />
            <img
              v-else
              :src="getDistrictHallImage(district.districtHallLevel)"
              :title="'District ' + district.districtHallLevel "
              :alt="'District' + district.districtHallLevel "
              class="w-20 h-20"
            />
          </div>
        </div>
      </div>



    </div>

    <!-- Sélecteur de Raids -->
    <div class="bg-gray-50 p-4 rounded-lg shadow-md mx-auto mb-8 max-w-4xl">
      <label for="raidSelect" class="block text-lg font-bold mb-2">Sélectionnez un Raid :</label>
      <select
        id="raidSelect"
        v-model="selectedRaidIndex"
        @change="updateSelectedRaid"
        class="w-full p-2 border rounded-md"
      >
        <option
          v-for="(raid, index) in raids"
          :key="index"
          :value="index"
        >
          Raids du {{ formatDate(raid.startTime) }} au {{ formatDate(raid.endTime) }}
        </option>
      </select>
    </div>

    <!-- Informations du Raid Sélectionné -->
    <div v-if="selectedRaid" class="bg-white p-6 rounded-lg shadow-lg mx-auto mb-8 max-w-4xl">
      <h2 class="text-lg font-bold">Informations du Raid Sélectionné</h2>
      <p class="text-sm"><strong>Raids du :</strong> {{ formatDate(selectedRaid.startTime) }} au {{ formatDate(selectedRaid.endTime) }}</p>
      <p class="text-sm"><img :src="icons['icon/pillage']" alt="étoiles" class="h-15 w-15 inline-block "/> : {{ selectedRaid.capitalTotalLoot || "N/A" }}</p>
      <p class="text-sm"><strong>Raids Complétés :</strong> {{ selectedRaid.raidsCompleted || "N/A" }}</p>
      <p class="text-sm"><strong>Districts Détruits :</strong> {{ selectedRaid.enemyDistrictsDestroyed || "N/A" }}</p>
      <p class="text-sm"><img :src="icons['icon/capital_atk']" alt="étoiles" class="h-10 w-10 inline-block"/> {{ selectedRaid.totalAttacks || "N/A" }}</p>
    </div>
  </div>
  <div v-if="selectedRaid.members" class="flex justify-center py-16 mt-24">
    <div class="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md flex space-x-8">
      <div class="w-1/2">
        <h2 class="text-xl font-bold mb-4 text-center">Membres avec Attaques</h2>
        <div class="space-y-4">
          <div v-for="member in activeMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg text-center">
            <p class="text-lg font-bold">{{ member.name }}</p>
            <div class="flex flex-row justify-between">
              <p class="text-sm"><img :src="icons['icon/capital_atk']" alt="étoiles" class="h-10 w-10 inline-block"/> {{ member.attacks }}/6</p>
              <p class="text-lg"><img :src="icons['icon/Joyaux']" alt="étoiles" class="h-10 w-10 inline-block"/> {{ member.capitalResourcesLooted }}</p>
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
import icons from '@/assets/icons.js';

export default {
  data() {
    return {
      clan: null, // Détails du clan
      raids: [], // Liste des raids de capitale
      selectedRaidIndex: null, // Index du raid sélectionné
      selectedRaid: {}, // Données du raid sélectionné
      leagues: [], // Liste des ligues disponibles
      unrankedLeagueIcon: '', // Icône pour "Non classé"
      raidStateClass: 'bg-green-500', // Classe par défaut pour raidStateClass
      clanMembers: [], // Membres du clan
      icons : icons,
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchCapitalRaidDetails();
    this.fetchLeagues();
    this.fetchClanMembers();
  },
  methods: {
    // Récupère les détails du clan
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
      });
    },
    // Récupère les détails des raids de capitale
    fetchCapitalRaidDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getCapitalDetails(clanTag).then(response => {
        this.raids = response.items || [];
        if (this.raids.length > 0) {
          this.selectedRaidIndex = 0; // Par défaut, le premier raid
          this.updateSelectedRaid();
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des raids de capital :', error);
      });
    },
    // Récupère la liste des ligues pour les icônes
    fetchLeagues() {
      apiService.getLeagues().then(response => {
        this.leagues = response.items;
        const unrankedLeague = this.leagues.find(league => league.name === 'Unranked');
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.medium;
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    // Mets à jour le raid sélectionné
    updateSelectedRaid() {
      this.selectedRaid = this.raids[this.selectedRaidIndex] || {};
    },
    // Formate une date
    formatDate(dateString) {
      if (!dateString) {
        return "Date inconnue";
      }
      try {
        // Reformate la chaîne de date pour inclure les délimiteurs nécessaires
        const formattedString = dateString.replace(
          /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d+)?Z$/,
          "$1-$2-$3T$4:$5:$6Z"
        );
        const date = new Date(formattedString);

        // Vérifie si la date est valide
        if (isNaN(date)) {
          throw new Error("Date invalide");
        }

        // Retourne une date formatée pour l'affichage
        return date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (error) {
        console.error("Date invalide :", dateString);
        return "Date inconnue";
      }
    },
    // Récupère l'icône correspondant au nom d'une ligue
    getLeagueIcon(leagueName) {
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },
    // Récupère les membres du clan
    fetchClanMembers() {
      const clanTag = this.$route.params.clanTag;
      return apiService.getClanDetails(clanTag).then(response => {
        this.clanMembers = response.memberList;
      })
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
    getCapitalHallImage(level) {
      if (level >= 1 && level <= 10) {
        const iconName = `HDV/Capital_${level}`;
        return this.icons[iconName];
      }
      return null; // ou this.icons.default si vous avez une image par défaut
    },
    getDistrictHallImage(level) {
      if (level >= 1 && level <= 5) {
        const iconName = `HDV/District_${level}`;
        return this.icons[iconName];
      }
      return null; // ou this.icons.default si vous avez une image par défaut
    },
  },

  computed: {
    // Fusion des données des membres de clan et de raids
    enrichedMembers() {
      const mergedMembers = this.clanMembers.map(clanMember => {
        const raidMember = this.selectedRaid.members?.find(member => member.tag === clanMember.tag);
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
