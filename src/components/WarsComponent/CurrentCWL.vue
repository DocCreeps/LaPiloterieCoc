<template>
  <div v-if="warLeagueGroup && warLeagueGroup.rounds">
    <h2 class="font-bold text-2xl sm:text-3xl mb-4 text-center">Résultat Round  (LDC)</h2>
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
        <div v-for="warTag in warLeagueGroup.rounds[selectedRound].warTags" :key="warTag" class="w-full md:w-1/2 p-4">
          <div class="mb-4 p-4 border rounded">
            <div v-if="warDetails[warTag]" class="flex items-center justify-between">
              <div class="flex flex-col items-center">
                <div class="flex flex-row items-center">
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
                <div class="flex flex-row items-center">
                  <img :src="warDetails[warTag].opponent.badgeUrls.small" alt="Badge du Clan" class="mr-2" />
                  <h3 class="font-bold text-xl">{{ warDetails[warTag].opponent.name }}</h3>
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
            <div v-else>
              (Round en attente de préparation)
            </div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="font-bold text-2xl sm:text-3xl mb-4 text-center">Roster des clans (LDC)</h2>
    <div class="flex flex-wrap mx-4">
      <div v-for="clan in warLeagueGroup.clans" :key="clan.tag" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
        <div class="rounded border p-4 h-full shadow-md transition-transform duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <div class="text-center">
            <div class="flex flex-col items-center cursor-pointer" @click="getClanDetails(clan.tag)">
              <img :src="clan.badgeUrls.small" alt="Badge du Clan" class="" />
              <h2 class="text-xl font-bold mt-2">{{ clan.name }}</h2>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-center">
              Taille Équipe:
              <span class="rounded px-2 py-1 text-sm font-bold ml-2">{{ clan.members.length }}</span>
            </div>
            <div v-for="level in getTownHallLevels(clan.members)" :key="level.townHallLevel" class="mt-2">
              <button @click="toggleTownHallLevel(clan.tag, level.townHallLevel)" class="flex items-center justify-between w-full p-2">
            <span>
              <span class="rounded px-2 py-1 text-sm font-bold mr-2">{{ level.count }}</span>
              HDV {{ level.townHallLevel }}
            </span>
                <svg v-if="isTownHallLevelExpanded(clan.tag, level.townHallLevel)" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M5 15l7-7 7 7" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul v-if="isTownHallLevelExpanded(clan.tag, level.townHallLevel)" class="mt-2 grid grid-cols-1 gap-2">
                <li v-for="member in getMembersByTownHallLevel(clan.members, level.townHallLevel)" :key="member.tag" class="flex items-center mr-4 py-2 cursor-pointer" @click="goToMemberDetails(member.tag)">
                  <img :src="townHallImage(member.townHallLevel)" :alt="`Hôtel de ville niveau ${member.townHallLevel}`" class="w-10 h-10 mr-2" />
                  <span>{{ member.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
  <div v-else>
    <p>Chargement des données de la LDC...</p>
  </div>
</template>

<script>
import { ref } from 'vue';
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
      selectedRound: 0, // Round sélectionné (null par défaut)
    };
  },
  methods: {
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$emit('clanClicked', cleanedClanTag);
    },
    goToMemberDetails(memberTag) {
      this.$router.push(`/players/${encodeURIComponent(memberTag)}`);
    },
    townHallImage(level) {
      if (level >= 1 && level <= 17) {
        return this.icons[`HDV/th_${level}`];
      }
      return null;
    },
    isRoundEmpty(round) {
      if (round && round.warTags) {
        return round.warTags.every(tag => tag === '#0');
      }
      return true; // Retourner true si round ou round.warTags est undefined
    },
  },
  setup(props, { emit }) {
    const expandedTownHallLevels = ref({});

    const getTownHallLevels = (members) => {
      const levels = {};
      members.forEach((member) => {
        if (!levels[member.townHallLevel]) {
          levels[member.townHallLevel] = 0;
        }
        levels[member.townHallLevel]++;
      });
      return Object.keys(levels)
        .map((level) => ({
          townHallLevel: parseInt(level),
          count: levels[level],
        }))
        .sort((a, b) => b.townHallLevel - a.townHallLevel);
    };

    const toggleTownHallLevel = (clanTag, townHallLevel) => {
      const key = `${clanTag}-${townHallLevel}`;
      if (expandedTownHallLevels.value[key]) {
        delete expandedTownHallLevels.value[key];
      } else {
        expandedTownHallLevels.value[key] = true;
      }
    };

    const isTownHallLevelExpanded = (clanTag, townHallLevel) => {
      const key = `${clanTag}-${townHallLevel}`;
      return expandedTownHallLevels.value[key];
    };

    const getMembersByTownHallLevel = (members, townHallLevel) => {
      return members.filter((member) => member.townHallLevel === townHallLevel);
    };

    return {
      getTownHallLevels,
      toggleTownHallLevel,
      isTownHallLevelExpanded,
      getMembersByTownHallLevel,
    };
  },
};
</script>
