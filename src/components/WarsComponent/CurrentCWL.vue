<template>
  <div class="text-center">
    <button
      @click="toggleRosterVisibility"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
    >
      {{ showRoster ? 'Masquer' : 'Afficher' }} le roster des Clans
    </button>
  </div>
  <div v-if="warLeagueGroup && warLeagueGroup.rounds">
    <WarLeagueRoster
      v-if="showRoster"
      :warLeagueGroup="warLeagueGroup"
      @clanClicked="handleClanClicked"
      :is-visible="showRoster"
    />
    <WarLeagueRoundResults :warLeagueGroup="warLeagueGroup" :warDetails="warDetails" />
    <WarLeagueRanking :warLeagueGroup="warLeagueGroup" :warDetails="warDetails" @clanClicked="handleClanClicked" />
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
      default: () => ({}), // Ajout d'une valeur par défaut pour éviter les erreurs si warDetails n'est pas toujours fourni immédiatement
    },
    icons: {
      type: Object,
      default: () => ({}), // Ajout d'une valeur par défaut pour la prop icons
    },
  },
  emits: ['clanClicked'],
  data() {
    return {
      showRoster: false,
    };
  },
  methods: {
    handleClanClicked(clanTag) {
      this.$emit('clanClicked', clanTag);
    },
    toggleRosterVisibility() {
      this.showRoster = !this.showRoster;
    },
  },
};
</script>
