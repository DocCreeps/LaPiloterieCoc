<template>
  <div class="container mx-auto px-4">
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md mt-2 mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">Villages Principal</h2>
      <HomeVillage :member="member" :icons="icons" @openEquipmentModal="openEquipmentModal" />
    </div>

    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md mt-2 mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">MDO</h2>
      <BuilderBaseVillage :member="member" :icons="icons" />
    </div>
  </div>

  <EquipmentModal :isModalOpen="isModalOpen" :selectedHeroName="selectedHeroName" :selectedHeroEquipment="selectedHeroEquipment" :icons="icons" @close="closeEquipmentModal" />
</template>

<script>
import HomeVillage from './MemberComponent/HomeVillage.vue';
import BuilderBaseVillage from './BuilderBaseVillage.vue';
import EquipmentModal from './MemberComponent/EquipmentModal.vue';

export default {
  components: {
    HomeVillage,
    BuilderBaseVillage,
    EquipmentModal,
  },
  props: {
    member: Object,
    icons: Object,
  },
  data() {
    return {
      isModalOpen: false,
      selectedHeroEquipment: [],
      selectedHeroName: '',
    };
  },
  methods: {
    openEquipmentModal(heroName) {
      const orderedGearNames = this.heroGear(heroName);
      if (orderedGearNames.length > 0) {
        this.selectedHeroEquipment = this.heroEquipment.filter(gear => orderedGearNames.includes(gear.name));

        this.selectedHeroEquipment.sort((a, b) => {
          return orderedGearNames.indexOf(a.name) - orderedGearNames.indexOf(b.name);
        });

        if (this.selectedHeroEquipment.length > 0) {
          this.isModalOpen = true;
          this.selectedHeroName = heroName;
        } else {
          this.isModalOpen = false;
          this.selectedHeroName = '';
        }
      } else {
        this.isModalOpen = false;
        this.selectedHeroName = '';
      }
    },
    closeEquipmentModal() {
      this.isModalOpen = false;
      this.selectedHeroEquipment = [];
    },
    heroGear(heroName) {
      const heroEquipmentMap = {
        "Barbarian King": [
          "Barbarian Puppet", "Rage Vial", "Earthquake Boots", "Vampstache", "Giant Gauntlet", "Spiky Ball", "Snake Bracelet"
        ],
        "Archer Queen": [
          "Archer Puppet", "Invisibility Vial", "Giant Arrow", "Healer Puppet", "Frozen Arrow", "Magic Mirror"
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
      return false;
    },
  },
  computed: {
    heroEquipment() {
      return this.member.heroEquipment.filter((gear) => gear.village === "home");
    }
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
