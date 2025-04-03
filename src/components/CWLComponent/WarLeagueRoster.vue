<template>
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
</template>

<script>
import icons from '@/assets/icons.js';

export default {
  props: {
    warLeagueGroup: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      icons: icons,
      expandedTownHallLevels: {},
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
    getTownHallLevels(members) {
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
    },
    toggleTownHallLevel(clanTag, townHallLevel) {
      const key = `${clanTag}-${townHallLevel}`;
      if (this.expandedTownHallLevels[key]) {
        delete this.expandedTownHallLevels[key];
      } else {
        this.expandedTownHallLevels[key] = true;
      }
    },
    isTownHallLevelExpanded(clanTag, townHallLevel) {
      const key = `${clanTag}-${townHallLevel}`;
      return this.expandedTownHallLevels[key];
    },
    getMembersByTownHallLevel(members, townHallLevel) {
      return members.filter((member) => member.townHallLevel === townHallLevel);
    },
  },
};
</script>
