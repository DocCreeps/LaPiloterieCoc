<template>
  <div class="bg-white p-4 rounded-lg shadow-md cursor-pointer w-full flex flex-col">
    <div class="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between mb-4">
      <div class="flex items-center mb-2 sm:mb-0">
        <img :src="member.league?.iconUrls.small" :alt="`Ligue de ${member.name}`" class="w-12 h-12 mr-4" />
        <div>
          <h3 class="text-xl font-semibold">{{ member.name }}</h3>
          <p class="text-gray-600">{{ translatedRole }}</p>
        </div>
      </div>

      <div class="flex items-center mr-4 mt-4 sm:mt-2 sm:mr-2 mb-2 sm:mb-0">
        <img v-if="rankChange > 0" :src="icons['icon/up']" alt="Rang en hausse" class="h-7 w-7" />
        <img v-else-if="rankChange < 0" :src="icons['icon/down']" alt="Rang en baisse" class="h-7 w-7" />
        <img v-else :src="icons['icon/nomove']" alt="Rang inchangé" class="h-7 w-7" />
        <p class="ml-2">{{ rankChange }}</p>
      </div>

      <div class="flex items-center mt-4 sm:mt-2">
        <img :src="icons['icon/xp']" alt="Niveau d'expérience" class="h-7 w-7" />
        <p class="text-gray-600 ml-2">{{ member.expLevel }}</p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row justify-around items-center flex-grow">
      <div class="flex items-center mb-4 sm:mb-0">
        <img :src="townHallImage" :alt="`Hôtel de ville niveau ${member.townHallLevel}`" class="w-20 h-20 mr-4" />
        <div class="flex items-center">
          <img :src="icons['icon/Trophy']" alt="Trophées" class="h-10 w-10 mr-1" />
          <p class="text-gray-600 ml-1">{{ member.trophies }}</p>
        </div>
      </div>

      <div class="flex items-center mt-4 sm:mt-0">
        <img :src="builderHallImage" :alt="`Maison des ouvriers niveau ${member.builderHallLevel}`" class="w-20 h-20 sm:ml-8 mr-4" />
        <div class="flex items-center">
          <img :src="icons['icon/mdo_trophy']" alt="Trophées MDO" class="h-10 w-10 mr-1" />
          <p class="text-gray-600 ml-1">{{ member.builderBaseTrophies }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
    icons: Object,
  },
  computed: {
    translatedRole() {
      const roles = {
        leader: 'Chef',
        coLeader: 'Adjoint',
        admin: 'Aîné',
        member: 'Membre',
      };
      return roles[this.member.role] || this.member.role;
    },
    rankChange() {
      return this.member.previousClanRank - this.member.clanRank;
    },
    townHallImage() {
      const level = this.member.townHallLevel;
      if (level >= 1 && level <= 17) {
        return this.icons[`HDV/th_${level}`];
      }
      return null;
    },
    builderHallImage() {
      const level = this.member.builderHallLevel;
      if (level >= 1 && level <= 10) {
        return this.icons[`HDV/MDO_${level}`];
      }
      return null;
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
