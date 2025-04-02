<template>
  <div v-if="warLeagueGroup">
    <h2 class="font-bold text-3xl mb-4 text-center">Roster des clans (LDC)</h2>
    <div class="flex flex-wrap -mx-4">
      <div v-for="clan in warLeagueGroup.clans" :key="clan.tag" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
        <div class="border rounded p-4 h-full">
          <div class="text-center">
            <div class="flex flex-col items-center cursor-pointer" @click="getClanDetails(clan.tag)">
              <img :src="clan.badgeUrls.small" alt="Badge du Clan" class="  " />

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
                <li v-for="member in getMembersByTownHallLevel(clan.members, level.townHallLevel)" :key="member.tag" class="flex items-center mr-4 py-2">
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
import icons from '@/assets/icons.js'; // Importez vos icônes ici

export default {
  props: {
    warLeagueGroup: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      icons: icons, // Assurez-vous que vos icônes sont disponibles ici
    };
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      alert('Tag Copied');
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace('#', '');
      this.$emit('clanClicked', cleanedClanTag);
    },
    townHallImage(level) {
      if (level >= 1 && level <= 17) {
        return this.icons[`HDV/th_${level}`];
      }
      return null;
    },
  },
  setup() {
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
