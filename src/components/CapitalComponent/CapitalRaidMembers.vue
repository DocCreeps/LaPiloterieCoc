<template>
  <div v-if="selectedRaid" class="flex justify-center mt-6">
    <div v-if="loadingMembers" class="text-center">Chargement des membres...</div>
    <div v-else class="w-10/12 sm:w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
      <div>
        <h2 class="text-xl font-bold mb-6 text-center">Membres avec Attaques</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="member in activeMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <p class="text-lg font-semibold truncate">{{ member.name }}</p>
            <div class="flex flex-col sm:flex-row justify-between mt-2">
              <p class="text-sm flex items-center justify-center sm:justify-start mb-2 sm:mb-0">
                <img :src="icons['icon/capital_atk']" alt="attaques" class="h-8 w-8 inline-block mr-1" />
                {{ member.attacks }}/6
              </p>
              <p class="text-lg flex items-center justify-center sm:justify-end">
                <img :src="icons['icon/Joyaux']" alt="butin" class="h-8 w-8 inline-block mr-1" />
                {{ member.capitalResourcesLooted }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 py-8">
        <h2 class="text-xl font-bold mb-6 text-center">Membres sans Attaques</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="member in zeroAttackMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <p class="text-lg font-semibold truncate">{{ member.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <p v-else class="text-center py-16 mt-24">Aucun raid sélectionné.</p>
</template>

<script>
export default {
  props: {
    selectedRaid: Object,
    icons: Object,
    clanMembers: Array,
    loadingMembers: Boolean,
  },
  computed: {
    enrichedMembers() {
      if (!this.selectedRaid || !this.clanMembers) {
        return [];
      }
      const mergedMembers = this.clanMembers.map((clanMember) => {
        const raidMember = this.selectedRaid.members?.find((member) => member.tag === clanMember.tag);
        return raidMember || {
          tag: clanMember.tag,
          name: clanMember.name,
          attacks: 0,
          attackLimit: 0,
          bonusAttackLimit: 0,
          capitalResourcesLooted: 0,
        };
      });
      return mergedMembers.sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted);
    },
    activeMembers() {
      return this.enrichedMembers.filter((member) => member.attacks > 0);
    },
    zeroAttackMembers() {
      return this.enrichedMembers.filter((member) => member.attacks === 0);
    },
  },
};
</script>
