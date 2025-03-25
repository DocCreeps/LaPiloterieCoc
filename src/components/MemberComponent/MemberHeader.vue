<template>
  <div class="container px-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full">
      <div class="text-center mb-4">
        <h1 class="text-3xl font-bold">{{ member?.name || 'Nom inconnu' }}</h1>
        <h2 class="text-xl text-gray-600">{{ member?.tag || 'Tag inconnu' }}</h2>
        <hr class="my-4" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <MemberLeague :member="member" :unrankedLeagueIcon="unrankedLeagueIcon" />
        <MemberDetails :member="member" :icons="icons" />
        <MemberClan :member="member" :icons="icons" @clanClicked="getClanDetails" />
      </div>
    </div>
  </div>
</template>

<script>
import MemberLeague from './MemberLeague.vue';
import MemberDetails from './MemberDetails.vue';
import MemberClan from './MemberClan.vue';

export default {
  components: {
    MemberLeague,
    MemberDetails,
    MemberClan,
  },
  props: {
    member: Object,
    unrankedLeagueIcon: String,
    icons: Object,
  },
  methods: {
    getClanDetails(clanTag) {
      this.$emit('clanClicked', clanTag);
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
