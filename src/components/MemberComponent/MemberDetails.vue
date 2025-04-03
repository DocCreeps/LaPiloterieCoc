<template>
  <div class="text-center">
    <div class="grid grid-cols-1 gap-2 player-details">
      <div class="flex justify-between">
        <span>Expérience:</span>
        <span class="flex flex-row">
          <img :src="icons['icon/xp']" alt="Expérience" class="h-6 w-6" />
          <strong class="ml-2">{{ member?.expLevel }}</strong>
        </span>
      </div>
      <div class="flex justify-between">
        <span>Trophées:</span>
        <span class="flex flex-row">
          <img :src="icons['icon/Trophy']" alt="Trophées" class="h-6 w-6" />
          <strong class="ml-2 mr-2">{{ member?.trophies }}</strong> |
          <img :src="icons['icon/mdo_trophy']" alt="Trophées MDO" class="h-6 w-6 ml-2" />
          <strong class="ml-2">{{ member?.builderBaseTrophies }}</strong>
        </span>
      </div>
      <div class="flex justify-between">
        <span>Record :</span>
        <span class="flex flex-row">
          <img :src="icons['icon/Trophy']" alt="Trophées" class="h-6 w-6" />
          <strong class="ml-2 mr-2">{{ member?.bestTrophies }}</strong> |
          <img :src="icons['icon/mdo_trophy']" alt="Trophées MDO" class="h-6 w-6 ml-2" />
          <strong class="ml-2">{{ member?.bestBuilderBaseTrophies }}</strong>
        </span>
      </div>
      <div class="flex justify-between">
        <span>Dons:</span>
        <span class="flex flex-row">
          <img :src="icons['icon/up']" alt="Dons donnés" class="h-5 w-5" />
          <strong class="ml-2 mr-2">{{ member?.donations }}</strong> |
          <img :src="icons['icon/down']" alt="Dons reçus" class="h-5 w-5 ml-2" />
          <strong class="ml-2">{{ member?.donationsReceived }}</strong>
        </span>
      </div>
      <div class="flex justify-between">
        <span>Ratio dons:</span>
        <span class="flex flex-row">
          <img :src="icons['icon/cdc']" alt="Ratio dons/reçus" class="h-7 w-7" />
          <strong class="ml-2">{{ formatDonationsRatio(member?.donations, member?.donationsReceived) }}</strong>
        </span>
      </div>
      <div class="flex justify-between">
        <span>Activité:</span>
        <span class="flex flex-row">
          <img :src="icons['icon/Sword']" alt="Attaques gagnées" class="h-7 w-7" />
          <strong class="ml-2 mr-2">{{ member?.attackWins }}</strong> |
          <img :src="icons['icon/Shield']" alt="Défenses gagnées" class="h-7 w-7 ml-2" />
          <strong class="ml-2">{{ member?.defenseWins }}</strong>
        </span>
      </div>
    </div>
    <div class="text-center mt-4">
      <div class="player-label-holder flex flex-row justify-center">
        <img v-for="label in member?.labels" :key="label.id" :src="label.iconUrls.small" :title="label.name" class="player-label mx-2 h-12 w-12 lg:h-auto sm:w-auto" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
    icons: Object,
  },
  methods: {
    formatDonationsRatio(donations, donationsReceived) {
      if (!donations && !donationsReceived) {
        return '0'; // Les deux sont nuls
      }

      if (!donationsReceived) {
        return donations?.toString() || '0'; // Pas de dons reçus, affiche les dons
      }

      if (!donations) {
        return '-' + (donationsReceived?.toString() || '0'); // Pas de dons, affiche les dons reçus avec un signe négatif
      }

      return (donations / donationsReceived).toFixed(2); // Ratio normal
    },
  },
};
</script>
