<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6 text-center">Membres</h2>

    <div class="mb-6 flex flex-col sm:flex-row justify-center items-center gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un membre..."
        class="w-full sm:w-64 p-2 border rounded"
      />
      <select v-model="selectedTownHallLevel" class="p-2 border rounded w-full sm:w-auto">
        <option value="">Tous les HDV</option>
        <option v-for="level in townHallLevels" :key="level" :value="level">
          HDV {{ level }}
        </option>
      </select>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="member in filteredMembers"
        :key="member.tag"
        @click="goToMemberDetails(member.tag)"
        class="bg-white p-4 rounded-lg shadow-md cursor-pointer w-full"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div class="flex items-center mb-2 mb-0">
            <img :src="member.league?.iconUrls.small" alt="League Badge" class="w-12 h-12 mr-4" />
            <div>
              <h3 class="text-xl font-semibold">{{ member.name }}</h3>
              <p class="text-gray-600">{{ translateRole(member.role) }}</p>
            </div>
          </div>

          <div class="flex items-center mt-2">
            <div class="flex items-center">
              <img v-if="member.previousClanRank - member.clanRank > 0" :src="icons['icon/up']" alt="up" class="h-7 w-7" />
              <img v-else-if="member.previousClanRank - member.clanRank < 0" :src="icons['icon/down']" alt="down" class="h-7 w-7" />
              <img v-else :src="icons['icon/nomove']" alt="equal" class="h-7 w-7" />
              <p class="ml-2">{{ member.previousClanRank - member.clanRank }}</p>
            </div>

          </div>
          <div class="flex items-center mt-2">
            <div class="flex flex-row ml-4 mt-2 sm:mt-0">
              <img :src="icons['icon/xp']" alt="experience" class="h-7 w-7" />
              <p class="text-gray-600 ml-2">{{ member.expLevel }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-around items-center">
          <div class="flex items-center mb-4 sm:mb-0">
            <img
              v-if="member && getTownHallImage(member.townHallLevel)"
              :src="getTownHallImage(member.townHallLevel)"
              :title="'HDV ' + member.townHallLevel"
              :alt="'HDV' + member.townHallLevel"
              class="w-20 h-20 mr-4"
            />
            <div class="flex items-center">
              <img :src="icons['icon/Trophy']" alt="Trophée" class="h-10 w-10 mr-1" />
              <p class="text-gray-600 ml-1">{{ member.trophies }}</p>
            </div>
          </div>

          <div class="flex items-center mt-4 sm:mt-0">
            <img
              v-if="member && getBuilderHallImage(member.builderHallLevel)"
              :src="getBuilderHallImage(member.builderHallLevel)"
              :title="'MDO ' + member.builderHallLevel"
              :alt="'MDO' + member.builderHallLevel"
              class="w-20 h-20 sm:ml-8 mr-4"
            />
            <div class="flex items-center">
              <img :src="icons['icon/mdo_trophy']" alt="Trophée MDO" class="h-10 w-10 mr-1" />
              <p class="text-gray-600 ml-1">{{ member.builderBaseTrophies }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>





<script>
export default {
  props: {
    clan: Object,
    icons: Object,
  },
  data() {
    return {
      searchQuery: '',
      selectedTownHallLevel: '',
      townHallLevels: [],
    };
  },
  computed: {
    filteredMembers() {
      let members = this.clan?.memberList || [];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        members = members.filter(member => {
          return member.name.toLowerCase().includes(query) ||
            this.translateRole(member.role).toLowerCase().includes(query);
        });
      }

      if (this.selectedTownHallLevel && this.selectedTownHallLevel !== '') {
        members = members.filter(member => {
          return member.townHallLevel === parseInt(this.selectedTownHallLevel);
        });
      }

      return members;
    },
  },
  methods: {
    translateRole(role) {
      const roles = {
        leader: 'Chef',
        coLeader: 'Adjoint',
        admin: 'Aîné',
        member: 'Membre',
      };
      return roles[role] || role;
    },
    goToMemberDetails(memberTag) {
      this.$router.push(`/players/${encodeURIComponent(memberTag)}`);
    },
    getTownHallImage(level) {
      if (level >= 1 && level <= 17) {
        const iconName = `HDV/th_${level}`;
        return this.icons[iconName];
      }
      return null;
    },
    getBuilderHallImage(level) {
      if (level >= 1 && level <= 10) {
        const iconName = `HDV/MDO_${level}`;
        return this.icons[iconName];
      }
      return null;
    },
  },
  watch: {
    clan: {
      immediate: true,
      handler(newClan) {
        if (newClan && newClan.memberList) {
          this.townHallLevels = [...new Set(newClan.memberList.map(member => member.townHallLevel))].sort((a, b) => a - b);
        } else {
          this.townHallLevels = [];
        }
      }
    },
    selectedTownHallLevel() {
      this.filteredMembers;
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
