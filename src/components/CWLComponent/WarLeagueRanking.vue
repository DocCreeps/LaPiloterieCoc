<template>
  <div class="mb-8">
<!--    <h2 class="font-bold text-2xl sm:text-3xl mb-4 text-center">Classement des Clans (LDC)</h2>-->
    <div class="flex flex-col">
      <div class="flex-col hidden sm:flex sm:flex-row justify-between bg-gray-50 font-bold text-xl text-gray-500 border-b border-gray-200">
        <div class="px-4 py-3 w-full sm:w-12">#</div>
        <div class="px-4 py-3 w-full sm:w-1/4">Clan</div>
        <div class="px-4 py-3 w-full sm:w-32">
          <div class="flex items-center justify-center">
            <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 mr-2" />
            <span>Étoiles</span>
          </div>
        </div>
        <div class="px-4 py-3 w-full sm:w-32">
          <div class="flex items-center justify-center">
            <span class="mr-2">%</span>
            <span>Destruction</span>
          </div>
        </div>
        <div class="px-4 py-3 w-full sm:w-64">
          <div class="flex items-center justify-center">Attaques</div>
        </div>
      </div>
      <div v-for="(clan, index) in sortedClans" :key="clan.tag" class="flex flex-col sm:flex-row justify-between border-b border-gray-200">
        <div class="px-4 py-4 w-full sm:w-12 flex items-center justify-center">
          <span class="font-bold text-2xl">{{ index + 1 }}</span>
        </div>
        <div class="px-4 py-4 w-full sm:w-1/4 flex items-center justify-center sm:justify-start cursor-pointer" @click="getClanDetails(clan.tag)">
          <img :src="clan.badgeUrls.small" alt="Badge du Clan" class="mr-2 " />
          <span class="text-xl font-bold">{{ clan.name }}</span>
        </div>

          <div class="flex items-center justify-center px-4 py-4 w-full sm:w-50">
            <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 mr-2" />
            <span class="mr-2 font-bold text-lg">{{ getClanStars(clan.tag).split(' ')[0] }}</span>
            <span class="text-sm text-gray-500 font-bold">({{ getClanStars(clan.tag).split('(')[1] }}</span>
          </div>

          <div class="flex items-center justify-center px-4 py-4 w-full sm:w-30">
            <span class="font-bold text-lg">{{ getClanDestruction(clan.tag) }}</span>
          </div>

          <div class="flex items-center justify-around px-4 py-4 w-full sm:w-64">
            <div class="flex flex-col">
              <div class="flex flex-row justify-center mb-2">
                <img :src="icons['icon/Sword']" alt="Total Atk" class="h-8 w-8 mr-2" />
                <span class="font-bold text-xl">{{ getTotalAttack(clan.tag) }}</span>
              </div>
              <div class="flex flex-row">
                <div v-for="star in sortAttackCountsKeys(getAttackCounts(clan.tag))" :key="star" class="flex flex-col items-center mx-2">
                  <span class="text-center font-bold text-xl">{{ getAttackCounts(clan.tag)[star] }}</span>
                  <img :src="icons[`icon/stars-${star}`]" alt="étoiles" class="h-5 w-10" />
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>

</template>

<script>
import icons from '@/assets/icons.js';

export default {
  components: {
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
  emits: ['clanClicked'],
  data() {
    return {
      icons: icons,
    };
  },
  computed: {
    sortedClans() {
      if (this.warLeagueGroup && this.warLeagueGroup.clans) {
        return [...this.warLeagueGroup.clans].sort((a, b) => {
          const starsA = this.getClanStars(a.tag).split(' ')[0];
          const starsB = this.getClanStars(b.tag).split(' ')[0];
          return starsB - starsA;
        });
      }
      return [];
    },
  },
  methods: {
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$emit('clanClicked', cleanedClanTag);
    },
    getClanStars(clanTag) {
      let totalStars = 0;
      let bonusStars = 0;
      let warsStars = 0;
      this.warLeagueGroup.rounds.forEach(round => {
        round.warTags.forEach(warTag => {
          const war = this.warDetails[warTag];
          if (war) {
            if (war.clan.tag === clanTag) {
              totalStars += war.clan.stars;
              warsStars += war.clan.stars;
              if (war.clan.stars > war.opponent.stars) {
                bonusStars += 10;
                totalStars += 10;
              }
            } else if (war.opponent.tag === clanTag) {
              totalStars += war.opponent.stars;
              warsStars += war.opponent.stars;
              if (war.opponent.stars > war.clan.stars) {
                bonusStars += 10;
                totalStars += 10;
              }
            }
          }
        });
      });
      return `${totalStars} (${warsStars} +${bonusStars})`;
    },
    getClanDestruction(clanTag) {
      let totalDestruction = 0;
      this.warLeagueGroup.rounds.forEach(round => {
        round.warTags.forEach(warTag => {
          const war = this.warDetails[warTag];
          if (war) {
            if (war.clan.tag === clanTag) {
              totalDestruction += war.clan.destructionPercentage;
            } else if (war.opponent.tag === clanTag) {
              totalDestruction += war.opponent.destructionPercentage;
            }
          }
        });
      });
      return (totalDestruction).toFixed(2) + ' %';
    },
    getClanAttackDistribution(clanTag) {
      const attackCounts = {
        3: 0,
        2: 0,
        1: 0,
        0: 0,
      };
      this.warLeagueGroup.rounds.forEach(round => {
        round.warTags.forEach(warTag => {
          const war = this.warDetails[warTag];
          if (war) {
            if (war.clan.tag === clanTag && Array.isArray(war.clan.members)) {
              war.clan.members.forEach(member => {
                if (Array.isArray(member.attacks)) {
                  member.attacks.forEach(attack => {
                    if (attack.stars === 3) {
                      attackCounts[3]++;
                    } else if (attack.stars === 2) {
                      attackCounts[2]++;
                    } else if (attack.stars === 1) {
                      attackCounts[1]++;
                    } else {
                      attackCounts[0]++;
                    }
                  });
                }
              });
            } else if (war.opponent.tag === clanTag && Array.isArray(war.opponent.members)) {
              war.opponent.members.forEach(member => {
                if (Array.isArray(member.attacks)) {
                  member.attacks.forEach(attack => {
                    if (attack.stars === 3) {
                      attackCounts[3]++;
                    } else if (attack.stars === 2) {
                      attackCounts[2]++;
                    } else if (attack.stars === 1) {
                      attackCounts[1]++;
                    } else {
                      attackCounts[0]++;
                    }
                  });
                }
              });
            }
          }
        });
      });
      return `${attackCounts[3]}/${attackCounts[2]}/${attackCounts[1]}/${attackCounts[0]}`;
    },
    getAttackCounts(clanTag) {
      const attackDistribution = this.getClanAttackDistribution(clanTag).split('/');
      return {
        3: attackDistribution[0],
        2: attackDistribution[1],
        1: attackDistribution[2],
        0: attackDistribution[3],
      };
    },
    sortAttackCountsKeys(attackCounts) {
      return Object.keys(attackCounts).sort((a, b) => parseInt(b) - parseInt(a));
    },
    getTotalAttack(clanTag) {
      const attackDistribution = this.getClanAttackDistribution(clanTag).split('/');
      return parseInt(attackDistribution[0]) + parseInt(attackDistribution[1]) + parseInt(attackDistribution[2]) + parseInt(attackDistribution[3])
    },
  },
};
</script>
