<template>
  <div>

    <div class="mb-8 mt-4">
      <div class="bg-gray-300 w-10/12 sm:w-full mx-auto p-4 rounded-lg text-left" @click="toggleGdc">
        <h2 class="text-xl font-bold text-center cursor-pointer">60 dernières GDC</h2>
      </div>
      <div v-show="showGdc" class="bg-white p-4 rounded-lg shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="war in paginatedWars"
            :key="war.endTime"
            :class="getResultClass(war.result)"
            class="p-4 rounded-lg flex flex-col gap-2"
          >
            <div class="text-center text-sm font-bold text-gray-500">{{ formatDate(war.endTime) }}</div>

            <div class="flex flex-col lg:flex-row items-center justify-between">
              <div class="flex items-center cursor-pointer" @click="getClanDetails(war.clan.tag)">
                <img :src="war.clan.badgeUrls.small" alt="Badge" class="mr-2" />
                <span class="font-bold mr-2 text-lg">{{ war.clan.name }}</span>
              </div>

              <div class="flex flex-row items-center justify-between">
                <div class="flex flex-col items-center">
                  <div class="flex flex-row mr-4">
                    <span class="text-xl font-bold mr-2">{{ war.clan.stars }}</span>
                    <img :src="icons['icon/stars']" alt="étoiles" class="h-8 w-8 inline-block mr-2" />
                  </div>
                  <span class="text-sm text-gray-600">({{ war.clan.destructionPercentage.toFixed(2) }}%)</span>
                </div>

                <span class="text-3xl font-extrabold">-</span>

                <div class="flex flex-col items-center">
                  <div class="flex flex-row ml-4">
                    <img :src="icons['icon/stars']" alt="étoiles" class="h-8 w-8 inline-block mr-2" />
                    <span class="text-xl font-bold mr-2">{{ war.opponent.stars }}</span>
                  </div>
                  <span class="text-sm text-gray-600">({{ war.opponent.destructionPercentage.toFixed(2) }}%)</span>
                </div>
              </div>
              <div class="flex items-center cursor-pointer" @click="getClanDetails(war.opponent.tag)">
                <span class="font-bold text-lg mr-2">{{ war.opponent.name }}</span>
                <img :src="war.opponent.badgeUrls.small" alt="Badge" />
              </div>
            </div>

            <div class="text-center text-xs text-gray-600">{{ war.teamSize }} vs {{ war.teamSize }}</div>
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 mx-1 bg-gray-300 rounded-lg">
            Précédent
          </button>
          <span class="px-4 py-2 mx-1">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 bg-gray-300 rounded-lg"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wars: Array,
    currentWar: Object,
    icons: Object,
  },
  data() {
    return {
      showGdc: true,
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  methods: {
    toggleGdc() {
      this.showGdc = !this.showGdc;
    },
    getResultClass(result) {
      return {
        'bg-green-100': result === 'win',
        'bg-gray-100': result === 'draw',
        'bg-red-100': result === 'lose',
      };
    },
    formatDate(endTime) {
      if (!endTime) {
        return 'Date inconnue';
      }

      try {
        const date = new Date(endTime.slice(0, 4), endTime.slice(4, 6) - 1, endTime.slice(6, 8), endTime.slice(9, 11), endTime.slice(11, 13), endTime.slice(13, 15));
        const now = new Date();
        const diffMilliseconds = now - date;

        if (diffMilliseconds < 0) {
          return 'Date future';
        }

        const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
        const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

        if (isNaN(diffMilliseconds)) {
          return 'Date invalide';
        }

        if (diffDays > 0) {
          return rtf.format(-diffDays, 'day');
        } else {
          return rtf.format(-diffHours, 'hour');
        }
      } catch (error) {
        console.error('Erreur lors du traitement de la date :', endTime, error);
        return 'Date inconnue';
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$emit('clanClicked', cleanedClanTag);
    },
    getWarResultClass(currentWar) {
      if (currentWar.clan.stars > currentWar.opponent.stars ) {
        return 'bg-green-100';
      } else if (currentWar.clan.stars < currentWar.opponent.stars) {
        return 'bg-red-100';
      } else {
        if (currentWar.clan.destructionPercentage > currentWar.opponent.destructionPercentage) {
          console.log("win en cour");
          return 'bg-green-100';
        } else if (currentWar.clan.destructionPercentage < currentWar.opponent.destructionPercentage) {
          return 'bg-red-100';
        }
        return 'bg-gray-100';
      }
    },
  },
  computed: {
    filteredWars() {
      return this.wars.filter(war => war.opponent && war.opponent.name);
    },
    paginatedWars() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredWars.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredWars.length / this.itemsPerPage);
    },
  },
};
</script>

<style scoped>
.bg-green-100 {
  background-color: #d4edda;
}

.bg-gray-100 {
  background-color: #f8f9fa;
}

.bg-red-100 {
  background-color: #f8d7da;
}
</style>
