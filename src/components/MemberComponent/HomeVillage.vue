<template>
  <div class="flex flex-col lg:flex-row items-center">
    <div class="mb-4 md:mr-4 w-1/2">
      <img :src="townHallImage" :alt="`Hôtel de ville niveau ${member.townHallLevel}`" class="w-24 h-24 md:w-50 md:h-50 mb-2 md:mb-4 mx-auto" />
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

        <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-5">Troupes</h3>
        <div class="mt-2 flex flex-wrap justify-center">
          <div v-for="troop in regularTroops" :key="troop.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
            <img :src="getTroopsIcon(troop.name)" :alt="troop.name" :title="`${troop.name} (${troop.level}/${troop.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troop.level === troop.maxLevel }, { 'bg-black': troop.level !== troop.maxLevel }]">
              {{ troop.level }}
            </div>
          </div>
        </div>
        <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-10">Troupes Noire</h3>
        <div class="mt-2 flex flex-wrap justify-center">
          <div v-for="troop in darkTroops" :key="troop.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
            <img :src="getTroopsIcon(troop.name)" :alt="troop.name" :title="`${troop.name} (${troop.level}/${troop.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': troop.level === troop.maxLevel }, { 'bg-black': troop.level !== troop.maxLevel }]">
              {{ troop.level }}
            </div>
          </div>
        </div>

    </div>

    <div class="w-full md:w-1/2 md:mr-4">
      <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-5">Sorts</h3>
      <div class="mt-2 flex flex-wrap justify-center">
        <div v-for="spell in spells" :key="spell.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
          <img :src="getSpellIcon(spell.name)" :alt="spell.name" :title="`${spell.name} (${spell.level}/${spell.maxLevel})`" class="h-12 w-12 md:h-15 md:w-15 " />
          <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': spell.level === spell.maxLevel }, { 'bg-black': spell.level !== spell.maxLevel }]">
            {{ spell.level }}
          </div>
        </div>
      </div>

      <div class="mt-4" v-if="siegeMachines && siegeMachines.length > 0">
        <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-10">Machines de siège</h3>
        <div class="mt-2 flex flex-wrap justify-center">
          <div v-for="siege in siegeMachines" :key="siege.name" class="relative h-12 w-12 md:h-15 md:w-15 mx-2 mb-2 md:mx-4 md:mb-2">
            <img :src="getSiegeIcon(siege.name)" :alt="siege.name" :title="`${siege.name} (${siege.level}/${siege.maxLevel})`" class="w-full h-full " />
            <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': siege.level === siege.maxLevel }, { 'bg-black': siege.level !== siege.maxLevel }]">
              {{ siege.level }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>



  <div v-if="heroEquipment && heroEquipment.length > 0">
    <h3 class="sm:text-2xl text-lg mb-3 font-bold text-center mt-8">Équipements</h3>
    <div class="flex flex-wrap justify-center mt-2">
      <div v-for="(equipments, heroName) in equipmentsByHero" :key="heroName" class="mb-2 w-full md:w-1/2 p-4 flex flex-col items-center">
          <img :src="getHeroIcon(heroName)" :alt="heroName" :title="heroName" class="flex justify-center mb-2 h-12 w-12 md:h-15 md:w-15 " />
        <div class="flex flex-wrap justify-center">
          <div v-for="equipment in equipments" :key="equipment.name" class="relative mx-2 mb-2 md:mx-4 md:mb-2">
            <div :class="['relative', 'rounded-sm','h-12','w-12', 'md:w-15', 'md:h-15', { 'bg-[#B833FD]': isEpiqueEquipment(equipment.name) }]">
              <img :src="getHeroEquipmentIcon(equipment.name)" :alt="equipment.name" :title="`${equipment.name} (Niveau ${equipment.level})`" class="w-full h-full " />
              <div :class="['absolute', 'bottom-0', 'right-0', 'text-white', 'text-xs md:text-sm', 'px-1', 'rounded-sm', { 'bg-yellow-300 text-zinc-950': equipment.level === equipment.maxLevel }, { 'bg-black': equipment.level !== equipment.maxLevel }]">
                {{ equipment.level }}
              </div>
            </div>
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
    darkTroops() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isDarkTroop(troop.name));
    },
    regularTroops() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isTroop(troop.name));
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
    heroEquipment() {
      return this.member.heroEquipment.filter((equipment) => equipment.village === "home");
    },
    siegeMachines() {
      return this.member.troops.filter((troop) => troop.village === "home" && this.isSiege(troop.name));
    },
    equipmentsByHero() {
      const equipmentsByHero = {};
      const allPossibleHeroes = Object.keys({
        "Barbarian King": [],
        "Archer Queen": [],
        "Grand Warden": [],
        "Royal Champion": [],
        "Minion Prince": [],
      });

      for (const heroName of allPossibleHeroes) {
        const orderedGearNames = this.heroGear(heroName);
        if (orderedGearNames && orderedGearNames.length > 0) {
          const orderedEquipments = [];
          for (const gearName of orderedGearNames) {
            const foundEquipment = this.heroEquipment.find(eq => eq.name === gearName);
            if (foundEquipment) {
              orderedEquipments.push(foundEquipment);
            }
          }
          if (orderedEquipments.length > 0) {
            equipmentsByHero[heroName] = orderedEquipments;
          }
        }
      }
      return equipmentsByHero;
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
    getHeroEquipmentIcon(equipmentName) {
      const equipmentIcons = `Equipment/${equipmentName}`;
      return this.icons[equipmentIcons];
    },
    isDarkTroop(troopName) {
      const darkTroopNames = ["Minion","Hog Rider", "Valkyrie", "Golem", "Witch", "Lava Hound", "Bowler", "Ice Golem",  "Headhunter", "Apprentice Warden", "Druid", "Furnace" ]
      return darkTroopNames.includes(troopName);
    },
    isTroop(troopName) {
      const lightTroopNames = ["Barbarian", "Archer", "Giant", "Goblin", "Wall Breaker", "Balloon", "Wizard", "Healer", "Dragon", "Baby Dragon","Miner", "Electro Dragon", "Yeti", "Dragon Rider","Electro Titan", "Root Rider", "Thrower" ];
      return lightTroopNames.includes(troopName);
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
    isEpiqueEquipment(equipmentName) {
      const heroEquipmentNames = ["Electro Boots", "Giant Gauntlet", "Spiky Ball", "Snake Bracelet", "Magic Mirror", "Action Figure", "Frozen Arrow",  "Fireball", "Lavaloon Puppet", "Rocket Spear"];
      return heroEquipmentNames.includes(equipmentName);
    },

    heroGear(heroName) {
      const heroEquipmentMap = {
        "Barbarian King": [
          "Barbarian Puppet", "Rage Vial", "Earthquake Boots", "Vampstache", "Giant Gauntlet", "Spiky Ball", "Snake Bracelet"
        ],
        "Archer Queen": [
          "Archer Puppet", "Invisibility Vial", "Giant Arrow", "Healer Puppet", "Frozen Arrow", "Magic Mirror", "Action Figure"
        ],
        "Grand Warden": [
          "Eternal Tome", "Life Gem", "Healing Tome", "Rage Gem", "Fireball", "Lavaloon Puppet"
        ],
        "Royal Champion": [
          "Seeking Shield", "Royal Gem", "Hog Rider Puppet", "Haste Vial", "Rocket Spear", "Electro Boots"
        ],
        "Minion Prince": [
          "Dark Orb", "Metal Pants", "Henchmen Puppet", "Noble Iron"
        ],
      };

      if (heroEquipmentMap[heroName]) {
        return heroEquipmentMap[heroName];
      }
      return [];
    },
  },
};


</script>

<style scoped>
/* Vos styles ici */
</style>
