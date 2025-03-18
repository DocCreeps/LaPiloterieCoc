<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow-md mx-auto mb-8 max-w-4xl">
    <label for="raidSelect" class="block text-lg font-bold mb-2">Sélectionnez un Raid :</label>
    <select id="raidSelect" :value="selectedRaidIndex" @change="handleSelectChange" class="w-full p-2 border rounded-md">
      <option v-for="(raid, index) in raids" :key="index" :value="index">
        Raids du {{ formatDate(raid.startTime) }} au {{ formatDate(raid.endTime) }}
      </option>
    </select>
    <div v-if="selectedRaid" class="mt-4 bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-bold">Informations du Raid Sélectionné</h2>
      <p class="text-sm"><strong>Raids du :</strong> {{ formatDate(selectedRaid.startTime) }} au {{ formatDate(selectedRaid.endTime) }}</p>
      <p class="text-sm"><img :src="icons['icon/pillage']" alt="étoiles" class="h-15 w-15 inline-block" /> : {{ selectedRaid.capitalTotalLoot || "N/A" }}</p>
      <p class="text-sm"><strong>Raids Complétés :</strong> {{ selectedRaid.raidsCompleted || "N/A" }}</p>
      <p class="text-sm"><strong>Districts Détruits :</strong> {{ selectedRaid.enemyDistrictsDestroyed || "N/A" }}</p>
      <p class="text-sm"><img :src="icons['icon/capital_atk']" alt="étoiles" class="h-10 w-10 inline-block" /> {{ selectedRaid.totalAttacks || "N/A" }}</p>
    </div>
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
    updateSelectedRaid() {
      this.$emit('raid-selected', this.selectedRaidIndex);
    },
    formatDate(dateString) {
      if (!dateString) {
        return "Date inconnue";
      }
      try {
        const formattedString = dateString.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d+)?Z$/, "$1-$2-$3T$4:$5:$6Z");
        const date = new Date(formattedString);
        if (isNaN(date)) {
          throw new Error("Date invalide");
        }
        return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
      } catch (error) {
        console.error("Date invalide :", dateString);
        return "Date inconnue";
      }
    },
  },
};
</script>
