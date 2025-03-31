<template>
  <div>
    <div
      v-if="currentWar && currentWar.state !== 'notInWar'"
      :class="getWarResultClass(currentWar)"
      class="p-2 mb-2 rounded-lg flex flex-col w-10/12 sm:w-full md:flex-row gap-4 items-center justify-center mx-auto"
    >
      <div class="flex flex-col sm:flex-row items-center cursor-pointer" @click="getClanDetails(currentWar.clan.tag)">
        <div class="flex flex-col items-center sm:flex-row">
          <img :src="currentWar.clan.badgeUrls.medium" alt="Badge" class=" sm:mb-0 sm:mr-2" />
          <span class="font-bold text-lg">{{ currentWar.clan.name }}</span>
        </div>
      </div>

      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-col items-center">
          <div class="flex flex-row mr-4">
            <span class="text-xl font-bold mr-2 mb-4">{{ currentWar.clan.stars }}</span>
            <img :src="icons['icon/stars']" alt="étoiles" class="h-8 w-8 inline-block mr-2" />
          </div>
          <span class="text-sm text-gray-600">({{ currentWar.clan.destructionPercentage.toFixed(2) }}%)</span>
        </div>

        <span class="text-3xl font-extrabold">-</span>

        <div class="flex flex-col items-center">
          <div class="flex flex-row ml-4">
            <img :src="icons['icon/stars']" alt="étoiles" class="h-8 w-8 inline-block mr-2" />
            <span class="text-xl font-bold mr-2 mb-4">{{ currentWar.opponent.stars }}</span>
          </div>
          <span class="text-sm text-gray-600">({{ currentWar.opponent.destructionPercentage.toFixed(2) }}%)</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center cursor-pointer" @click="getClanDetails(currentWar.opponent.tag)">
        <div class="flex flex-col items-center sm:flex-row">
          <span class="font-bold text-lg mb-2 sm:mb-0 sm:mr-2">{{ currentWar.opponent.name }}</span>
          <img :src="currentWar.opponent.badgeUrls.medium" alt="Badge" />
        </div>
      </div>

      <button @click="showDetails = !showDetails" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <img v-if="showDetails" :src="icons['icon/unview']" alt="Masquer les détails" class="h-6 w-6 inline-block" />
        <img v-else :src="icons['icon/View']" alt="Voir les détails" class="h-6 w-6 inline-block" />
      </button>
    </div>

    <div v-if="showDetails" class="w-10/12 sm:w-full mx-auto mt-4 bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-center text-3xl font-bold mb-2">Détails de la guerre en cours</h2>

      <div class="flex">
        <div class="w-1/2 pr-2">
          <h3 class="text-center text-2xl font-bold">{{ currentWar.clan.name }}</h3>
          <div v-for="member in sortedClanMembers" :key="member.tag">
            <div class="mb-4 p-4 rounded-lg shadow-md">
              <h3 class="text-center text-xl" > <b>{{ member.name }}</b> ({{ member.tag }})</h3>
              <div v-if="member.attacks && member.attacks.length > 0">
                <h4 class="font-bold">Attaques:</h4>
                <div class="flex">
                  <div v-for="attack in member.attacks" :key="attack.order" :class="getAttackClass(attack.destructionPercentage, attack.stars)" class="border p-2 rounded-md mb-2 mr-2">

                    <p>
                      <b>{{ getAttackerMapPosition(attack.attackerTag) }}</b> : {{ getDefenderName(attack.defenderTag) }}
                    </p>
                    <p>
                      {{ attack.stars }}  <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-2" />  ({{ attack.destructionPercentage }}%) - {{ formatDuration(attack.duration) }}
                    </p>
                  </div>
                </div>
              </div>
              <p v-else>Aucune attaque.</p>
              <div v-if="getOpponentAttacks(member.tag).length > 0">
                <h4 class="font-bold">Défenses:</h4>
                <div class="flex">
                  <div v-for="defense in getOpponentAttacks(member.tag)" :key="defense.attackerTag" :class="getAttackClass(defense.destructionPercentage, defense.stars)" class="border p-2 rounded-md mb-2 mr-2">
                    <p>
                      <b>{{ getAttackerMapPosition(defense.attackerTag) }}</b> : {{ getEnemyAttackerName(defense.attackerTag) }}
                    </p>
                    <p>
                      {{ defense.stars }}
                      <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-2" />
                      ({{ defense.destructionPercentage }}%) - {{ formatDuration(defense.duration) }}
                    </p>
                  </div>
                </div>
              </div>
              <p v-else>Aucune défense.</p>
            </div>
          </div>
        </div>

        <div class="w-1/2 pl-2">
          <h3 class="text-center text-2xl font-bold">{{ currentWar.opponent.name }}</h3>
          <div v-for="member in sortedOpponentMembers" :key="member.tag">
            <div class="mb-4 p-4 rounded-lg shadow-md">
              <h3 class="text-center text-xl"> <b>{{ member.name }}</b> ({{ member.tag }})</h3>
              <div v-if="member.attacks && member.attacks.length > 0">
                <h4 class="font-bold">Attaques:</h4>
                <div class="flex">
                  <div v-for="attack in member.attacks" :key="attack.order" :class="getAttackClass(attack.destructionPercentage, attack.stars)" class="border p-2 rounded-md mb-2 mr-2">
                    <p>
                      <b>{{ getAttackerMapPosition(attack.attackerTag) }} </b>: {{ getOurAttackerName(attack.defenderTag) }}
                    </p>
                    <p>
                      {{ attack.stars }}  <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-2" />  ({{ attack.destructionPercentage }}%) - {{ formatDuration(attack.duration) }}
                    </p>
                  </div>
                </div>
              </div>
              <p v-else>Aucune attaque.</p>
              <div v-if="getClanAttacks(member.tag).length > 0">
                <h4 class="font-bold" >Défenses:</h4>
                <div class="flex">
                  <div v-for="defense in getClanAttacks(member.tag)" :key="defense.attackerTag" :class="getAttackClass(defense.destructionPercentage, defense.stars)" class="border p-2 rounded-md mb-2 mr-2">

                    <p>
                      <b>{{ getAttackerMapPosition(defense.attackerTag) }}</b> : {{ getOurAttackerName(defense.attackerTag) }}
                    </p>
                    <p>
                      {{ defense.stars }}
                      <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-2" />
                      ({{ defense.destructionPercentage }}%) - {{ formatDuration(defense.duration) }}
                    </p>
                  </div>
                </div>
              </div>
              <p v-else>Aucune défense.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  props: {
    wars: Array,
    currentWar: Object,
    icons: Object,
  },
  data() {
    return {
      showGdc: false,
      currentPage: 1,
      itemsPerPage: 10,
      showDetails: false,
    };
  },
  methods: {
    toggleGdc() {
      this.showGdc = !this.showGdc;
    },
    getResultClass(result) {
      return {
        'bg-green-100': result === 'win',
        'bg-gray-100': result === 'draw',
        'bg-red-100': result === 'lose',
      };
    },
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
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$emit('clanClicked', cleanedClanTag);
    },
    getWarResultClass(currentWar) {
      if (currentWar.clan.stars > currentWar.opponent.stars) {
        return 'bg-green-100';
      } else if (currentWar.clan.stars < currentWar.opponent.stars) {
        return 'bg-red-100';
      } else {
        if (currentWar.clan.destructionPercentage > currentWar.opponent.destructionPercentage) {
          console.log("win en cour");
          return 'bg-green-100';
        } else if (currentWar.clan.destructionPercentage < currentWar.opponent.destructionPercentage) {
          return 'bg-red-100';
        }
        return 'bg-gray-100';
      }
    },
    getOpponentAttacks(defenderTag) {
      if (!this.currentWar || !this.currentWar.opponent || !this.currentWar.opponent.members) {
        return [];
      }
      const opponentAttacks = [];
      this.currentWar.opponent.members.forEach(member => {
        if (member.attacks) {
          member.attacks.forEach(attack => {
            if (attack.defenderTag === defenderTag) {
              opponentAttacks.push(attack);
            }
          });
        }
      });
      return opponentAttacks;
    },
    getClanAttacks(defenderTag) {
      if (!this.currentWar || !this.currentWar.clan || !this.currentWar.clan.members) {
        return [];
      }
      const clanAttacks = [];
      this.currentWar.clan.members.forEach(member => {
        if (member.attacks) {
          member.attacks.forEach(attack => {
            if (attack.defenderTag === defenderTag) {
              clanAttacks.push(attack);
            }
          });
        }
      });
      return clanAttacks;
    },
    getDefenderName(defenderTag) {
      if (!this.currentWar || !this.currentWar.opponent || !this.currentWar.opponent.members) {
        return defenderTag;
      }
      const defender = this.currentWar.opponent.members.find(member => member.tag === defenderTag);
      return defender ? defender.name : defenderTag;
    },
    getOurAttackerName(attackerTag) {
      if (!this.currentWar || !this.currentWar.clan || !this.currentWar.clan.members) {
        return attackerTag;
      }
      const attacker = this.currentWar.clan.members.find(member => member.tag === attackerTag);
      return attacker ? attacker.name : attackerTag;
    },
    getEnemyAttackerName(attackerTag) {
      if (!this.currentWar || !this.currentWar.opponent || !this.currentWar.opponent.members) {
        return attackerTag;
      }
      const attacker = this.currentWar.opponent.members.find(member => member.tag === attackerTag);
      return attacker ? attacker.name : attackerTag;
    },
    getAttackClass(destructionPercentage, stars) {
      if (stars === 3) {
        return 'bg-green-200';
      } else if (stars >= 1 || destructionPercentage >= 50) {
        return 'bg-orange-200';
      } else {
        return 'bg-red-200';
      }
    },
    getAttackerMapPosition(attackerTag) {
      if (!this.currentWar) {
        return '';
      }

      const clanMember = this.currentWar.clan.members.find(member => member.tag === attackerTag);
      if (clanMember) {
        return clanMember.mapPosition;
      }

      const opponentMember = this.currentWar.opponent.members.find(member => member.tag === attackerTag);
      if (opponentMember) {
        return opponentMember.mapPosition;
      }

      return '';
    },
    formatDuration(durationInSeconds) {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      return `${minutes}m ${seconds}s`;
    },
  },
  computed: {
    filteredWars() {
      return this.wars.filter(war => war.opponent && war.opponent.name);
    },
    paginatedWars() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredWars.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredWars.length / this.itemsPerPage);
    },
    sortedClanMembers() {
      return this.currentWar && this.currentWar.clan && this.currentWar.clan.members
        ? this.currentWar.clan.members.map(member => reactive({
          ...member,
          showAttacks: false,
        })).sort((a, b) => a.mapPosition - b.mapPosition)
        : [];
    },
    sortedOpponentMembers() {
      return this.currentWar && this.currentWar.opponent && this.currentWar.opponent.members
        ? this.currentWar.opponent.members.map(member => reactive({
          ...member,
          showAttacks: false,
        })).sort((a, b) => a.mapPosition - b.mapPosition)
        : [];
    },
  },
};
</script>

<style scoped>
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
