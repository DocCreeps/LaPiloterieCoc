<template>
  <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 lg:mr-4 mb-4 lg:mb-0">
    <p class="text-lg text-center">{{ clan?.description || 'Description indisponible.' }}</p>
    <div class="flex flex-row justify-center mt-2">
      <img :src="icons['icon/member']" alt="Membres du clan" class="h-7 w-7" />
      <p class="text-lg ml-2"> {{ clan?.members || 0 }}/50</p>
    </div>
    <div class="text-center mt-4">
      <div class="player-label-holder flex flex-row justify-center">
        <img v-for="label in clan?.labels" :key="label.id" :src="label.iconUrls.small" :title="label.name" class="h-10 w-10 player-label mx-2" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clan: Object,
    icons: Object,
  },
};
</script>
