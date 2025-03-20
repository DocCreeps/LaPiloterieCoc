<template>
  <div class="container px-4">
  <div class="bg-white p-8 rounded-lg shadow-md w-full ">
    <div class="text-center mb-4">
      <h1 class="text-3xl font-bold">{{ member?.name }}</h1>
      <h2 class="text-xl text-gray-600">{{ member?.tag }}</h2>
      <hr class="my-4" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="text-center">
        <img
          :src="member?.league?.iconUrls?.small || unrankedLeagueIcon"
          alt="League Badge"
          class="mx-auto mt-2"
        />
        <p class="text-lg">{{ member?.league?.name || "Non classé" }}</p>
        <p class="text-2xl font-bold">
          {{ member?.trophies || 0 }} <i class="fas fa-trophy"></i>
        </p>
      </div>

      <div class="text-center">
        <div class="grid grid-cols-1 gap-2 player-details">
          <div class="flex justify-between">
            <span>Expérience:</span>
            <span class="flex flex-row">
              <img :src="icons['icon/xp']" alt="Experience" class="h-6 w-6" /><strong
              class="ml-2"
            >{{ member?.expLevel }}</strong
            >
            </span>
          </div>
          <div class="flex justify-between">
            <span>Trophées:</span>
            <span class="flex flex-row">
              <img :src="icons['icon/Trophy']" alt="Trophies" class="h-6 w-6" /><strong
              class="ml-2 mr-2"
            >{{ member?.trophies }}</strong
            >
              |
              <img
                :src="icons['icon/mdo_trophy']"
                alt="MDO Trophies"
                class="h-6 w-6 ml-2"
              /><strong class="ml-2">{{ member?.builderBaseTrophies }}</strong>
            </span>
          </div>
          <div class="flex justify-between">
            <span>Meilleurs Trophées:</span>
            <span class="flex flex-row">
              <img :src="icons['icon/Trophy']" alt="Trophies" class="h-6 w-6" /><strong
              class="ml-2 mr-2"
            >{{ member?.bestTrophies }}</strong
            >
              |
              <img
                :src="icons['icon/mdo_trophy']"
                alt="MDO Trophies"
                class="h-6 w-6 ml-2"
              /><strong class="ml-2">{{ member?.bestBuilderBaseTrophies }}</strong>
            </span>
          </div>
          <div class="flex justify-between">
            <span>Dons:</span>
            <span class="flex flex-row">
              <img :src="icons['icon/up']" alt="Membres" class="h-5 w-5" /><strong
              class="ml-2 mr-2"
            >{{ member?.donations }}</strong
            >
              |
              <img :src="icons['icon/down']" alt="Membres" class="h-5 w-5 ml-2" /><strong
              class="ml-2"
            >{{ member?.donationsReceived }}</strong
            >
            </span>
          </div>
          <div class="flex justify-between">
            <span>Ratio:</span>
            <span class="flex flex-row">
              <img :src="icons['icon/cdc']" alt="Sword" class="h-7 w-7" /><strong
              class="ml-2"
            >{{ (member?.donations / member?.donationsReceived || 0).toFixed(2) }}</strong
            >
            </span>
          </div>
          <div class="flex justify-between">
            <span>Activité:</span>
            <span class="flex flex-row">
              <img :src="icons['icon/Sword']" alt="Sword" class="h-7 w-7" /><strong
              class="ml-2 mr-2"
            >{{ member?.attackWins }}</strong
            >
              |
              <img :src="icons['icon/Shield']" alt="Shield" class="h-7 w-7 ml-2" /><strong
              class="ml-2"
            >{{ member?.defenseWins }}</strong
            >
            </span>
          </div>
        </div>
        <div class="text-center mt-4">
          <div class="player-label-holder flex flex-row justify-center">
            <img
              v-for="label in member?.labels"
              :key="label.id"
              :src="label.iconUrls.medium"
              :title="label.name"
              class="player-label mx-2"
            />
          </div>
        </div>
      </div>

      <div
        class="text-center cursor-pointer"
        :key="member.clan.tag"
        @click="getClanDetails(member?.clan.tag)"
      >
        <img :src="member?.clan?.badgeUrls?.small" alt="Clan Badge" class="mx-auto mt-2" />
        <p class="text-lg font-bold">{{ member?.clan.name }}</p>
        <p class="text-2xl semibold">{{ translateRole(member?.role) }}</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
    unrankedLeagueIcon: String,
    icons: Object,
  },
  methods: {
    translateRole(role) {
      const roles = {
        leader: "Chef",
        coLeader: "Adjoint",
        admin: "Aîné",
        member: "Membre",
      };
      return roles[role] || role;
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace("#", "");
      this.$emit("clanClicked", cleanedClanTag);
    },
  },
};
</script>

<style scoped>
.player-label {
  height: 32px;
  width: 32px;
}
</style>
