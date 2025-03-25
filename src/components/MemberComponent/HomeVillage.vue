<template>
  <div class="flex flex-col md:flex-row items-center">
    <div class="mb-4 md:mr-4">
      <img :src="townHallImage" :alt="`Hôtel de ville niveau ${member.townHallLevel}`" class="w-24 h-24 md:w-40 md:h-40 mb-2 md:mb-4 mx-auto" />
    </div>

    <div class="flex-grow flex flex-col items-center">
      <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-4">Héros</h3>
      <div class="flex flex-wrap justify-center">
        <div v-for="hero in heroes" :key="hero.name" class="relative mx-1 mb-2 md:mx-4 md:mb-4 cursor-pointer" @click="$emit('openEquipmentModal', hero.name)">
          <img :src="getHeroIcon(hero.name)" :alt="hero.name" :title="`${hero.name} (${hero.level}/${hero.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
          <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': hero.level === hero.maxLevel }, { 'bg-black': hero.level !== hero.maxLevel }]">
            {{ hero.level }}
          </div>
        </div>
      </div>

      <div v-if="heroPets && heroPets.length > 0">
        <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-4">Familiers</h3>
        <div class="flex flex-wrap justify-center mt-2">
          <div v-for="pet in heroPets" :key="pet.name" class="relative mx-1 mb-2 md:mx-4 md:mb-4 ">
            <img :src="getPetIcon(pet.name)" :alt="pet.name" :title="`${pet.name} (${pet.level}/${pet.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': pet.level === pet.maxLevel }, { 'bg-black': pet.level !== pet.maxLevel }]">
              {{ pet.level }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4 flex flex-col md:flex-row">
    <div class="w-full md:w-1/2">
      <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-4">Troupes</h3>
      <div class="mt-2 flex flex-wrap justify-center">
        <div v-for="troop in regularTroops" :key="troop.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
          <img :src="getTroopsIcon(troop.name)" :alt="troop.name" :title="`${troop.name} (${troop.level}/${troop.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
          <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troop.level === troop.maxLevel }, { 'bg-black': troop.level !== troop.maxLevel }]">
            {{ troop.level }}
          </div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-1/2 md:mr-4">
      <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-4">Sorts</h3>
      <div class="mt-2 flex flex-wrap justify-center">
        <div v-for="spell in spells" :key="spell.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
          <img :src="getSpellIcon(spell.name)" :alt="spell.name" :title="`${spell.name} (${spell.level}/${spell.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
          <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': spell.level === spell.maxLevel }, { 'bg-black': spell.level !== spell.maxLevel }]">
            {{ spell.level }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4" v-if="siegeMachines && siegeMachines.length > 0">
    <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-4">Machines de siège</h3>
    <div class="mt-2 flex flex-wrap justify-center">
      <div v-for="siege in siegeMachines" :key="siege.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
        <img :src="getSiegeIcon(siege.name)" :alt="siege.name" :title="`${siege.name} (${siege.level}/${siege.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
        <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': siege.level === siege.maxLevel }, { 'bg-black': siege.level !== siege.maxLevel }]">
          {{ siege.level }}
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
  emits: ['openEquipmentModal'],
  computed: {
    townHallImage() {
      const level = this.member.townHallLevel;
      if (level >= 1 && level <= 17) {
        return this.icons[`HDV/th_${level}`];
      }
      return null;
    },
    heroes() {
      return this.member.heroes.filter((hero) => hero.village === "home");
    },
    regularTroops() {
      return this.member.troops.filter(
        (troop) => troop.village === "home" && !this.isSuperTroop(troop.name) && !this.isHeroPet(troop.name) && !this.isSiege(troop.name)
      );
    },
    heroPets() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isHeroPet(troop.name));
    },
    spells() {
      return this.member.spells.filter((spell) => spell.village === "home");
    },
    siegeMachines() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isSiege(troop.name));
    },
  },
  methods: {
    getHeroIcon(heroName) {
      const heroesIcons = `Hero/${heroName}`;
      return this.icons[heroesIcons];
    },
    getPetIcon(petName) {
      const petIcons = `Pets/${petName}`;
      return this.icons[petIcons];
    },
    getTroopsIcon(troopName) {
      const troopsIcons = `Troops/${troopName}`;
      return this.icons[troopsIcons];
    },
    getSpellIcon(spellName) {
      const spellIcons = `Spell/${spellName}`;
      return this.icons[spellIcons];
    },
    getSiegeIcon(siegeName){
      const siegeIcons = `Siege/${siegeName}`;
      return this.icons[siegeIcons];
    },
    isSuperTroop(troopName) {
      const superTroopNames = ["Super Barbarian", "Super Archer", "Super Giant", "Super Wall Breaker", "Sneaky Goblin", "Super Witch", "Super Minion",
        "Super Valkyrie", "Super Dragon", "Super Bowler", "Super Wizard", "Super Pekka", "Super Miner", "Super Hog Rider", "Rocket Balloon", "Inferno Dragon", "Ice Hound", "Super Yeti"];
      return superTroopNames.includes(troopName);
    },
    isSiege(troopName) {
      const siegeNames = ["Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks", "Troop Launcher", "Battle Drill", "Log Launcher", "Flame Flinger"];
      return siegeNames.includes(troopName);
    },
    isHeroPet(troopName) {
      const heroPetNames = ["L.A.S.S.I", "Electro Owl", "Mighty Yak", "Unicorn", "Phoenix", "Poison Lizard", "Diggy", "Frosty", "Spirit Fox", "Angry Jelly","Sneezy"];
      return heroPetNames.includes(troopName);
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
