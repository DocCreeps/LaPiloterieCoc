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
import BuilderBaseVillage from './MemberComponent/BuilderBaseVillage.vue';
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
      const selectedHero = this.member.heroes.find(hero => hero.name === heroName && hero.village === 'home');
      if (selectedHero && selectedHero.equipment && selectedHero.equipment.length > 0) {
        this.selectedHeroEquipment = selectedHero.equipment;
        this.isModalOpen = true;
        this.selectedHeroName = heroName;
      } else {
        this.isModalOpen = false;
        this.selectedHeroName = '';
        this.selectedHeroEquipment = [];
      }
    },
    closeEquipmentModal() {
      this.isModalOpen = false;
      this.selectedHeroEquipment = [];
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
