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
