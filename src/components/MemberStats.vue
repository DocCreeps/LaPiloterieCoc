<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Statistiques de Guerre</h2>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Autres Statistiques</h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
    icons: Object,
  },
  // Ajoutez ici les méthodes et les données nécessaires pour afficher les statistiques
};
</script>
