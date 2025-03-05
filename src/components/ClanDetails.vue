<template>
  <div>
    <h1>Détails du Clan</h1>
    <div v-if="clan">
      <h2>{{ clan.name }}</h2>
      <p>Membres : {{ clan.members }}</p>
      <!-- Affiche d'autres détails selon tes besoins -->
    </div>
    <div v-else>
      <p>Chargement des détails du clan...</p>
    </div>
  </div>
</template>

<script>
import apiService from '../apiService';

export default {
  data() {
    return {
      clan: null
    };
  },
  created() {
    this.fetchClanDetails();
  },
  methods: {
    fetchClanDetails() {
      const clanTag = this.$route.params.clanTag;
      apiService.getClanDetails(clanTag).then(response => {
        console.log('Réponse de l\'API :', response.data);
        if (response.data) {
          this.clan = response.data;
        } else {
          console.error('Données du clan non trouvées');
        }
      }).catch(error => {
        console.error('Erreur lors de la récupération des détails du clan :', error);
      });
    }
  }
}
</script>
