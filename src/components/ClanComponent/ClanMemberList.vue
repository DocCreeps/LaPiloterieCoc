<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6 text-center">Membres</h2>

    <div class="mb-6 flex flex-col sm:flex-row justify-center items-center gap-2">
      <label for="search" class="sr-only">Rechercher un membre</label>
      <input
        id="search"
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un membre..."
        class="w-full sm:w-64 p-2 border rounded"
      />
      <label for="townHallLevel" class="sr-only">Niveau de l'Hôtel de Ville</label>
      <select id="townHallLevel" v-model="selectedTownHallLevel" class="p-2 border rounded w-full sm:w-auto">
        <option value="">Tous les HDV</option>
        <option v-for="level in townHallLevels" :key="level" :value="level">
          HDV {{ level }}
        </option>
      </select>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <MemberCard
        v-for="member in filteredMembers"
        :key="member.tag"
        :member="member"
        :icons="icons"
        @click="goToMemberDetails(member.tag)"
      />
    </div>
  </div>
</template>

<script>
import MemberCard from './MemberCard.vue';

export default {
  components: {
    MemberCard,
  },
  props: {
    clan: {
      type: Object,
      required: true
    },
    icons: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedTownHallLevel: '',
      townHallLevels: [],
      debounceTimeout: null
    };
  },
  computed: {
    filteredMembers() {
      let members = this.clan?.memberList || [];
      const query = this.searchQuery.toLowerCase();
      const selectedLevel = parseInt(this.selectedTownHallLevel);

      return members.filter(member => {
        const nameMatch = member.name.toLowerCase().includes(query);
        const roleMatch = this.translateRole(member.role).toLowerCase().includes(query);
        const levelMatch = !selectedLevel || member.townHallLevel === selectedLevel;
        return (nameMatch || roleMatch) && levelMatch;
      });
    }
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
    }
  },
  watch: {
    clan: {
      immediate: true,
      handler(newClan) {
        if (newClan && Array.isArray(newClan.memberList)) {
          this.townHallLevels = [...new Set(newClan.memberList.map(member => member.townHallLevel))].sort((a, b) => a - b);
        } else {
          this.townHallLevels = [];
        }
      }
    },
    searchQuery(newQuery) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.filteredMembers;
      }, 300);
    }
  }
};
</script>

<style scoped>
/* Vos styles ici */
</style>
