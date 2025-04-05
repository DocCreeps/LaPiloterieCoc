<template>
    <h2 class="font-bold text-2xl sm:text-3xl mb-4 text-center">Résultat Round (LDC)</h2>
    <div class="flex sm:flex-row flex-wrap justify-center space-x-4 space-y-4 sm:space-y-0 mb-4 mt-4">
      <button
        v-for="(round, index) in warLeagueGroup.rounds"
        :key="index"
        @click="selectedRound = index"
        :class="{
          'bg-blue-500 text-white': selectedRound === index,
          'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900': selectedRound !== index,
        }"
        class="px-4 py-2 rounded transition-colors duration-200"
      >
        Round {{ index + 1 }}
      </button>
    </div>

    <div v-if="selectedRound !== null && warLeagueGroup.rounds[selectedRound]">
      <div class="flex flex-wrap mx-4">
        <div v-for="warTag in warLeagueGroup.rounds[selectedRound].warTags" :key="warTag" class="w-full lg:w-1/2 p-4">
          <div class="mb-4 p-4 border rounded relative" :class="getWarCardGradient(warDetails[warTag])">
            <div v-if="warDetails[warTag]" class="flex items-center justify-between">
              <div class="flex flex-col items-center">
                <div class="flex flex-col sm:flex-row text-center items-center">
                  <img :src="warDetails[warTag].clan.badgeUrls.small" alt="Badge du Clan" class="mr-2" />
                  <h3 class="font-bold text-xl">{{ warDetails[warTag].clan.name }}</h3>
                </div>
                <div class="flex flex-row items-center justify-center">
                  <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 mr-2" />
                  <span class="text-lg text-gray-600">{{ warDetails[warTag].clan.stars }}</span>
                </div>
                <div class="flex flex-row items-center justify-center">
                  <img :src="icons['icon/destruction']" alt="destruction" class="h-5 w-5 mr-2" />
                  <span class="text-lg text-gray-600">{{ warDetails[warTag].clan.destructionPercentage.toFixed(2) }}%</span>
                </div>
                <div class="flex flex-row items-center justify-center">
                  <img :src="icons['icon/Sword']" alt="attaques" class="h-5 w-5 mr-2" />
                  <span class="text-lg text-gray-600">{{ warDetails[warTag].clan.attacks }}</span>
                </div>
              </div>
              <span class="mx-2 text-2xl font-bold">vs</span>
              <div class="flex flex-col items-center">
                <div class="flex flex-col sm:flex-row text-center items-center">
                  <h3 class="font-bold text-xl order-2 sm:order-none">
                    {{ warDetails[warTag].opponent.name }}
                  </h3>
                  <img :src="warDetails[warTag].opponent.badgeUrls.small" alt="Badge du Clan" class="ml-2 order-1 sm:order-none" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <div class="flex flex-row items-center">
                    <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 mr-2" />
                    <span class="text-lg text-gray-600">{{ warDetails[warTag].opponent.stars }}</span>
                  </div>
                  <div class="flex flex-row items-center justify-center">
                    <img :src="icons['icon/destruction']" alt="destruction" class="h-5 w-5 mr-2" />
                    <span class="text-lg text-gray-600">{{ warDetails[warTag].opponent.destructionPercentage.toFixed(2) }}%</span>
                  </div>
                  <div class="flex flex-row items-center justify-center">
                    <img :src="icons['icon/Sword']" alt="attaques" class="h-5 w-5 mr-2" />
                    <span class="text-lg text-gray-600">{{ warDetails[warTag].opponent.attacks }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>(Round en attente de préparation)</div>
            <button
              v-if="warDetails[warTag]"
              @click="openAttackDetailsModal(warTag)"
              class="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              <img  :src="icons['icon/View']" alt="voir les détails" class="h-6 w-6 inline-block" />
            </button>
          </div>
        </div>
      </div>

      <CWLRoundAtkModal
        v-if="showAttackDetailsModal"
        :warDetails="getWarDetailsForModal()"
        :icons="icons"
        @close="closeAttackDetailsModal"
      />
    </div>
</template>

<style scoped>
.modal-open {
  overflow: hidden;
}

.bg-green-200 {
  background-color: #c6f6d5;
}

.bg-orange-200 {
  background-color: #fde68a;
}

.bg-red-200 {
  background-color: #fecaca;
}
</style>

<script>
import icons from '@/assets/icons.js';
import CWLRoundAtkModal from '@/components/CWLComponent/CWLAttaqueDetaile.vue';

export default {
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
  components: {
    icons: icons,
    CWLRoundAtkModal, // Enregistrez le composant
  },
  data() {
    return {
      icons: icons,
      selectedRound: 0,
      showAttackDetailsModal: false, // Indique si la modal des détails d'attaque est visible
      selectedWarTagForDetails: null, // Stocke le warTag de la guerre dont on affiche les détails
    };
  },
  methods: {
    getWarCardGradient(warDetails) {
      if (!warDetails) {
        return 'bg-white';
      }

      if (warDetails.clan.stars > warDetails.opponent.stars) {
        return 'bg-gradient-to-r from-green-400 via-orange-200 to-red-400';
      } else if (warDetails.clan.stars < warDetails.opponent.stars) {
        return 'bg-gradient-to-r from-red-400 via-orange-200 to-green-400';
      } else {
        return 'bg-white';
      }
    },
    openAttackDetailsModal(warTag) {
      this.selectedWarTagForDetails = warTag;
      this.showAttackDetailsModal = true;
      document.body.classList.add('modal-open'); // Ajoute la classe pour empêcher le défilement de l'arrière-plan
    },
    closeAttackDetailsModal() {
      this.selectedWarTagForDetails = null;
      this.showAttackDetailsModal = false;
      document.body.classList.remove('modal-open'); // Retire la classe pour réactiver le défilement de l'arrière-plan
    },
    getWarDetailsForModal() {
      return this.warDetails[this.selectedWarTagForDetails] || null;
    },
  },
};
</script>
