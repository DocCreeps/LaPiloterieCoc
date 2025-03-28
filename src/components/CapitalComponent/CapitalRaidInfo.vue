<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow-md mx-auto mb-8 max-w-4xl">
    <label for="raidSelect" class="block text-lg font-bold mb-2">Sélectionnez un Raid :</label>
    <select
      id="raidSelect"
      :value="selectedRaidIndex"
      @change="handleSelectChange"
      class="w-full p-2 border rounded-md"
    >
      <option v-for="(raid, index) in raids" :key="index" :value="index" >
        Raids du {{ formatDate(raid.startTime) }} au {{ formatDate(raid.endTime) }}
      </option>
    </select>
    <div v-if="selectedRaid" class="mt-4 bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-bold mb-4">Informations du Raid</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm flex items-center mb-4">
            <img :src="icons['icon/pillage']" alt="étoiles" class="h-8 w-8 sm:h-12 sm:w-12 mr-2" />
            Capital Total Loot : {{ selectedRaid.capitalTotalLoot || 'N/A' }}
          </p>
          <p class="text-sm">Raids Complétés : {{ selectedRaid.raidsCompleted || 'N/A' }}</p>
        </div>
        <div>

          <p class="text-sm flex items-center mb-4">
            <img :src="icons['icon/capital_atk']" alt="étoiles" class="h-8 w-8 sm:h-12 sm:w-12 mr-2" />
            Total Attaques : {{ selectedRaid.totalAttacks || 'N/A' }}
          </p>
          <p class="text-sm">Districts Détruits : {{ selectedRaid.enemyDistrictsDestroyed || 'N/A' }}</p>
        </div>
      </div>
    </div>
    <p v-else>Aucun raid sélectionné.</p>
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
    selectedRaid() {
      return this.raids[this.selectedRaidIndex] || null;
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
