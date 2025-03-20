<template >
  <div class="container mx-auto  px-4">
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md mt-2 mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">Villages Principal</h2>

      <div class="flex flex-col md:flex-row items-center">
        <div class="mb-4 md:mr-4">
          <img
            v-if="member && getTownHallImage(member.townHallLevel)"
            :src="getTownHallImage(member.townHallLevel)"
            :title="'HDV ' + member.townHallLevel"
            :alt="'HDV' + member.townHallLevel"
            class="w-24 h-24 md:w-40 md:h-40 mb-2 md:mb-4 mx-auto"
          />
        </div>

        <div class="flex-grow flex flex-col items-center">
          <h3 class="text-2xl mb-3 font-bold text-center mt-4">Héros</h3>
          <div class="flex flex-wrap justify-center">
            <div v-for="hero in heroes" :key="hero.name" class="relative mx-1 mb-2 md:mx-4 md:mb-4 cursor-pointer" @click="openEquipmentModal(hero.name)">
              <img v-if="getHeroIcon(hero.name)" :src="getHeroIcon(hero.name)" :alt="hero.name" :title="`${hero.name} (${hero.level}/${hero.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
              <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': hero.level === hero.maxLevel }, { 'bg-black': hero.level !== hero.maxLevel }]">
                {{ hero.level }}
              </div>
            </div>
          </div>

          <div v-if="heroPets && heroPets.length > 0">
            <h3 class="text-2xl mb-3 font-bold text-center mt-4">Familiers</h3>
            <div class="flex flex-wrap justify-center mt-2">
              <div v-for="pet in heroPets" :key="pet.name" class="relative mx-1 mb-2 md:mx-4 md:mb-4 ">
                <img v-if="getPetIcon(pet.name)" :src="getPetIcon(pet.name)" :alt="pet.name" :title="`${pet.name} (${pet.level}/${pet.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
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
          <h3 class="text-2xl mb-3 font-bold text-center mt-4">Troupes</h3>
          <div class="mt-2 flex flex-wrap justify-center">
            <div v-for="troop in regularTroops" :key="troop.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
              <img v-if="getTroopsIcon(troop.name)" :src="getTroopsIcon(troop.name)" :alt="troop.name" :title="`${troop.name} (${troop.level}/${troop.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
              <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troop.level === troop.maxLevel }, { 'bg-black': troop.level !== troop.maxLevel }]">
                {{ troop.level }}
              </div>
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/2 md:mr-4">
          <h3 class="text-2xl mb-3 font-bold text-center mt-4">Sorts</h3>
          <div class="mt-2 flex flex-wrap justify-center">
            <div v-for="spell in spells" :key="spell.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
              <img v-if="getSpellIcon(spell.name)" :src="getSpellIcon(spell.name)" :alt="spell.name" :title="`${spell.name} (${spell.level}/${spell.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
              <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': spell.level === spell.maxLevel }, { 'bg-black': spell.level !== spell.maxLevel }]">
                {{ spell.level }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4" v-if="siegeMachines && siegeMachines.length > 0">
        <h3 class="text-2xl mb-3 font-bold text-center mt-4">Machines de siège</h3>
        <div class="mt-2 flex flex-wrap justify-center">
          <div v-for="siege in siegeMachines" :key="siege.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
            <img v-if="getSiegeIcon(siege.name)" :src="getSiegeIcon(siege.name)" :alt="siege.name" :title="`${siege.name} (${siege.level}/${siege.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': siege.level === siege.maxLevel }, { 'bg-black': siege.level !== siege.maxLevel }]">
              {{ siege.level }}
            </div>
          </div>
        </div>
      </div>


    </div>

    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md mt-2 mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">MDO</h2>
      <div class="flex justify-center flex-col items-center md:flex-row">
        <div class="flex items-center mb-4 md:mb-0">
          <img
            v-if="member && getBuilderHallImage(member.builderHallLevel)"
            :src="getBuilderHallImage(member.builderHallLevel)"
            :title="'MDO ' + member.builderHallLevel"
            :alt="'MDO' + member.builderHallLevel"
            class="w-20 h-20 md:w-30 md:h-30 mr-2 md:mr-4 mx-auto"
          />

          <div class="flex-grow flex flex-col items-center">
            <div class="flex flex-wrap justify-center mt-3 md:mt-5">
              <div v-for="hero in builderBaseHeroes" :key="hero.name" class="relative mx-1 mb-2 md:mx-2 md:mb-4">
                <img v-if="getHeroIcon(hero.name)" :src="getHeroIcon(hero.name)" :alt="hero.name" :title="`hero.name\} (${hero.level}/${hero.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 mx-1" />
                <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': hero.level === hero.maxLevel }, { 'bg-black': hero.level !== hero.maxLevel }]">
                  {{ hero.level }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 class="text-2xl mb-3 font-bold text-center mt-4">Troupes MDO</h3>
      <div class="flex flex-wrap justify-center mt-3 md:mt-5">
        <div v-for="troops in builderBaseTroops" :key="troops.name" class="relative mx-1 mb-2 md:mx-2 md:mb-2">
          <img v-if="getMDOTroopsIcon(troops.name)" :src="getMDOTroopsIcon(troops.name)" :alt="troops.name" :title="`${troops.name} (${troops.level}/${troops.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 mx-1" />
          <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troops.level === troops.maxLevel }, { 'bg-black': troops.level !== troops.maxLevel }]">
            {{ troops.level }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center">
    <div class="fixed inset-0 bg-opacity-500" @click="closeEquipmentModal"></div>
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative z-10">
      <button @click="closeEquipmentModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <img v-if="getHeroIcon(selectedHeroName)" :src="getHeroIcon(selectedHeroName)" :alt="selectedHeroName" :title="selectedHeroName" class="h-12 w-12 md:h-25 md:w-25 mx-auto" />
      <div v-if="selectedHeroEquipment.length > 0" class="flex flex-wrap justify-center mt-10">
        <div v-for="gear in selectedHeroEquipment" :key="gear.name" class="relative mx-1 mb-2 md:mx-2 md:mb-2">
          <img v-if="getEquipmentIcon(gear.name)" :src="getEquipmentIcon(gear.name)" :alt="gear.name" :title="`${gear.name} (${gear.level}/${gear.maxLevel})`" class="h-12 w-12 md:h-20 md:w-20 mx-5" />
          <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': gear.level === gear.maxLevel }, { 'bg-black': gear.level !== gear.maxLevel }]">
            {{ gear.level }}
          </div>
        </div>
      </div>
      <p v-else>Ce héros n'a pas d'équipements.</p>
    </div>
  </div>
</template>



<script>
export default {
  props: {
    member: Object,
    icons: Object,
  },
  data () {
    return {
      isModalOpen: false,
      selectedHeroEquipment: [],
      selectedHeroName: '',
    };
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
    getEquipmentIcon(equipmentName) {
      const equipmentIcons = `Equipment/${equipmentName}`;
      return this.icons[equipmentIcons];
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
    openEquipmentModal(heroName) {
      this.selectedHeroEquipment = this.heroEquipment.filter(gear => this.heroGear(heroName, gear.name));
      if (this.selectedHeroEquipment.length > 0) {
        this.isModalOpen = true;
        this.selectedHeroName = heroName; // Stocker le nom du héros
      }
    },
    closeEquipmentModal() {
      this.isModalOpen = false;
      this.selectedHeroEquipment = [];
    },
    heroGear(heroName, gearName) {
        const heroEquipmentMap = {
          "Barbarian King": [
            "Giant Gauntlet", "Spiky Ball", "Snake Bracelet", "Barbarian Puppet", "Rage Vial", "Earthquake Boots", "Vampstache"
          ],
          "Archer Queen": [
            "Frozen Arrow", "Magic Mirror", "Archer Puppet", "Invisibility Vial", "Giant Arrow", "Healer Puppet"
          ],
          "Grand Warden": [
            "Lavaloon Puppet", "Fireball", "Eternal Tome", "Life Gem", "Rage Gem", "Healing Tome"
          ],
          "Royal Champion": [
            "Rocket Spear", "Electro Boots", "Seeking Shield", "Royal Gem", "Hog Rider Puppet", "Haste Vial"
          ],
          "Minion Prince": [
            "Dark Orb", "Metal Pants", "Henchmen Puppet"
          ],
        };

        if (heroEquipmentMap[heroName]) {
          return heroEquipmentMap[heroName].includes(gearName);
        }
        return false;
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
    heroEquipment(){
      return this.member.heroEquipment.filter((gear) => gear.village === "home");
    }
  },
};
</script>

<style>

</style>
