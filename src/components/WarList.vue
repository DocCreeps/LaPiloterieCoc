<template>
  <div>
    <div v-if="currentWar" :class="getWarResultClass(currentWar)" class="p-2 mb-2 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-center">
      <div class="text-center  cursor-pointer" @click="getClanDetails(currentWar.clan.tag)">
        <img :src="currentWar.clan.badgeUrls.medium" alt="Badge" class="mx-auto md:mx-0">
        <h4 class="text-lg font-semibold">{{ currentWar.clan.name }}</h4>
      </div>

      <div class="text-center md:w-1/4">
        <strong class="font-bold">{{ currentWar.clan.stars }}</strong>
        <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block ml-5 mr-2" />
        <strong> - </strong>
        <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-5 ml-2" />
        <strong class="font-bold"> {{ currentWar.opponent.stars }}</strong>
        <p class="text-gray-600">({{ (currentWar.clan.destructionPercentage).toFixed(2) }}%) - ({{ (currentWar.opponent.destructionPercentage).toFixed(2) }}%)</p>
        <p class="text-gray-600">{{ currentWar.teamSize }} vs {{ currentWar.teamSize }}</p>
      </div>

      <div class="text-center cursor-pointer" @click="getClanDetails(currentWar.opponent.tag)">
        <img :src="currentWar.opponent.badgeUrls.medium" alt="Badge" class=" mx-auto md:mx-0">
        <h4 class="text-lg font-semibold">{{ currentWar.opponent.name }}</h4>
      </div>
    </div>

    <div class="mb-8">
      <div class="bg-gray-300 w-full p-4 rounded-lg text-left" @click="toggleGdc">
        <h2 class="text-xl font-bold">60 dernière Guerres de Clans </h2>
      </div>
      <div v-show="showGdc" class="bg-white p-4 rounded-lg shadow-md">
        <div v-for="war in paginatedWars" :key="war.endTime" :class="getResultClass(war.result)" class="p-2 mb-2 rounded-lg flex flex-col md:flex-row gap-4 ">
          <div class="flex items-center justify-center md:justify-start md:w-1/4">
            <div class="hidden md:block">
              <div class="text-gray-500">{{ formatDate(war.endTime) }}</div>
            </div>
          </div>

          <div class="text-center md:text-right md:w-1/4">
            <h4 class="text-lg font-semibold">{{ war.clan.name }}</h4>
            <p class="text-gray-600">({{ (war.clan.destructionPercentage).toFixed(2) }}%)</p>
          </div>

          <div class="hidden md:flex items-center justify-center md:w-1/4 cursor-pointer"
               :key="war.clan.tag"
               @click="getClanDetails(war.clan.tag)">
            <img :src="war.clan.badgeUrls.small" alt="Badge" class="w-16 h-16">
          </div>

          <div class="text-center md:w-1/4">
            <div class="font-bold">
              <strong>
                {{ war.clan.stars }}
                <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block  mx-2"/>
                -
                <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mx-2" />
                {{ war.opponent.stars }}
              </strong>
            </div>
            <p class="text-gray-600">{{ war.teamSize }} vs {{ war.teamSize }}</p>
          </div>

          <div class="hidden md:flex items-center justify-center md:w-1/4 cursor-pointer"
               :key="war.opponent.tag"
               @click="getClanDetails(war.opponent.tag)">
            <img :src="war.opponent.badgeUrls.small" alt="Badge" class="w-16 h-16">
          </div>

          <div class="text-center md:text-left md:w-1/4">
            <h4 class="text-lg font-semibold"> {{ war.opponent.name }}</h4>
            <p class="text-gray-600">({{ (war.opponent.destructionPercentage).toFixed(2) }}%)</p>
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 mx-1 bg-gray-300 rounded-lg"
          >
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
      showGdc: false,
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
        'bg-red-100': result === 'lose'
      };
    },
    formatDate(endTime) {
      const date = new Date(endTime);
      const now = new Date();
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      return `${diff}d ago`;
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
    getWarResultClass(war) {
      if (war.clan.stars > war.opponent.stars) {
        return 'bg-green-100';
      } else {
        return 'bg-red-100';
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
