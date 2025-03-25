<template>
  <div class="min-h-screen bg-gray-100" v-if="!loading && member">
    <div class="container mx-auto py-8">
      <MemberHeader
        :member="member"
        :unrankedLeagueIcon="unrankedLeagueIcon"
        :icons="icons"
        @clanClicked="getClanDetails"
      />
      <VillageDetails :member="member" :icons="icons" />
      <MemberStats :member="member" :icons="icons" />
    </div>
  </div>
  <div v-else-if="loading" class="min-h-screen flex justify-center items-center">
    Chargement des détails du membre...
  </div>
  <div v-else-if="error" class="min-h-screen flex justify-center items-center text-red-500">
    {{ error }}
  </div>
</template>

<script>
import apiService from "../apiService";
import icons from "@/assets/icons.js";
import MemberHeader from "@/components/MemberComponent/MemberHeader.vue";
import VillageDetails from "@/components/VillageDetails.vue";
import MemberStats from "@/components/MemberComponent/MemberStats.vue";

export default {
  components: {
    MemberHeader,
    VillageDetails,
    MemberStats,
  },
  data() {
    return {
      member: null,
      unrankedLeagueIcon: "",
      icons: icons,
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchData();
  },

  mounted() {
    document.title = `${this.member?.name}`;
  },

  methods: {
    async fetchData() {
      try {
        await this.fetchMemberDetails();
        await this.fetchUnrankedLeagueIcon();
      } catch (err) {
        this.error = "Erreur lors de la récupération des données. Veuillez réessayer.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async fetchMemberDetails() {
      const memberTag = this.$route.params.memberTag;
      this.member = await apiService.getMemberDetails(memberTag);
      document.title = `${this.member?.name}`;
    },
    async fetchUnrankedLeagueIcon() {
      const response = await apiService.getLeagues();
      const unrankedLeague = response.items.find(
        (league) => league.name === "Unranked"
      );
      if (unrankedLeague) {
        this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
      }
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace("#", "");
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
  },
};
</script>
