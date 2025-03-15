<template>
  <div class="min-h-screen bg-gray-100" v-if="clan">
    <div class="container mx-auto py-8 flex flex-col lg:flex-row lg:justify-between">
      <!-- Bloc de gauche : Infos du clan -->
      <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mb-4 lg:mb-0">
        <!-- Icône et Nom du Clan -->
        <div class="flex flex-col items-center mb-4">
          <img :src="clan?.badgeUrls?.medium" alt="Clan Badge" class="h-16 w-16">
          <h1 class="text-2xl font-bold mt-2">{{ clan?.name || "Nom du Clan" }}</h1>
        </div>

        <!-- Section Détails : Ligue de Guerre, Infos & Ligue des Raids -->
        <div class="flex justify-between items-center mt-4">
          <!-- Ligue de Guerre -->
          <div class="flex flex-col items-center cursor-pointer" @click="goToWarsDetail(clan.tag)" v-if="clan.isWarLogPublic">
            <img :src="getLeagueIcon(clan?.warLeague?.name)" alt="Ligue des Guerres" class="league-icon mb-1">
            <p class="text-sm text-gray-600">Ligue De Clan</p>
          </div>
          <div class="flex flex-col items-center cursor-pointer" v-else>
            <img :src="getLeagueIcon(clan?.warLeague?.name)" alt="Ligue des Guerres" class="league-icon mb-1">
            <p class="text-sm text-gray-600">Ligue De Clan</p>
          </div>

          <!-- Niveau et Trophées -->
          <div class="text-center">
            <div class="flex flex-row">
            <img :src="icons['icon/clanxp']" alt="experience" class="h-10 w-10"/>
            <p class="text-lg ml-2">lvl {{ clan?.clanLevel }}</p>
            </div>
            <hr class="my-2">
            <div class="flex flex-row">
              <img :src="icons['icon/Trophy']" alt="Trophées de clan" class="h-10 w-10"/>
              <p class="text-lg ml-2">{{ clan?.clanPoints }}</p>
            </div>
          </div>

          <!-- Ligue des Raids Capital -->
          <div class="flex flex-col items-center cursor-pointer" @click="goToCapitalRaid(clan.tag)">
            <img :src="getLeagueIcon(clan?.capitalLeague?.name)" alt="Ligue des Raids" class="league-icon mb-1">
            <p class="text-sm text-gray-600">Raids Capital</p>
<!--            <p class="text-lg">Capital {{ clan?.clanCapital.capitalHallLevel }}</p>-->
          </div>
        </div>
      </div>

      <!-- Bloc du milieu : Autres informations -->
      <div class="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/3 mb-4 lg:mb-0">
        <p class="text-lg">{{ clan?.description || "Description indisponible." }}</p>
        <div class="flex flex-row  mt-2">
        <Icon icon="fa6-solid:user-group" width="30" height="30" />
        <p class="text-lg ml-2"> {{ clan?.members }}/50</p>
        </div>
        <div class="text-center mt-4 ">
          <div class="player-label-holder flex flex-row justify-center">
            <img v-for="label in clan?.labels" :key="label.id" :src="label.iconUrls.small" :title="label.name" class="player-label mx-2">
          </div>
        </div>


      </div>

      <!-- Bloc de droite : Statistiques de guerre -->
      <div class="bg-blue-500 p-4 rounded-lg shadow-md text-white w-full lg:w-1/3" v-if="clan?.isWarLogPublic">
        <h2 class="text-xl font-bold mb-4 text-center">Statistiques de Guerre</h2>
        <div class="flex flex-wrap justify-center">
          <div class="flex flex-col items-center bg-green-600 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Gagné</p>
            <p class="text-lg">{{ clan?.warWins || 0 }}</p>
          </div>
          <div class="flex flex-col items-center bg-red-500 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Perdu</p>
            <p class="text-lg">{{ clan?.warLosses || 0 }}</p>
          </div>
          <div class="flex flex-col items-center bg-gray-500 p-2 rounded-lg m-1">
            <p class="text-lg font-bold">Égalité</p>
            <p class="text-lg">{{ clan?.warTies || 0 }}</p>
          </div>
        </div>
        <div class="flex flex-col items-center bg-black p-2 rounded-lg m-1 mt-4">
          <p class="text-lg font-bold text-white">Total</p>
          <p class="text-lg text-white">{{ (clan?.warWins || 0) + (clan?.warLosses || 0) + (clan?.warTies || 0) }}</p>
        </div>
      </div>
      <div class="bg-red-500 p-4 rounded-lg shadow-md text-white w-full lg:w-1/3" v-else>
        <h2 class="text-xl font-bold mb-4 text-center">Journal de Guerre Privé</h2>
        <p class="text-center">Les statistiques de guerre sont privées.</p>
      </div>

    </div>

    <div class="container mx-auto py-8 flex justify-center gap-4">
      <!-- Bouton pour Détails de Guerre -->
      <button v-if="clan.isWarLogPublic"
              @click="goToWarsDetail(clan.tag)"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Détails des Guerres
      </button>

      <!-- Bouton pour Raids de Capital -->
      <button
        @click="goToCapitalRaid(clan.tag)"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Raids de Capital
      </button>
    </div>

    <div class="container mx-auto py-8">
      <h2 class="text-2xl font-bold mb-4 text-center">Membres</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="member in clan?.memberList"
          :key="member.tag"
          @click="goToMemberDetails(member.tag)"
        class="bg-white p-4 rounded-lg shadow-md cursor-pointer"
        >
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-row">
          <img :src="member.league?.iconUrls.small" alt="League Badge" class="w-12 h-12 mr-4">
          <div>
            <h3 class="text-xl font-semibold">{{ member.name }}</h3>
            <p class="text-gray-600">{{ translateRole(member.role) }}</p>
          </div>
          </div>
          <div class="flex flex-row">

            <img v-if="(member.previousClanRank) - (member.clanRank) > 0" :src="icons['icon/up']" alt="up" class="h-8 w-8"/>
            <img v-else-if="(member.previousClanRank) - (member.clanRank) < 0" :src="icons['icon/down']" alt="down" class="h-8 w-8"/>
            <img v-else :src="icons['icon/nomove']" alt="equal" class="h-8 w-8"/>

           <p class="ml-2"> {{ (member.previousClanRank) - (member.clanRank) }}</p>
          </div>
          <div class="flex flex-row ">
            <img :src="icons['icon/xp']" alt="experience" class="h-10 w-10"/>
            <p class="text-gray-600 ml-2">{{ member.expLevel }}</p>
          </div>
        </div>
          <div class="flex flex-row justify-between">
            <div>
              <img v-if="member && getTownHallImage(member.townHallLevel)" :src="getTownHallImage(member.townHallLevel)" :title="'HDV ' + member.townHallLevel" :alt="'HDV' + member.townHallLevel"  class="w-15 h-15"/>
          <div class="flex flex-row mt-2">
            <img :src="icons['icon/Trophy']" alt="Trophée" class="h-10 w-10"/>
          <p class="text-gray-600 ml-2">{{ member.trophies }}</p>

          </div>
            </div>
            <div>
              <img v-if="member && getBuilderHallImage(member.builderHallLevel)" :src="getBuilderHallImage(member.builderHallLevel)" :title="'HDV ' + member.builderHallLevel" :alt="'MDO' + member.builderHallLevel"  class="w-15 h-15"/>
              <div class="flex flex-row mt-2">
                <img :src="icons['icon/mdo_trophy']" alt="Trophée MDO" class="h-10 w-10"/>
                <p class="text-gray-600 ml-2">{{ member.builderBaseTrophies }}</p>
              </div>
            </div>

</div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import apiService from '../apiService';
import { Icon } from '@iconify/vue'
import icons from '@/assets/icons.js';


export default {
  computed: {
    memberDetails() {
      return memberDetails
    }
  },
  components: { Icon },
  data() {
    return {
      clan: null,
      leagues: [],
      unrankedLeagueIcon: '',
      icons : icons,
    };
  },
  created() {
    this.fetchClanDetails();
    this.fetchUnrankedLeagueIcon();
    this.fetchLeagues();
  },
  mounted() {
    document.title = `Détails du clan - ${this.clan?.name }`;
  },
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        this.clan = response;
        document.title = `Détails du Clan - ${this.clan.name}`;
        this.fetchMemberDetails();
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
      });
    },
    translateRole(role) {
      const roles = {
        leader: 'Chef',
        coLeader: 'Adjoint',
        admin: 'Aîné',
        member: 'Membre',
      };
      return roles[role] || role;
    },
    goToMemberDetails(memberTag) {
      this.$router.push(`/players/${encodeURIComponent(memberTag)}`);
    },
    goToWarsDetail(clanTag) {
      // Redirige vers la page des détails de guerre
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/wars/${cleanedClanTag}`);
    },
    goToCapitalRaid(clanTag) {
      // Redirige vers la page des Raids de Capital
      const cleanedClanTag = clanTag.replace('#', '');
      this.$router.push(`/clan/${cleanedClanTag}/CapitalRaid`);
    },
    fetchUnrankedLeagueIcon() {
      // Récupère l'icône "Non classé"
      apiService.getLeagues().then(response => {
        const unrankedLeague = response.items.find(league => league.name === 'Unranked');
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    fetchLeagues() {
      apiService.getLeagues().then(response => {
        this.leagues = response.items;
        // Récupère l'icône "Non classé"
        const unrankedLeague = this.leagues.find(league => league.name === 'Unranked');
        if (unrankedLeague) {
          this.unrankedLeagueIcon = unrankedLeague.iconUrls.small;
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
      });
    },
    getLeagueIcon(leagueName) {
      // Trouve l'icône correspondant au nom de la ligue
      const league = this.leagues.find(league => league.name === leagueName);
      return league?.iconUrls?.small || this.unrankedLeagueIcon;
    },

    fetchMemberDetails() {
      const memberTags = this.clan.memberList.map(member => member.tag);
      Promise.all(memberTags.map(tag => apiService.getMemberDetails(tag)))
        .then(responses => {
          responses.forEach((memberDetails, index) => {
            this.clan.memberList[index] = { ...this.clan.memberList[index], ...memberDetails };
          });
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des détails des membres :', error);
        });
    },
    getTownHallImage(level) {
      if (level >= 1 && level <= 17) {
        const iconName = `HDV/th_${level}`;
        return this.icons[iconName];
      }
      return null; // ou this.icons.default si vous avez une image par défaut
    },
    getBuilderHallImage(level) {
      if (level >= 1 && level <= 10) {
        const iconName = `HDV/MDO_${level}`;
        return this.icons[iconName];
      }
      return null; // ou this.icons.default si vous avez une image par défaut
    },

  },
};
</script>


<style scoped>
/* Tes styles ici */
</style>
