<template>
  <div class="container mx-auto py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <img
          v-if="member && getTownHallImage(member.townHallLevel)"
          :src="getTownHallImage(member.townHallLevel)"
          :title="'HDV ' + member.townHallLevel"
          :alt="'HDV' + member.townHallLevel"
          class="w-30 h-30 mx-auto mt-2"
        />

        <div class="mt-2 flex flex-row">
          <div v-for="hero in heroes" :key="hero.name" class="relative mr-2">
            <img v-if="getHeroIcon(hero.name)" :src="getHeroIcon(hero.name)" :alt="hero.name" class="h-15 w-15 mx-5" />
            <div
              :class="[
                'absolute',
                'bottom-0',
                'right-0',
                'text-white',
                'text-sm',
                'px-1',
                'rounded-sm',
                { 'bg-blue-500': hero.level === hero.maxLevel },
                { 'bg-black': hero.level !== hero.maxLevel },
              ]"
            >
              {{ hero.level }}
            </div>
          </div>
        </div>
        <h3 class="text-xl font-semibold mt-4">Troupes</h3>
        <div class="mt-2">
          <div v-for="troop in regularTroops" :key="troop.name" class="flex items-center mb-2">
            <span>{{ troop.name }} (Niveau {{ troop.level }})</span>
          </div>
        </div>
        <h3 class="text-xl font-semibold mt-4">Sorts</h3>
        <div class="mt-2">
          <div v-for="spell in spells" :key="spell.name" class="flex items-center mb-2">
            <span>{{ spell.name }} (Niveau {{ spell.level }})</span>
          </div>
        </div>

        <h3 class="text-xl font-semibold mt-4">Machines de siège</h3>
        <div class="mt-2">
          <div v-for="siege in siegeMachines" :key="siege.name" class="flex items-center mb-2">
            <span>{{ siege.name }} (Niveau {{ siege.level }})</span>
          </div>
        </div>
        <h3 class="text-xl font-semibold mt-4">Familiers</h3>
        <div class="mt-2">
          <div v-for="pet in heroPets" :key="pet.name" class="flex items-center mb-2">
            <span>{{ pet.name }} (Niveau {{ pet.level }})</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <img
          v-if="member && getBuilderHallImage(member.builderHallLevel)"
          :src="getBuilderHallImage(member.builderHallLevel)"
          :title="'MDO ' + member.builderHallLevel"
          :alt="'MDO' + member.builderHallLevel"
          class="w-30 h-30 mx-auto"
        />

        <div class="mt-2 flex flex-row ">
          <div v-for="hero in builderBaseHeroes" :key="hero.name" class="relative mr-2">
            <img v-if="getHeroIcon(hero.name)" :src="getHeroIcon(hero.name)" :alt="hero.name" class="h-15 w-15 mx-5" />
            <div
              :class="[
                'absolute',
                'bottom-0',
                'right-0',
                'text-white',
                'text-sm',
                'px-1',
                'rounded-sm',
                { 'bg-yellow-300 text-zinc-950': hero.level === hero.maxLevel },
                { 'bg-black': hero.level !== hero.maxLevel },
              ]"
            >
              {{ hero.level }}
            </div>
          </div>
        </div>

        <h3 class="text-xl font-semibold mt-4">Troupes MDO</h3>
        <div class="mt-2">
          <div v-for="troop in builderBaseTroops" :key="troop.name" class="flex items-center mb-2">
            <span>{{ troop.name }} (Niveau {{ troop.level }})</span>
          </div>
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
  methods: {
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
    getHeroIcon(heroName) {
      const heroesIcons = `Hero/${heroName}`;
      return this.icons[heroesIcons];
    },
    isSuperTroop(troopName) {
      const superTroopNames = [
        "Super Barbarian",
        "Super Archer",
        "Super Giant",
        "Super Wall Breaker",
        "Sneaky Goblin",
        "Super Witch",
        "Super Minion",
        "Super Valkyrie",
        "Super Dragon",
        "Super Bowler",
        "Super Wizard",
        "Super Pekka",
        "Super Miner",
        "Super Hog Rider",
        "Rocket Balloon",
        "Inferno Dragon",
        "Ice Hound",
      ];
      return superTroopNames.includes(troopName);
    },
    isSiege(troopName) {
      const siegeNames = [
        "Wall Wrecker",
        "Battle Blimp",
        "Stone Slammer",
        "Siege Barracks",
        "Troop Launcher",
        "Battle Drill",
        "Log Launcher",
        "Flame Flinger",
      ];
      return siegeNames.includes(troopName);
    },
    isHeroPet(troopName) {
      const heroPetNames = [
        "L.A.S.S.I",
        "Electro Owl",
        "Mighty Yak",
        "Unicorn",
        "Phoenix",
        "Poison Lizard",
        "Diggy",
        "Frosty",
        "Spirit Fox",
        "Angry Jelly",
      ];
      return heroPetNames.includes(troopName);
    },
  },
  computed: {
    heroes() {
      return this.member.heroes.filter((hero) => hero.village === "home");
    },
    regularTroops() {
      return this.member.troops.filter(
        (troop) => troop.village === "home" && !this.isSuperTroop(troop.name) && !this.isHeroPet(troop.name) && !this.isSiege(troop.name)
      );
    },
    superTroops() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isSuperTroop(troop.name));
    },
    heroPets() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isHeroPet(troop.name));
    },
    spells() {
      return this.member.spells.filter((spell) => spell.village === "home");
    },
    builderBaseHeroes() {
      return this.member.heroes.filter((hero) => hero.village === "builderBase");
    },
    builderBaseTroops() {
      return this.member.troops.filter((troop) => troop.village === "builderBase");
    },
    siegeMachines() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isSiege(troop.name));
    },
  },
};
</script>
