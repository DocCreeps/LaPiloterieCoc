<template>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="sm:text-3xl text-xl font-bold mb-4 text-center">Stats Guerres</h2>

        <div class="mb-4 flex-row flex items-center">
          <img :src="icons['icon/stars']" alt="étoile de guerre" title="étoile de guerre" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
          <p class="font-bold text-lg sm:text-xl md:text-2xl">{{ member.warStars }}</p>
        </div>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="sm:text-3xl text-xl font-bold mb-4 text-center">Autres Stats</h2>

        <div class="mb-4 flex-row flex items-center">
          <img :src="icons['icon/capital_contrib']" alt="Capital Contribution" title="Capital Contribution" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
          <p class="font-bold text-lg sm:text-xl md:text-2xl">{{ member.clanCapitalContributions }}</p>
        </div>

        <div v-if="member && member.legendStatistics && member.legendStatistics.legendTrophies > 0" class="mb-4 flex flex-row items-center">
          <img :src="icons['icon/Legend_Trophy']" alt="Trophées légende" title="Trophées légende" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
          <p class="font-bold text-lg sm:text-xl md:text-2xl">{{ member.legendStatistics.legendTrophies }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div v-if="member && member.legendStatistics && member.legendStatistics.bestSeason" class="font-bold mb-2 text-lg md:text-xl lg:text-2xl">
            <h3 class="mb-2 ">Meilleure Saison Légende</h3>
            <p class="mb-2"> {{ formatDate(member.legendStatistics.bestSeason.id) }}</p>
            <div class="flex flex-row items-center mb-4">
              <img :src="icons['icon/Legend_Trophy']" alt="Trophées légende" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p > {{ member.legendStatistics.bestSeason.trophies }}</p>
            </div>
            <div class="flex flex-row items-center">
              <img :src="icons['icon/Rank']" alt="Rang légende" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p > {{ member.legendStatistics.bestSeason.rank }}</p>
            </div>
          </div>

          <div v-if="member && member.legendStatistics && member.legendStatistics.previousSeason" class="font-bold mb-2 text-lg md:text-xl lg:text-2xl">
            <h3 class="mb-2">Saison Légende Précédente</h3>
            <p class="mb-2"> {{ formatDate(member.legendStatistics.previousSeason.id) }}</p>
            <div class="flex flex-row items-center mb-4">
              <img :src="icons['icon/Legend_Trophy']" alt="Trophées légende" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p > {{ member.legendStatistics.previousSeason.trophies }}</p>
            </div>
            <div class="flex flex-row items-center">
              <img :src="icons['icon/Rank']" alt="Rang légende" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p > {{ member.legendStatistics.previousSeason.rank }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="member && member.legendStatistics && member.legendStatistics.previousBuilderBaseSeason" class="font-bold mb-2 text-lg md:text-xl lg:text-2xl">
            <h3 class="mb-2">Saison Précédente (MDO)</h3>
            <p class="mb-2"> {{ formatDate(member.legendStatistics.previousBuilderBaseSeason.id) }}</p>
            <div class="flex flex-row items-center mb-4">
              <img :src="icons['icon/MDO_Legend_Trophy']" alt="Trophées légende MDO" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p > {{ member.legendStatistics.previousBuilderBaseSeason.trophies }}</p>
            </div>
            <div class="flex flex-row items-center">
              <img :src="icons['icon/Rank']" alt="Rang légende MDO" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p > {{ member.legendStatistics.previousBuilderBaseSeason.rank }}</p>
            </div>
          </div>

          <div v-if="member && member.legendStatistics && member.legendStatistics.bestBuilderBaseSeason" class="font-bold mb-2 text-lg md:text-xl lg:text-2xl">
            <h3 class="mb-2">Meilleure Saison (MDO)</h3>
            <p class=" mb-2"> {{ formatDate(member.legendStatistics.bestBuilderBaseSeason.id) }}</p>
            <div class="flex flex-row items-center mb-4">
              <img :src="icons['icon/MDO_Legend_Trophy']" alt="Trophées légende MDO" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p >{{ member.legendStatistics.bestBuilderBaseSeason.trophies }}</p>
            </div>
            <div class="flex flex-row items-center">
              <img :src="icons['icon/Rank']" alt="Rang légende MDO" class="h-7 w-7 sm:h-10 sm:w-10 mr-2" />
              <p > {{ member.legendStatistics.bestBuilderBaseSeason.rank }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      required: true,
    },
    icons: Object,
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const [year, month] = dateString.split("-");
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    },
  },
};
</script>
