<template>
  <div>

    <h2 class="text-xl text-center font-bold">Résultats des Ligues de Clans</h2>

    <div class="bg-white p-4 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="war in filteredWars" :key="war.endTime" class="p-4 rounded-lg border">
          <p class="font-bold text-center text-gray-500">{{ formatDate(war.endTime) }}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img :src="war.clan.badgeUrls.small" alt="Badge" class="w-12 h-12 mr-4">
              <div>
                <h4 class="text-lg font-semibold">{{ war.clan.name }}</h4>
              </div>
            </div>
            <div class="flex items-center">
              <strong class="mr-2">
                {{ war.clan.stars }}
                <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mx-1" />
              </strong>
              <span class="text-sm text-gray-600">
                ({{ (war.clan.destructionPercentage).toFixed(2) }}%)
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-2 text-center" v-if="war.teamSize">
            {{ war.teamSize }} vs {{ war.teamSize }}
          </p>
          <p class="text-sm text-gray-600 mt-2" v-else>
            Taille d'équipe inconnue
          </p>
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
      if (!endTime) return "Date inconnue";
      try {
        const year = parseInt(endTime.substring(0, 4));
        const month = parseInt(endTime.substring(4, 6)) - 1;
        const day = parseInt(endTime.substring(6, 8));
        const hours = parseInt(endTime.substring(9, 11));
        const minutes = parseInt(endTime.substring(11, 13));
        const seconds = parseInt(endTime.substring(13, 15));
        const date = new Date(year, month, day, hours, minutes, seconds);
        const now = new Date();
        const diffMilliseconds = now - date;
        if (diffMilliseconds < 0) return "Date future";
        const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
        if (isNaN(diffMilliseconds)) return "Date invalide";
        return diffDays > 0 ? `${diffDays} jour(s) passé(s)` : `${diffHours} heure(s) passé(s)`;
      } catch (error) {
        console.error("Erreur date", endTime, error);
        return "Date inconnue";
      }
    },
  },
};
</script>
