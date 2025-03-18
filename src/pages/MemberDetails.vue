<template>
  <div class="min-h-screen bg-gray-100" v-if="member">
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
</template>

<script>
import apiService from "../apiService";
import icons from "@/assets/icons.js";
import MemberHeader from "@/components/MemberHeader.vue";
import VillageDetails from "@/components/VillageDetails.vue";
import MemberStats from "@/components/MemberStats.vue";

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
    };
  },
  created() {
    this.fetchUnrankedLeagueIcon();
    this.fetchMemberDetails();
  },

  mounted() {
    document.title = `${this.member?.name}`;
  },

  methods: {
    fetchMemberDetails() {
      const memberTag = this.$route.params.memberTag;
      apiService
        .getMemberDetails(memberTag)
        .then((response) => {
          this.member = response;
          document.title = `Détails du clan - ${this.member?.name}`;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des détails du membre :", error);
        });
    },
    fetchUnrankedLeagueIcon() {
      apiService
        .getLeagues()
        .then((response) => {
          const unrankedLeague = response.items.find((league) => league.name === "Unranked");
          if (unrankedLeague) {
            this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des ligues :", error);
        });
    },
    getClanDetails(clanTag) {
      const cleanedClanTag = clanTag.replace("#", "");
      this.$router.push(`/clan/${cleanedClanTag}`);
    },
  },
};
</script>
