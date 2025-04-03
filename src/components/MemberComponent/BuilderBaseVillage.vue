<template>
  <div class="flex justify-center flex-col items-center md:flex-row">
    <div class="flex items-center mb-4 md:mb-0">
      <img :src="builderHallImage" :alt="`Maison des ouvriers niveau ${member.builderHallLevel}`" class="w-20 h-20 md:w-30 md:h-30 mr-2 md:mr-4 mx-auto" />

      <div class="flex-grow flex flex-col items-center">
        <div class="flex flex-wrap justify-center mt-3 md:mt-5">
          <div v-for="hero in builderBaseHeroes" :key="hero.name" class="relative mx-1 mb-2 md:mx-2 md:mb-4">
            <img :src="getHeroIcon(hero.name)" :alt="hero.name" :title="`${hero.name} (${hero.level}/${hero.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 mx-1" />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': hero.level === hero.maxLevel }, { 'bg-black': hero.level !== hero.maxLevel }]">
              {{ hero.level }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <h3 class="text-xl md:text-2xl mb-3 font-bold text-center mt-4">Troupes MDO</h3>
  <div class="flex flex-wrap justify-center mt-3 md:mt-5">
    <div v-for="troops in builderBaseTroops" :key="troops.name" class="relative mx-1 mb-2 md:mx-2 md:mb-2">
      <img :src="getMDOTroopsIcon(troops.name)" :alt="troops.name" :title="`${troops.name} (${troops.level}/${troops.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 mx-1" />
      <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troops.level === troops.maxLevel }, { 'bg-black': troops.level !== troops.maxLevel }]">
        {{ troops.level }}
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
    builderHallImage() {
      const level = this.member.builderHallLevel;
      if (level >= 1 && level <= 10) {
        return this.icons[`HDV/MDO_${level}`];
      }
      return null;
    },
    builderBaseHeroes() {
      return this.member.heroes.filter((hero) => hero.village === "builderBase");
    },
    builderBaseTroops() {
      return this.member.troops.filter((troop) => troop.village === "builderBase");
    },
  },
  methods: {
    getHeroIcon(heroName) {
      const heroesIcons = `Hero/${heroName}`;
      return this.icons[heroesIcons];
    },
    getMDOTroopsIcon(troopName) {
      const troopsIcons = `MDO/${troopName}`;
      return this.icons[troopsIcons];
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
