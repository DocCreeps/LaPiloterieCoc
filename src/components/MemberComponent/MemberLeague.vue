<template>
  <div class="flex items-center justify-center">
  <div class="text-center ">
    <img :src="member?.league?.iconUrls?.medium || unrankedLeagueIcon" :alt="`Ligue de ${member?.name}`" class="h-25 w-25 md:w-40 md:h-40  mx-auto mt-2" />
    <p class="text-lg">{{ member?.league?.name || 'Non classé' }}</p>
    <p class="text-2xl font-bold">
      {{ member?.trophies || 0 }} <i class="fas fa-trophy"></i>
    </p>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
    unrankedLeagueIcon: String,
  },
};
</script>
