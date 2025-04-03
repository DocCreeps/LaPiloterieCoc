<template>
  <div class="mb-8">
    <h2 class="font-bold text-2xl sm:text-3xl mb-4 text-center">Classement des Clans (LDC)</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full shadow-md rounded text-sm">
        <thead>
        <tr>
          <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">&nbsp;</th>
          <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">&nbsp;</th>
          <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div class="flex items-center">
              <img :src="icons['icon/stars']" alt="étoiles" class="h-5 w-5 mr-1" />
              <span class="font-bold text-xl">Étoiles</span>
            </div>
          </th>
          <th class="px-6 py-3 bg-gray-50 text-left text-gray-500 uppercase tracking-wider font-bold text-xl">
            <div class="flex items-center">
              <span class="mr-1">%</span>
              <span class="">Destruction</span>
            </div>
          </th>
          <th class="px-6 py-3 bg-gray-50 text-left text-xl font-bold text-gray-500 uppercase tracking-wider">
            <span class="">Attaques</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(clan, index) in sortedClans" :key="clan.tag">
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="font-bold text-2xl">{{ index + 1 }}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <img :src="clan.badgeUrls.small" alt="Badge du Clan" class="mr-2" />
              <span class="text-xl font-bold">{{ clan.name }}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <span class="mr-2 font-bold text-xl">{{ getClanStars(clan.tag).split(' ')[0] }}</span>
              <span class="text-sm text-gray-500 font-bold">({{ getClanStars(clan.tag).split('(')[1] }} </span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            <span class="font-bold text-xl">{{ getClanDestruction(clan.tag) }}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex justify-around items-center font-bold text-xl">
              <span>{{ getTotalAttack(clan.tag) }}</span>
              <img :src="icons['icon/Sword']" alt="Total Atk" class="h-10 w-10" />
              <div v-for="star in sortAttackCountsKeys(getAttackCounts(clan.tag))" :key="star">
                <div class="flex flex-col">
                  <span class="text-center">{{ getAttackCounts(clan.tag)[star] }}</span>
                  <img :src="icons[`icon/stars-${star}`]" alt="étoiles" class="h-5 w-10" />
                </div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import icons from '@/assets/icons.js';

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
      return (totalDestruction).toFixed(2) + '%';
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
