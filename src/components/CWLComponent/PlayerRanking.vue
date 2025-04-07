<template>
  <div class="py-4">
    <h3 class="font-bold text-2xl sm:text-3xl mb-4 text-center">Classement Général des Joueurs (LDC)</h3>

    <div class="flex flex-col sm:flex-row items-center mb-4">
      <div class="mb-2 sm:mb-0 sm:mr-4">
        <label for="playerNameFilter" class="block text-gray-700 text-sm font-bold mb-2">Rechercher un joueur :</label>
        <input
          type="text"
          id="playerNameFilter"
          v-model="searchName"
          placeholder="Nom du joueur"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

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

      <div class="mb-2 sm:mb-0 sm:mr-4">
        <label for="sortByThreeStars" class="block text-gray-700 text-sm font-bold mb-2">Trier par 3 Étoiles :</label>
        <select
          id="sortByThreeStars"
          v-model="sortByThreeStars"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Par défaut</option>
          <option value="desc">Décroissant</option>
          <option value="asc">Croissant</option>
        </select>
      </div>

      <div>
        <label for="sortDestruction" class="block text-gray-700 text-sm font-bold mb-2">Trier par % Destr. :</label>
        <select
          id="sortDestruction"
          v-model="sortDirectionDestruction"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Par défaut</option>
          <option value="desc">Décroissant</option>
          <option value="asc">Croissant</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col">
      <div class="flex flex-row justify-between bg-gray-50 font-bold text-sm sm:text-xl text-gray-500 border-b border-gray-200 py-3 px-2">
        <div class="w-1/6 sm:w-12 text-center sm:text-left">#</div>
        <div class="w-1/4 sm:text-left cursor-pointer" @click="sortColumn = 'name'">Joueur</div>
        <div class="w-1/6 flex items-center justify-center cursor-pointer" @click="sortColumn = 'totalStars'">
          <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 mr-1 sm:mr-2" />
          <span>Étoiles</span>
        </div>
        <div class="w-1/6 flex items-center justify-center">Destruction</div>
        <div class="w-1/6 flex items-center justify-center">Attaques</div>
      </div>
      <div v-for="(player, index) in searchName ? filteredByNamePlayers : filteredAndSortedPlayers" :key="player.tag" class="flex flex-row justify-between border-b border-gray-200 py-4 px-2 items-center">
        <div class="w-1/6 sm:w-12 text-center sm:text-left">
          <span class="font-bold text-lg sm:text-2xl">
            {{ player.globalPosition }}
          </span>
        </div>
        <div class="w-1/4 flex items-center sm:block">
          <span class="font-bold mr-2 text-xl">{{ player.name }}</span>
          <div class="flex items-center mt-1 sm:mt-0">
            <img v-if="player.clanBadgeUrl" :src="player.clanBadgeUrl" alt="Badge du Clan" class="h-8 w-8 mr-2" />
            <span class="text-xs sm:text-lg text-gray-600">{{ getPlayerClanName(player.tag) }}</span>
          </div>
        </div>
        <div class="w-1/6 flex items-center justify-center">
          <img :src="icons['icon/stars']" alt="étoiles" class="h-4 w-4 mr-1 sm:mr-2" />
          <span class="font-bold text-lg sm:text-xl">{{ player.totalStars }}</span>
        </div>
        <div class="w-1/6 flex items-center justify-center">
          <span class="font-bold text-sm sm:text-lg">{{ player.totalDestruction }}%</span>
        </div>
        <div class="w-1/6 flex items-center justify-around px-2">
          <div class="flex flex-col items-center">
            <div class="flex flex-row justify-center mb-1 sm:mb-2">
              <img :src="icons['icon/Sword']" alt="Total Atk" class="h-8 w-8 mr-1 sm:mr-2" />
              <span class="font-bold text-lg sm:text-xl">{{ getPlayerTotalAttacks(player.tag) }}</span>
            </div>
            <div class="flex flex-row">
              <div v-for="star in sortAttackCountsKeys([3, 2, 1, 0])" :key="star" class="flex flex-col items-center mx-0.5 sm:mx-1">
                <span class="text-center font-bold text-lg sm:text-xl">{{ getPlayerAttackCounts(player.tag)[star] || 0 }}</span>
                <img :src="icons[`icon/stars-${star}`]" :alt="`${star} étoiles`" class="h-5 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="filteredAndSortedPlayers.length === 0 && selectedClan" class="text-center py-4 text-gray-500">Aucun joueur trouvé pour le clan "{{ selectedClan }}".</p>
      <p v-if="filteredAndSortedPlayers.length === 0 && searchName" class="text-center py-4 text-gray-500">Aucun joueur trouvé avec le nom "{{ searchName }}".</p>
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
          class="px-3 py-1 border rounded text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50"
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
      searchName: '',
      playersWithGlobalPosition: [],
      sortByThreeStars: '', // Nouveau pour le tri par 3 étoiles
    };
  },
  computed: {
    allPlayers() {
      const playersObject = {};
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
              if (!playersObject[member.tag]) {
                playersObject[member.tag] = {
                  tag: member.tag,
                  name: member.name,
                  clanTag: side.tag,
                  clanBadgeUrl: this.clanBadges[side.tag],
                  attacks: [],
                };
              }
              if (member.attacks) {
                playersObject[member.tag].attacks.push(...member.attacks);
              }
            });
          }
        });
      }
      return Object.values(playersObject);
    },
    availableClans() {
      return [...new Set(this.allPlayers.map(player => this.getPlayerClanName(player.tag))).values()].sort();
    },
    filteredPlayers() {
      let players = this.playersWithGlobalPosition;

      if (this.selectedClan) {
        players = players.filter(player => this.getPlayerClanName(player.tag) === this.selectedClan);
      }

      players = players.filter(player => player.totalStars > 0 || player.totalDestruction > 0);

      return players;
    },
    sortedPlayers() {
      let sortedPlayers = [...this.filteredPlayers];

      // Tri par qualité des étoiles (3 > 2 > 1 > 0)
      if (this.sortByThreeStars) {
        sortedPlayers.sort((a, b) => {
          const countsA = this.getPlayerAttackCounts(a.tag);
          const countsB = this.getPlayerAttackCounts(b.tag);

          // Comparaison du nombre de 3 étoiles
          if (countsB[3] !== countsA[3]) {
            return this.sortByThreeStars === 'asc' ? countsA[3] - countsB[3] : countsB[3] - countsA[3];
          }

          // Si le nombre de 3 étoiles est égal, comparaison du nombre de 2 étoiles
          if (countsB[2] !== countsA[2]) {
            return this.sortByThreeStars === 'asc' ? countsA[2] - countsB[2] : countsB[2] - countsA[2];
          }

          // Si le nombre de 2 étoiles est égal, comparaison du nombre de 1 étoile
          if (countsB[1] !== countsA[1]) {
            return this.sortByThreeStars === 'asc' ? countsA[1] - countsB[1] : countsB[1] - countsA[1];
          }

          // Si le nombre de 1 étoile est égal, on peut comparer le nombre de 0 étoiles (facultatif)
          if (countsB[0] !== countsA[0]) {
            return this.sortByThreeStars === 'asc' ? countsA[0] - countsB[0] : countsB[0] - countsA[0];
          }

          // Si tous les nombres d'étoiles sont égaux, on ne change pas l'ordre
          return 0;
        });
      }
      // Tri par pourcentage de destruction
      else if (this.sortDirectionDestruction) {
        sortedPlayers.sort((a, b) => {
          return this.sortDirectionDestruction === 'asc' ? a.totalDestruction - b.totalDestruction : b.totalDestruction - a.totalDestruction;
        });
      }
      // Tri par colonne (nom, étoiles totales)
      else if (this.sortColumn) {
        sortedPlayers.sort((a, b) => {
          let comparison = 0;
          if (this.sortColumn === 'name') {
            comparison = a.name.localeCompare(b.name);
          } else if (this.sortColumn === 'totalStars') {
            comparison = b.totalStars - a.totalStars; // Ordre décroissant pour les étoiles totales par défaut
          }
          return this.sortDirection === 'asc' ? comparison : -comparison;
        });
      }

      return sortedPlayers;
    },
    totalPages() {
      return Math.ceil(this.sortedPlayers.length / this.itemsPerPage);
    },
    filteredAndSortedPlayers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.sortedPlayers.slice(startIndex, endIndex);
    },
    filteredByNamePlayers() {
      if (this.searchName) {
        const searchTerm = this.searchName.toLowerCase();
        return this.playersWithGlobalPosition.filter(player => player.name.toLowerCase().includes(searchTerm) && (player.totalStars > 0 || player.totalDestruction > 0));
      }
      return [];
    },
  },
  watch: {
    allPlayers: {
      handler(newPlayers) {
        this.calculateGlobalPositions(newPlayers);
      },
      immediate: true,
    },
    selectedClan() {
      this.currentPage = 1;
    },
    sortDirectionDestruction() {
      this.sortColumn = ''; // Reset autre tri
      this.sortByThreeStars = ''; // Reset autre tri
      this.currentPage = 1;
    },
    sortColumn() {
      this.sortDirectionDestruction = ''; // Reset autre tri
      this.sortByThreeStars = ''; // Reset autre tri
      this.currentPage = 1;
      if (this.sortColumn !== '#') {
        this.sortDirection = this.sortColumn === this.previousSortColumn ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'desc';
        this.previousSortColumn = this.sortColumn;
      }
    },
    searchName() {
      this.currentPage = 1;
    },
    sortByThreeStars() {
      this.sortColumn = ''; // Reset autre tri
      this.sortDirectionDestruction = ''; // Reset autre tri
      this.currentPage = 1;
    },
  },
  methods: {
    calculateGlobalPositions(players) {
      const playersWithStats = players.map(player => ({
        ...player,
        totalStars: this.getPlayerTotalStars(player.tag),
        totalDestruction: this.getPlayerTotalDestruction(player.tag),
      }));

      const sortedPlayers = [...playersWithStats].sort((a, b) => {
        if (b.totalStars !== a.totalStars) {
          return b.totalStars - a.totalStars; // Tri par étoiles décroissant
        }
        return b.totalDestruction - a.totalDestruction; // Si égalité, tri par destruction décroissante
      });

      this.playersWithGlobalPosition = sortedPlayers.map((player, index) => ({
        ...player,
        globalPosition: index + 1,
      }));
    },
    getPlayerTotalStars(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      return player?.attacks?.reduce((sum, attack) => sum + attack.stars, 0) || 0;
    },
    getPlayerTotalDestruction(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      return player?.attacks?.reduce((sum, attack) => sum + attack.destructionPercentage, 0) || 0;
    },
    getPlayerClanName(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      return player ? this.clanNames[player.clanTag] || 'Inconnu' : 'Inconnu';
    },
    getPlayerAttackCounts(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      if (!player || !player.attacks) {
        return { 3: 0, 2: 0, 1: 0, 0: 0 };
      }
      const attackCounts = { 3: 0, 2: 0, 1: 0, 0: 0 };
      player.attacks.forEach(attack => {
        if (attack.stars === 3) {
          attackCounts[3]++;
        } else if (attack.stars === 2) {
          attackCounts[2]++;
        } else if (attack.stars === 1) {
          attackCounts[1]++;
        } else {
          attackCounts[0]++;
        }
      });
      return attackCounts;
    },
    getPlayerTotalAttacks(playerTag) {
      const player = this.allPlayers.find(p => p.tag === playerTag);
      return player?.attacks?.length || 0;
    },
    sortAttackCountsKeys(keys) {
      return keys.sort((a, b) => parseInt(b) - parseInt(a));
    },
  },
};
</script>
