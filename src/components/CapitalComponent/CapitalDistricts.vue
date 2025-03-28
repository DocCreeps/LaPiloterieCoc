<template>
  <div class="bg-gray-50 p-6 rounded-lg shadow-lg mx-auto mb-8 max-w-4xl">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Détails Capitale</h2>
    </div>
    <div v-if="clan?.clanCapital?.districts && clan.clanCapital.districts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(district, index) in clan.clanCapital.districts" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 shadow text-center">
        <p class="text-lg font-semibold text-gray-700 mb-2">
          {{ district.name || "Nom inconnu" }}
        </p>
        <div class="flex justify-center items-center mb-3">
          <img
            v-if="district.name === 'Capital Peak' && getCapitalHallImage(district.districtHallLevel)"
            :src="getCapitalHallImage(district.districtHallLevel)"
            :title="'Capital ' + district.districtHallLevel"
            :alt="'Capital ' + district.districtHallLevel"
            class="w-20 h-20"
          />
          <img
            v-else-if="getDistrictHallImage(district.districtHallLevel)"
            :src="getDistrictHallImage(district.districtHallLevel)"
            :title="'District ' + district.districtHallLevel"
            :alt="'District ' + district.districtHallLevel"
            class="w-20 h-20"
          />
          <p v-else class="text-sm text-gray-500">Image manquante</p>
        </div>
        <p class="text-sm text-gray-600">Niveau : {{ district.districtHallLevel || 'N/A' }}</p>
      </div>
    </div>
    <p v-else class="text-center text-gray-600 mt-6">Aucun district disponible.</p>
  </div>
</template>

<script>
export default {
  props: {
    clan: Object,
    leagues: Array,
    unrankedLeagueIcon: String,
    icons: Object,
  },
  methods: {
    getCapitalHallImage(level) {
      if (level >= 1 && level <= 10) {
        const iconName = `HDV/Capital_${level}`;
        return this.icons[iconName];
      }
      return null;
    },
    getDistrictHallImage(level) {
      if (level >= 1 && level <= 5) {
        const iconName = `HDV/District_${level}`;
        return this.icons[iconName];
      }
      return null;
    },
  },
};
</script>
