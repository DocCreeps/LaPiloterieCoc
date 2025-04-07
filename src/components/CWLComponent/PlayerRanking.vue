<template>
  <div class="py-4">
    <h3 class="font-bold text-2xl sm:text-3xl mb-4 text-center">Classement Général des Joueurs (LDC)</h3>

    <div class="flex flex-col sm:flex-row items-center  mb-4">
      <div class="mb-2 sm:mb-0 sm:mr-4">
        <label for="clanFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrer par Clan :</label>
        <select
          id="clanFilter"
          v-model="selectedClan"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Tous les clans</option>
          <option v-for="clanName in availableClans" :key="clanName" :value="clanName">{{ clanName }}</option>
        </select>
      </div>

      <div>
        <label for="sortDestruction" class="block text-gray-700 text-sm font-bold mb-2">Trier :</label>
        <select
          id="sortDestruction"
          v-model="sortDirectionDestruction"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="desc">% Décroissant</option>
          <option value="asc">% Croissant</option>
          <option value="">Par étoiles</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col">
      <div class="grid grid-cols-4 sm:grid-cols-4 gap-2 bg-gray-50 font-bold text-sm sm:text-xl text-gray-500 border-b border-gray-200 py-3 px-2">
        <div class="text-center sm:text-left cursor-pointer" @click="sortColumn = '#'">#</div>
        <div class="sm:text-left cursor-pointer" @click="sortColumn = 'name'">Joueur</div>
        <div class="flex items-center justify-center cursor-pointer" @click="sortColumn = 'stars'">
          <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 mr-1 sm:mr-2" />
          <span>Étoiles</span>
        </div>
        <div class="flex items-center justify-center cursor-pointer" @click="sortColumn = 'destruction'">
          <span class="mr-1 sm:mr-2">%</span>
          <span>Destruction</span>
        </div>
      </div>
      <div v-for="(player, index) in filteredAndSortedPlayers" :key="player.tag" class="grid grid-cols-4 sm:grid-cols-4 gap-2 border-b border-gray-200 py-4 px-2 items-center">
        <div class="text-center sm:text-left">
          <span class="font-bold text-lg sm:text-2xl">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
        </div>
        <div class="flex items-center sm:block">
          <span class="font-bold mr-2 text-xl">{{ player.name }}</span>
          <div class="flex items-center mt-1 sm:mt-0">
            <img v-if="player.clanBadgeUrl" :src="player.clanBadgeUrl" alt="Badge du Clan" class="h-8 w-8 mr-2" />
            <span class="text-xs sm:text-lg text-gray-600">{{ getPlayerClanName(player.tag) }}</span>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <img :src="icons['icon/stars']" alt="étoiles" class="h-4 w-4 mr-1 sm:mr-2" />
          <span class="font-bold text-lg sm:text-xl">{{ getPlayerTotalStars(player.tag) }}</span>
        </div>
        <div class="flex items-center justify-center">
          <span class="font-bold text-sm sm:text-lg">{{ getPlayerAverageDestruction(player.tag) }}%</span>
        </div>
      </div>
      <p v-if="filteredAndSortedPlayers.length === 0 && selectedClan" class="text-center py-4 text-gray-500">Aucun joueur trouvé pour le clan "{{ selectedClan }}".</p>
      <p v-if="allPlayers.length === 0" class="text-center py-4 text-gray-500">Aucun joueur trouvé dans les données de guerre.</p>
    </div>
    <div v-if="totalPages > 1" class="flex justify-center mt-4">
      <div class="flex items-center space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-3 py-1 border rounded text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-400 disabled:bg-gray-50"
        >
          Précédent
        </button>
        <span class="text-gray-700 text-sm">{{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-3 py-1 border rounded text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-400 disabled:bg-gray-50"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import icons from '@/assets/icons.js';

export default {
  props: {
    warDetails: {
      type: Object,
      required: true,
    },
    warLeagueGroup: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      icons: icons,
      currentPage: 1,
      itemsPerPage: 10,
      clanNames: {},
      clanBadges: {},
      selectedClan: '',
      sortColumn: '',
      sortDirection: 'asc',
      sortDirectionDestruction: '',
      previousSortColumn: '',
    };
  },
  computed: {
    allPlayers() {
      const players = {};
      for (const warTag in this.warDetails) {
        const war = this.warDetails[warTag];
        [war.clan, war.opponent].forEach(side => {
          if (side && side.members) {
            if (!this.clanNames[side.tag]) {
              this.clanNames[side.tag] = side.name;
            }
            if (!this.clanBadges[side.tag] && side.badgeUrls) {
              this.clanBadges[side.tag] = side.badgeUrls.small;
            }
            side.members.forEach(member => {
              if (!players[member.tag]) {
                players[member.tag] = {
                  tag: member.tag,
                  name: member.name,
                  clanTag: side.tag,
                  clanBadgeUrl: this.clanBadges[side.tag],
                  attacks: [],
                };
              }
              if (member.attacks) {
                players[member.tag].attacks.push(...member.attacks);
              }
            });
          }
        });
      }
      return Object.values(players);
    },
    availableClans() {
      return [...new Set(this.allPlayers.map(player => this.getPlayerClanName(player.tag))).values()].sort();
    },
    filteredPlayers() {
      if (!this.selectedClan) {
        return this.allPlayers;
      }
      return this.allPlayers.filter(player => this.getPlayerClanName(player.tag) === this.selectedClan);
    },
    sortedPlayers() {
      let sortedPlayers = [...this.filteredPlayers].filter(player => {
        const totalStars = this.getPlayerTotalStars(player.tag);
        const averageDestruction = parseFloat(this.getPlayerAverageDestruction(player.tag));
        return totalStars > 0 || averageDestruction > 0;
      });

      if (this.sortColumn) {
        sortedPlayers.sort((a, b) => {
          let comparison = 0;
          if (this.sortColumn === 'name') {
            comparison = a.name.localeCompare(b.name);
          } else if (this.sortColumn === 'stars') {
            comparison = this.getPlayerTotalStars(b.tag) - this.getPlayerTotalStars(a.tag);
          } else if (this.sortColumn === 'destruction') {
            const destructionA = parseFloat(this.getPlayerAverageDestruction(a.tag));
            const destructionB = parseFloat(this.getPlayerAverageDestruction(b.tag));
            comparison = destructionB - destructionA;
          } else if (this.sortColumn === '#') {
            comparison = 0;
          }

          return this.sortDirection === 'asc' ? comparison : -comparison;
        });
      } else if (this.sortDirectionDestruction) {
        sortedPlayers.sort((a, b) => {
          const destructionA = parseFloat(this.getPlayerAverageDestruction(a.tag));
          const destructionB = parseFloat(this.getPlayerAverageDestruction(b.tag));
          return this.sortDirectionDestruction === 'asc' ? destructionA - destructionB : destructionB - destructionA;
        });
      } else {
        sortedPlayers.sort((a, b) => this.getPlayerTotalStars(b.tag) - this.getPlayerTotalStars(a.tag));
      }

      return sortedPlayers;
    },
    totalPages() {
      return Math.ceil(this.sortedPlayers.length / this.itemsPerPage);
    },
    paginatedPlayers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.sortedPlayers.slice(startIndex, endIndex);
    },
    filteredAndSortedPlayers() {
      this.currentPage = 1;
      return this.paginatedPlayers;
    },
  },
  watch: {
    selectedClan() {
      this.currentPage = 1;
      this.sortColumn = '';
      this.sortDirectionDestruction = '';
    },
    sortDirectionDestruction() {
      this.sortColumn = '';
    },
    sortColumn() {
      this.sortDirectionDestruction = '';
      if (this.sortColumn !== '#') {
        this.sortDirection = this.sortColumn === this.previousSortColumn ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
        this.previousSortColumn = this.sortColumn;
      }
    },
  },
  methods: {
    getPlayerTotalStars(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      if (player && player.attacks) {
        return player.attacks.reduce((sum, attack) => sum + attack.stars, 0);
      }
      return 0;
    },
    getPlayerAverageDestruction(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      if (player && player.attacks && player.attacks.length > 0) {
        const totalDestruction = player.attacks.reduce((sum, attack) => sum + attack.destructionPercentage, 0);
        return (totalDestruction).toFixed(2);
      }
      return '0';
    },
    getPlayerClanName(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      return player ? this.clanNames[player.clanTag] || 'Inconnu' : 'Inconnu';
    },
  },
};
</script>
