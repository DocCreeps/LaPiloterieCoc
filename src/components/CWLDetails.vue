<template>
  <div>
    <div class="bg-gray-300 w-full p-4 rounded-lg text-left" @click="toggleLeague">
      <h2 class="text-xl font-bold">Ligues de Clans</h2>
    </div>
    <div v-show="showLeague" class="bg-white p-4 rounded-lg shadow-md">
      <p>Détails des ligues de clans...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLeague: false,
    };
  },
  methods: {
    toggleLeague() {
      this.showLeague = !this.showLeague;
    },
  },
};
</script>
