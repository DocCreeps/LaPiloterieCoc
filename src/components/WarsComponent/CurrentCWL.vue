<template>
  <div v-if="warLeagueGroup && warLeagueGroup.rounds">
    <WarLeagueRoundResults :warLeagueGroup="warLeagueGroup" :warDetails="warDetails" />

    <div class="mb-4">
      <div class="relative flex overflow-hidden">
        <div
          class="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out"
          :style="{ left: sliderLeft + 'px', width: sliderWidth + 'px' }"
        ></div>
        <button
          tabindex="0"
          role="tab"
          :class="{'flex-grow text-center py-2 px-4 cursor-pointer opacity-70 transition-opacity duration-300 ease-in-out': true, 'opacity-100': selectedView === 'clan'}"
          @click="selectedView = 'clan'; $nextTick(updateSlider)"
        >
          Clans
        </button>
        <button
          tabindex="0"
          role="tab"
          :class="{'flex-grow text-center py-2 px-4 cursor-pointer opacity-70 transition-opacity duration-300 ease-in-out': true, 'opacity-100': selectedView === 'player'}"
          @click="selectedView = 'player'; $nextTick(updateSlider)"
        >
          Joueurs
        </button>
        <button
          tabindex="0"
          role="tab"
          :class="{'flex-grow text-center py-2 px-4 cursor-pointer opacity-70 transition-opacity duration-300 ease-in-out': true, 'opacity-100': selectedView === 'roster'}"
          @click="selectedView = 'roster'; $nextTick(updateSlider)"
        >
          Roster
        </button>
      </div>
    </div>

    <WarLeagueRoster
      v-if="selectedView === 'roster'"
      :warLeagueGroup="warLeagueGroup"
      @clanClicked="handleClanClicked"
      :is-visible="true"
    />
    <WarLeagueRanking
      v-if="selectedView === 'clan'"
      :warLeagueGroup="warLeagueGroup"
      :warDetails="warDetails"
      @clanClicked="handleClanClicked"
    />
    <PlayerRanking
      v-if="selectedView === 'player'"
      :warDetails="warDetails"
      :warLeagueGroup="warLeagueGroup"
    />
  </div>
  <div v-else>
    <p>Chargement des données de la LDC...</p>
  </div>
</template>

<script>
import WarLeagueRanking from '@/components/CWLComponent/WarLeagueRanking.vue';
import WarLeagueRoundResults from '@/components/CWLComponent/WarLeagueRoundResults.vue';
import WarLeagueRoster from '@/components/CWLComponent/WarLeagueRoster.vue';
import PlayerRanking from '@/components/CWLComponent/PlayerRanking.vue';

export default {
  components: {
    PlayerRanking,
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
      default: () => ({}),
    },
    icons: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['clanClicked'],
  data() {
    return {
      selectedView: 'clan', // Vue sélectionnée par défaut sur 'clan'
      sliderLeft: 0,
      sliderWidth: 0,
    };
  },
  mounted() {
    this.updateSlider();
  },
  methods: {
    handleClanClicked(clanTag) {
      this.$emit('clanClicked', clanTag);
    },
    updateSlider() {
      const activeTab = this.$el.querySelector('.opacity-100');
      if (activeTab) {
        this.sliderLeft = activeTab.offsetLeft;
        this.sliderWidth = activeTab.offsetWidth;
      } else {
        this.sliderLeft = 0;
        this.sliderWidth = 0;
      }
    },
  },
};
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.bottom-0 {
  bottom: 0;
}

.left-0 {
  left: 0;
}
</style>
