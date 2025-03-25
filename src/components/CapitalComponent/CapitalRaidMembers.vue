<template>
  <div v-if="selectedRaid" class="flex justify-center py-16 mt-24">
    <div v-if="loadingMembers" class="text-center">Chargement des membres...</div>
    <div v-else class="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md flex space-x-8">
      <div class="w-1/2">
        <h2 class="text-xl font-bold mb-4 text-center">Membres avec Attaques</h2>
        <div class="space-y-4">
          <div v-for="member in activeMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg text-center">
            <p class="text-lg font-bold">{{ member.name }}</p>
            <div class="flex flex-row justify-between">
              <p class="text-sm">
                <img :src="icons['icon/capital_atk']" alt="attaques" class="h-10 w-10 inline-block" />
                {{ member.attacks }}/6
              </p>
              <p class="text-lg">
                <img :src="icons['icon/Joyaux']" alt="butin" class="h-10 w-10 inline-block" />
                {{ member.capitalResourcesLooted }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-1/2">
        <h2 class="text-xl font-bold mb-4 text-center">Membres sans Attaques</h2>
        <div class="space-y-4">
          <div v-for="member in zeroAttackMembers" :key="member.tag" class="bg-gray-100 p-4 rounded-lg text-center">
            <p class="text-lg font-bold">{{ member.name }}</p>
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
