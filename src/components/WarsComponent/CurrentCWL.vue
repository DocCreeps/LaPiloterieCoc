<template>
  <div v-if="warLeagueGroup && warLeagueGroup.rounds">
    <WarLeagueRanking :warLeagueGroup="warLeagueGroup" :warDetails="warDetails"  @clanClicked="handleClanClicked"/>
    <WarLeagueRoundResults :warLeagueGroup="warLeagueGroup" :warDetails="warDetails" />
    <WarLeagueRoster :warLeagueGroup="warLeagueGroup" @clanClicked="handleClanClicked" />
  </div>
  <div v-else>
    <p>Chargement des données de la LDC...</p>
  </div>
</template>

<script>
import WarLeagueRanking from '@/components/CWLComponent/WarLeagueRanking.vue';
import WarLeagueRoundResults from '@/components/CWLComponent/WarLeagueRoundResults.vue';
import WarLeagueRoster from '@/components/CWLComponent/WarLeagueRoster.vue';

export default {
  components: {
    WarLeagueRanking,
    WarLeagueRoundResults,
    WarLeagueRoster,
  },
  props: {
    warLeagueGroup: {
      type: Object,
      required: true,
    },
    warDetails: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleClanClicked(clanTag) {
      this.$emit('clanClicked', clanTag);
    },
  },
};
</script>
