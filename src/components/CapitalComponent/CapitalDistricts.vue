<template>
  <div class="bg-white p-6 rounded-lg shadow-lg mx-auto mb-8 max-w-4xl text-center">
    <div class="flex flex-col items-center mb-4">
      <h2 class="text-xl font-bold">Détails Capitale</h2>
    </div>
    <div v-if="clan?.clanCapital?.districts && clan.clanCapital.districts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(district, index) in clan.clanCapital.districts" :key="index" class="p-4 border rounded bg-gray-100 text-center">
        <p class="text-sm">
          <strong>{{ district.name || "N/A" }}</strong>
        </p>
        <div class="flex justify-center items-center">
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
          <p v-else>Image non disponible</p>
        </div>
        <p class="text-sm font-bold mt-2">Niveau : {{ district.districtHallLevel || 'N/A' }}</p>
      </div>
    </div>
    <p v-else>Aucun district disponible.</p>
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
