<template>
  <div class="text-center cursor-pointer" @click="goToClanDetails">
    <img :src="member?.clan?.badgeUrls?.medium" :alt="`Badge du clan ${member?.clan?.name}`" class="mx-auto mt-2" />
    <p class="text-lg font-bold">{{ member?.clan?.name }}</p>
    <p class="text-2xl semibold">{{ translatedRole }}</p>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
  },
  computed: {
    translatedRole() {
      const roles = {
        leader: 'Chef',
        coLeader: 'Adjoint',
        admin: 'Aîné',
        member: 'Membre',
      };
      return roles[this.member?.role] || this.member?.role;
    },
  },
  methods: {
    goToClanDetails() {
      this.$emit('clanClicked', this.member?.clan?.tag);
    },
  },
};
</script>
