<template>
  <div :class="clan?.isWarLogPublic ? 'bg-blue-500' : 'bg-red-500'" class="p-4 rounded-lg shadow-md text-white lg:w-1/3 mb-4 lg:mb-0 mx-auto">
    <h2 class="text-xl font-bold mb-4 text-center">{{ clan?.isWarLogPublic ? 'Statistiques de Guerre' : 'Journal de Guerre Privé' }}</h2>
    <div v-if="clan?.isWarLogPublic" class="flex flex-col justify-center space-y-4">
      <div class="flex flex-row justify-center space-x-1">
        <div class="flex flex-col items-center bg-green-600 p-2 rounded-lg w-1/3">
          <p class="text-lg font-bold">Gagné</p>
          <p class="text-lg">{{ clan?.warWins || 0 }}</p>
        </div>
        <div class="flex flex-col items-center bg-red-500 p-2 rounded-lg w-1/3">
          <p class="text-lg font-bold">Perdu</p>
          <p class="text-lg">{{ clan?.warLosses || 0 }}</p>
        </div>
        <div class="flex flex-col items-center bg-gray-500 p-2 rounded-lg w-1/3">
          <p class="text-lg font-bold">Égalité</p>
          <p class="text-lg">{{ clan?.warTies || 0 }}</p>
        </div>
      </div>
      <div class="flex flex-col items-center bg-black p-2 rounded-lg w-full">
        <p class="text-lg font-bold text-white">Total</p>
        <p class="text-lg text-white">{{ totalWars }}</p>
      </div>
    </div>
    <p v-else class="text-center">Les statistiques de guerre sont privées.</p>
  </div>
</template>

<script>
export default {
  props: {
    clan: {
      type: Object,
      required: true
    }
  },
  computed: {
    totalWars() {
      if (!this.clan) return 0;
      return (this.clan.warWins || 0) + (this.clan.warLosses || 0) + (this.clan.warTies || 0);
    }
  }
};
</script>

<style scoped>
/* Vos styles ici */
</style>
