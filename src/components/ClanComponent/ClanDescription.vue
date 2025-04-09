<template>
  <div class="flex flex-col bg-white p-4 rounded-lg shadow-md w-10/12 lg:w-1/3 mb-4 lg:mb-0 mx-auto space-y-3 lg:mr-4">
    <p class="text-lg text-center">{{ clan?.description || 'Description indisponible.' }}</p>
    <div class="flex flex-row justify-center">
      <img :src="icons['icon/member']" alt="Membres du clan" class="h-7 w-7" />
      <p class="text-lg ml-2"> {{ clanMembers }}/50</p>
    </div>
    <div v-if="clanLabels.length > 0" class="text-center">
      <div class="player-label-holder flex flex-row justify-center">
        <img v-for="label in clanLabels" :key="label.id" :src="label.iconUrls.small" :alt="label.name" :title="label.name" class="h-10 w-10 player-label mx-2" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clan: {
      type: Object,
      required: true
    },
    icons: {
      type: Object,
      required: true
    }
  },
  computed: {
    clanMembers() {
      return this.clan?.members || 0;
    },
    clanLabels() {
      return this.clan?.labels || [];
    }
  }
};
</script>

<style scoped>
/* Vos styles ici */
</style>
