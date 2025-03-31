<template>
  <div class="w-10/12 sm:w-full mx-auto">
    <h2 class="text-2xl font-bold text-center mb-6 ">Résultats des dernières Ligues de Clans</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="war in filteredWars" :key="war.endTime" class="bg-white rounded-lg shadow-md p-6">
        <p class="text-lg font-semibold text-center mb-4">{{ formatDate(war.endTime) }}</p>
        <div class="flex flex-col sm:flex-row items-center mb-4">
          <img :src="war.clan.badgeUrls.small" alt="Badge" class="w-16 h-16 mr-0 sm:mr-4 mb-2 sm:mb-0" />
          <div>
            <h3 class="text-xl font-semibold text-center sm:text-left">{{ war.clan.name }}</h3>
            <p class="text-sm text-gray-600 text-center sm:text-left">
              {{ war.teamSize ? `${war.teamSize} vs ${war.teamSize}` : 'Taille inconnue' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div class="flex items-center mb-2 sm:mb-0">
            <strong class="text-2xl mr-2">{{ war.clan.stars }}</strong>
            <img :src="icons['icon/stars']" alt="étoiles" class="h-6 w-6" />
          </div>
          <span class="text-lg font-semibold">
            {{ war.clan.destructionPercentage.toFixed(2) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wars: Array,
    icons: Object,
  },
  computed: {
    filteredWars() {
      return this.wars.filter(
        (war) => war.opponent && (!war.opponent.tag || !war.opponent.name)
      );
    },
  },
  methods: {
    formatDate(endTime) {
      if (!endTime) {
        return 'Date inconnue';
      }

      try {
        const date = new Date(endTime.slice(0, 4), endTime.slice(4, 6) - 1, endTime.slice(6, 8), endTime.slice(9, 11), endTime.slice(11, 13), endTime.slice(13, 15));
        const now = new Date();
        const diffMilliseconds = now - date;

        if (diffMilliseconds < 0) {
          return 'Date future';
        }

        const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
        const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

        if (isNaN(diffMilliseconds)) {
          return 'Date invalide';
        }

        if (diffDays > 0) {
          return rtf.format(-diffDays, 'day');
        } else {
          return rtf.format(-diffHours, 'hour');
        }
      } catch (error) {
        console.error('Erreur lors du traitement de la date :', endTime, error);
        return 'Date inconnue';
      }
    },
  },
};
</script>
