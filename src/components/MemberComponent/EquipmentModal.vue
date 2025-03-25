<template>
  <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50" @click.self="$emit('close')">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative" @click.stop>
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <img :src="heroIcon" :alt="selectedHeroName" :title="selectedHeroName" class="h-12 w-12 md:h-25 md:w-25 mx-auto" />
      <div v-if="selectedHeroEquipment.length > 0" class="flex flex-wrap justify-center mt-10">
        <div v-for="gear in selectedHeroEquipment" :key="gear.name" class="relative mx-1 mb-2 md:mx-2 md:mb-2">
          <img :src="getEquipmentIcon(gear.name)" :alt="gear.name" :title="`${gear.name} (${gear.level}/${gear.maxLevel})`" class="h-12 w-12 md:h-20 md:w-20 mx-5" />
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
    isModalOpen: Boolean,
    selectedHeroName: String,
    selectedHeroEquipment: Array,
    icons: Object,
  },
  computed: {
    heroIcon() {
      const heroesIcons = `Hero/${this.selectedHeroName}`;
      return this.icons[heroesIcons];
    },
  },
  methods: {
    getEquipmentIcon(equipmentName) {
      const equipmentIcons = `Equipment/${equipmentName}`;
      return this.icons[equipmentIcons];
    },
  },
};
</script>

<style scoped>
/* Vos styles ici */
</style>
