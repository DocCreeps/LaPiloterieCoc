<template>
  <div class="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50" @click.self="$emit('close')">
    <div class="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3 h-2/3 overflow-y-auto" @click.stop>
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-center text-3xl font-bold mb-2">Détails du round LDC</h2>
      <div v-if="warDetails">
        <div class="flex flex-col sm:flex-row">
          <div class="w-full sm:w-1/2 pr-2">
            <h3 class="text-center text-2xl font-bold">{{ warDetails.clan.name }}</h3>
            <div v-for="member in sortMembersByMapPosition(warDetails.clan.members)" :key="member.tag">
              <div class="mb-4 p-4 rounded-lg shadow-md">
                <h3 class="text-center text-xl"><b>{{ member.name }}</b> ({{ member.tag }})</h3>
                <p>
                  Ratio étoiles (Attaque/Défense) :
                  <b>{{ calculateAttackDefenseRatio(member.attacks, getOpponentAttacks(member.tag)) }}</b>
                </p>
                <div class="flex items-center justify-between">
                  <div>
                    <div v-if="member.attacks && member.attacks.length > 0">
                      <h4 class="font-bold inline-block mr-2">Attaques:</h4>
                      <span class="inline-block">({{ calculateAttackStars(member.attacks) }} <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-1" />)</span>
                      <div class="flex flex-wrap mt-1">
                        <div
                          v-for="attack in member.attacks"
                          :key="attack.order"
                          :class="getAttackClass(attack.destructionPercentage, attack.stars)"
                          class="border p-2 rounded-md mb-2 mr-2 text-sm"
                        >
                          <p>
                            <b>{{ getDefenderMapPosition(attack.defenderTag) }}</b> :
                            {{ getDefenderName(attack.defenderTag) }}
                          </p>
                          <p>
                            {{ attack.stars }}
                            <img :src="icons['icon/stars']" alt="étoiles" class="h-4 w-4 inline-block mr-1" />
                            ({{ attack.destructionPercentage }}%) - {{ formatDuration(attack.duration) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p v-else>Aucune attaque.</p>
                  </div>
                  <div>
                    <div v-if="getOpponentAttacks(member.tag).length > 0">
                      <h4 class="font-bold inline-block mr-2">Défenses:</h4>
                      <span class="inline-block">({{ calculateDefenseStars(getOpponentAttacks(member.tag)) }} <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-1" />)</span>
                      <div class="flex flex-wrap mt-1">
                        <div
                          v-for="defense in getOpponentAttacks(member.tag)"
                          :key="defense.attackerTag"
                          :class="getAttackClass(defense.destructionPercentage, defense.stars)"
                          class="border p-2 rounded-md mb-2 mr-2 text-sm"
                        >
                          <p>
                            <b>{{ getAttackerMapPosition(defense.attackerTag) }}</b> :
                            {{ getEnemyAttackerName(defense.attackerTag) }}
                          </p>
                          <p>
                            {{ defense.stars }}
                            <img :src="icons['icon/stars']" alt="étoiles" class="h-4 w-4 inline-block mr-1" />
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

          <div class="w-full sm:w-1/2 pl-2">
            <h3 class="text-center text-2xl font-bold">{{ warDetails.opponent.name }}</h3>
            <div v-for="member in sortMembersByMapPosition(warDetails.opponent.members)" :key="member.tag">
              <div class="mb-4 p-4 rounded-lg shadow-md">
                <h3 class="text-center text-xl"><b>{{ member.name }}</b> ({{ member.tag }})</h3>
                <p>
                  Ratio étoiles (Attaque/Défense) :
                  <b>{{ calculateAttackDefenseRatio(member.attacks, getClanAttacks(member.tag)) }}</b>
                </p>
                <div class="flex items-center justify-between">
                  <div>
                    <div v-if="member.attacks && member.attacks.length > 0">
                      <h4 class="font-bold inline-block mr-2">Attaques:</h4>
                      <span class="inline-block">({{ calculateAttackStars(member.attacks) }} <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-1" />)</span>
                      <div class="flex flex-wrap mt-1">
                        <div
                          v-for="attack in member.attacks"
                          :key="attack.order"
                          :class="getAttackClass(attack.destructionPercentage, attack.stars)"
                          class="border p-2 rounded-md mb-2 mr-2 text-sm"
                        >
                          <p>
                            <b>{{ getDefenderMapPosition(attack.defenderTag) }}</b> :
                            {{ getOurAttackerName(attack.defenderTag) }}
                          </p>
                          <p>
                            {{ attack.stars }}
                            <img :src="icons['icon/stars']" alt="étoiles" class="h-4 w-4 inline-block mr-1" />
                            ({{ attack.destructionPercentage }}%) - {{ formatDuration(attack.duration) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p v-else>Aucune attaque.</p>
                  </div>
                  <div>
                    <div v-if="getClanAttacks(member.tag).length > 0">
                      <h4 class="font-bold inline-block mr-2">Défenses:</h4>
                      <span class="inline-block">({{ calculateDefenseStars(getClanAttacks(member.tag)) }} <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 inline-block mr-1" />)</span>
                      <div class="flex flex-wrap mt-1">
                        <div
                          v-for="defense in getClanAttacks(member.tag)"
                          :key="defense.attackerTag"
                          :class="getAttackClass(defense.destructionPercentage, defense.stars)"
                          class="border p-2 rounded-md mb-2 mr-2 text-sm"
                        >
                          <p>
                            <b>{{ getAttackerMapPosition(defense.attackerTag) }}</b> :
                            {{ getOurAttackerName(defense.attackerTag) }}
                          </p>
                          <p>
                            {{ defense.stars }}
                            <img :src="icons['icon/stars']" alt="étoiles" class="h-4 w-4 inline-block mr-1" />
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
      </div>
      <div v-else>
        <p>Les détails de cette guerre ne sont pas disponibles pour le moment.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    warDetails: {
      type: Object,
      default: null,
    },
    icons: {
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    getAttackClass(destructionPercentage, stars) {
      if (stars === 3) {
        return 'bg-green-200';
      } else if (stars >= 1 || destructionPercentage >= 50) {
        return 'bg-orange-200';
      } else {
        return 'bg-red-200';
      }
    },
    getOpponentAttacks(defenderTag) {
      if (!this.warDetails || !this.warDetails.opponent || !this.warDetails.opponent.members) {
        return [];
      }
      const opponentAttacks = [];
      this.warDetails.opponent.members.forEach(member => {
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
      if (!this.warDetails || !this.warDetails.clan || !this.warDetails.clan.members) {
        return [];
      }
      const clanAttacks = [];
      this.warDetails.clan.members.forEach(member => {
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
      if (!this.warDetails || !this.warDetails.opponent || !this.warDetails.opponent.members) {
        return defenderTag;
      }
      const defender = this.warDetails.opponent.members.find(member => member.tag === defenderTag);
      return defender ? defender.name : defenderTag;
    },
    getOurAttackerName(attackerTag) {
      if (!this.warDetails || !this.warDetails.clan || !this.warDetails.clan.members) {
        return attackerTag;
      }
      const attacker = this.warDetails.clan.members.find(member => member.tag === attackerTag);
      return attacker ? attacker.name : attackerTag;
    },
    getEnemyAttackerName(attackerTag) {
      if (!this.warDetails || !this.warDetails.opponent || !this.warDetails.opponent.members) {
        return attackerTag;
      }
      const attacker = this.warDetails.opponent.members.find(member => member.tag === attackerTag);
      return attacker ? attacker.name : attackerTag;
    },
    getAttackerMapPosition(attackerTag) {
      if (!this.warDetails) {
        return '';
      }

      const clanMember = this.warDetails.clan.members.find(member => member.tag === attackerTag);
      if (clanMember) {
        return clanMember.mapPosition;
      }

      const opponentMember = this.warDetails.opponent.members.find(member => member.tag === attackerTag);
      if (opponentMember) {
        return opponentMember.mapPosition;
      }

      return '';
    },
    getDefenderMapPosition(defenderTag) {
      if (!this.warDetails) {
        return '';
      }

      const clanMember = this.warDetails.clan.members.find(member => member.tag === defenderTag);
      if (clanMember) {
        return clanMember.mapPosition;
      }

      const opponentMember = this.warDetails.opponent.members.find(member => member.tag === defenderTag);
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
    calculateAttackDefenseRatio(attacks, defenses) {
      const attackStars = attacks ? attacks.reduce((sum, attack) => sum + attack.stars, 0) : 0;
      const defenseStars = defenses ? defenses.reduce((sum, defense) => sum + defense.stars, 0) : 0;

      if (attackStars === 0 && defenseStars === 0) {
        return '0';
      }

      if (defenseStars === 0) {
        return attackStars.toString();
      }

      if (attackStars === 0) {
        return '-' + defenseStars.toString();
      }

      return (attackStars / defenseStars).toFixed(2);
    },
    calculateAttackStars(attacks) {
      return attacks ? attacks.reduce((sum, attack) => sum + attack.stars, 0) : 0;
    },
    calculateDefenseStars(defenses) {
      return defenses ? defenses.reduce((sum, defense) => sum + defense.stars, 0) : 0;
    },
    sortMembersByMapPosition(members) {
      return [...members].sort((a, b) => a.mapPosition - b.mapPosition);
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
