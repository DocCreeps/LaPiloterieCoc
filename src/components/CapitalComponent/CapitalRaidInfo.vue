<template>
  <div class="bg-gray-50 p-6 rounded-lg shadow-lg mx-auto mb-8 max-w-4xl">
    <label for="raidSelect" class="block text-lg font-semibold text-gray-800 mb-4">Sélectionnez un Raid :</label>
    <select
      id="raidSelect"
      :value="adjustedSelectedRaidIndex"
      @change="handleSelectChange"
      class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
    >
      <option v-for="(raid, index) in displayedRaids" :key="index" :value="index">
        Raids du {{ formatDate(raid.startTime) }} au {{ formatDate(raid.endTime) }}
      </option>
    </select>
    <div v-if="selectedRaid" class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold text-gray-800 mb-6">Informations du Raid</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="flex items-center mb-4">
            <img :src="icons['icon/pillage']" alt="étoiles" class="h-10 w-10 sm:h-12 sm:w-12 mr-3" />
            <p class="text-base text-gray-700">Butin total de la capitale : <span class="font-semibold">{{ selectedRaid.capitalTotalLoot || 'Non disponible' }}</span></p>
          </div>
          <p class="text-base text-gray-700">Raids complétés : <span class="font-semibold">{{ selectedRaid.raidsCompleted || 'Non disponible' }}</span></p>
        </div>
        <div>
          <div class="flex items-center mb-4">
            <img :src="icons['icon/capital_atk']" alt="attaques" class="h-10 w-10 sm:h-12 sm:w-12 mr-3" />
            <p class="text-base text-gray-700">Total des attaques : <span class="font-semibold">{{ selectedRaid.totalAttacks || 'Non disponible' }}</span></p>
          </div>
          <p class="text-base text-gray-700">Districts détruits : <span class="font-semibold">{{ selectedRaid.enemyDistrictsDestroyed || 'Non disponible' }}</span></p>
        </div>
      </div>
    </div>
    <p v-else class="mt-8 text-center text-gray-600">Aucun raid sélectionné.</p>
  </div>
</template>

<script>
export default {
  props: {
    raids: Array,
    selectedRaidIndex: Number,
    icons: Object,
  },
  computed: {
    displayedRaids() {
      if (this.raids.length <= 5) {
        return this.raids;
      } else {
        return this.raids.slice(0, 6);
      }
    },
    selectedRaid() {
      return this.displayedRaids[this.adjustedSelectedRaidIndex] || null;
    },
    adjustedSelectedRaidIndex() {
      if (this.displayedRaids.length === 0) {
        return 0;
      }
      return Math.min(this.selectedRaidIndex, this.displayedRaids.length - 1);
    },
  },
  methods: {
    handleSelectChange(event) {
      this.$emit('update:selectedRaidIndex', parseInt(event.target.value));
      this.$emit('raid-selected', parseInt(event.target.value));
    },
    formatDate(dateString) {
      if (!dateString) {
        return 'Date inconnue';
      }
      try {
        const formattedString = dateString.replace(
          /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d+)?Z$/,
          '$1-$2-$3T$4:$5:$6Z'
        );
        const date = new Date(formattedString);
        if (isNaN(date)) {
          throw new Error('Date invalide');
        }
        return new Intl.DateTimeFormat('fr-FR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }).format(date);
      } catch (error) {
        console.error('Date invalide :', dateString, error);
        return 'Date inconnue';
      }
    },
  },
};
</script>
