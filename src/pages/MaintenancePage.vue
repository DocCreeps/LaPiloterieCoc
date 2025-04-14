<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <img :src="icons['persoMaintenance1']" alt="Icône de gauche" class="h-32 w-32 mb-4" />
    <div class="bg-white rounded-lg shadow-xl p-8 text-center flex items-center">
      <h1 class="text-3xl font-semibold text-red-500 mb-0">Maintenance en cours</h1>
    </div>
    <p class="text-gray-700 mt-4 text-center">{{ message }}</p>
    <p class="text-gray-600 mt-2 text-center">Nous vous prions de nous excuser pour la gêne occasionnée.<br>Veuillez réessayer ultérieurement.</p>
    <img :src="icons['persoMaintenance2']" alt="Icône de gauche" class="h-32 w-32 mb-4 mt-5" />
  </div>

</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import icons from "@/assets/icons.js";

const route = useRoute();
const message = ref('');

onMounted(() => {
  message.value = route.query.message || 'Une maintenance est en cours. Veuillez réessayer ultérieurement.';
});
</script>
