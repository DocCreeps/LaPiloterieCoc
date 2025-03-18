<template>
  <div class="container mx-auto py-8">
      <div class="bg-white p-8 rounded-lg shadow-md mt-2">
        <h2 class="text-3xl font-semibold text-center mb-10">Villages Principal</h2>

        <div class="flex justify-between items-center">
          <img
            v-if="member && getTownHallImage(member.townHallLevel)"
            :src="getTownHallImage(member.townHallLevel)"
            :title="'HDV ' + member.townHallLevel"
            :alt="'HDV' + member.townHallLevel"
            class="w-30 h-30"
          />

            <div class="flex flex-wrap">
              <div v-for="hero in heroes" :key="hero.name" class="relative mx-2">
                <img v-if="getHeroIcon(hero.name)" :src="getHeroIcon(hero.name)" :alt="hero.name" class="h-15 w-15" />
                <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': hero.level === hero.maxLevel }, { 'bg-black': hero.level !== hero.maxLevel }]">
                  {{ hero.level }}
                </div>
              </div>
            </div>


        </div>



        <div class="mt-2 flex justify-between">
          <div>
            <h3 class="text-xl font-semibold mt-4">Troupes</h3>
            <div class="mt-2 flex flex-wrap">
              <div v-for="troop in regularTroops" :key="troop.name" class="relative mr-2 mb-2">
                <img v-if="getTroopsIcon(troop.name)" :src="getTroopsIcon(troop.name)" :alt="troop.name" class="h-15 w-15" />
                <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troop.level === troop.maxLevel }, { 'bg-black': troop.level !== troop.maxLevel }]">
                  {{ troop.level }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mt-4">Sorts</h3>
            <div class="mt-2 flex flex-wrap">
              <div v-for="spell in spells" :key="spell.name" class="relative mr-2 mb-2">
                <img v-if="getSpellIcon(spell.name)" :src="getSpellIcon(spell.name)" :alt="spell.name" class="h-15 w-15" />
                <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': spell.level === spell.maxLevel }, { 'bg-black': spell.level !== spell.maxLevel }]">
                  {{ spell.level }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 flex justify-between">
          <div>
        <h3 class="text-xl font-semibold mt-4">Machines de siège</h3>
        <div class="mt-2 flex flex-wrap">
          <div v-for="siege in siegeMachines" :key="siege.name" class="relative mr-2 mb-2">
            <img v-if="getSiegeIcon(siege.name)" :src="getSiegeIcon(siege.name)" :alt="siege.name"  class="h-15 w-15 "/>
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': siege.level === siege.maxLevel }, { 'bg-black': siege.level !== siege.maxLevel }]">
              {{ siege.level }}
            </div>
          </div>
        </div>
          </div>
          <div>
            <h3 class="text-xl font-semibold mt-4">Familier</h3>
        <div class="flex flex-wrap mt-2">
          <div v-for="pet in heroPets" :key="pet.name" class="relative mx-2">
            <img v-if="getPetIcon(pet.name)" :src="getPetIcon(pet.name)" :alt="pet.name" class="h-15 w-15" />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': pet.level === pet.maxLevel }, { 'bg-black': pet.level !== pet.maxLevel }]">
              {{ pet.level }}
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>


      <div class="bg-white p-8 rounded-lg shadow-md mt-5">
        <h2 class="text-3xl font-semibold text-center mb-10">MDO</h2>
        <img
          v-if="member && getBuilderHallImage(member.builderHallLevel)"
          :src="getBuilderHallImage(member.builderHallLevel)"
          :title="'MDO ' + member.builderHallLevel"
          :alt="'MDO' + member.builderHallLevel"
          class="w-30 h-30 mx-auto"
        />

        <div class="mt-2 flex flex-row mt-5">
          <div v-for="hero in builderBaseHeroes" :key="hero.name" class="relative mr-2">
            <img v-if="getHeroIcon(hero.name)" :src="getHeroIcon(hero.name)" :alt="hero.name" class="h-15 w-15 mx-5" />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': hero.level === hero.maxLevel }, { 'bg-black': hero.level !== hero.maxLevel }]" >{{ hero.level }}</div>
          </div>
        </div>

        <h3 class="text-xl font-semibold mt-4">Troupes MDO</h3>
        <div class="flex flex-row flex-wrap mt-5">
          <div v-for="troops in builderBaseTroops" :key="troops.name" class="relative mx-2 mb-2">
            <img v-if="getMDOTroopsIcon(troops.name)" :src="getMDOTroopsIcon(troops.name)" :alt="troops.name" class="h-15 w-15 mx-2" />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troops.level === troops.maxLevel }, { 'bg-black': troops.level !== troops.maxLevel }]" >{{ troops.level }}</div>
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
    getSiegeIcon(siegeName) {
      const siegeIcons = `Siege/${siegeName}`;
      return this.icons[siegeIcons];
    },
    getMDOTroopsIcon(troopName) {
      const troopsIcons = `MDO/${troopName}`;
      return this.icons[troopsIcons];
    },
    isSuperTroop(troopName) {
      const superTroopNames = ["Super Barbarian", "Super Archer", "Super Giant", "Super Wall Breaker", "Sneaky Goblin", "Super Witch", "Super Minion",
      "Super Valkyrie", "Super Dragon", "Super Bowler", "Super Wizard", "Super Pekka", "Super Miner", "Super Hog Rider", "Rocket Balloon", "Inferno Dragon", "Ice Hound"];
      return superTroopNames.includes(troopName);
    },
    isSiege(troopName) {
      const siegeNames = ["Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks", "Troop Launcher", "Battle Drill", "Log Launcher", "Flame Flinger"];
      return siegeNames.includes(troopName);
      },
    isHeroPet(troopName) {
      const heroPetNames = ["L.A.S.S.I", "Electro Owl", "Mighty Yak", "Unicorn", "Phoenix", "Poison Lizard", "Diggy", "Frosty", "Spirit Fox", "Angry Jelly"];
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
