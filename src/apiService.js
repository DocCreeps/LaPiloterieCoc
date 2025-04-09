import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`
  }
});

// Fonction utilitaire pour gérer les erreurs
const handleError = (error, requestName) => {
  console.error(`Erreur lors de la requête API (${requestName}) :`, error);
  throw error;
};

// Fonction utilitaire pour encoder les tags
const encodeTag = (tag) => encodeURIComponent(tag);

const apiService = {
  // Récupérer les détails d'un clan
  getClanDetails(clanTag) {
    const requestUrl = `/clans/${encodeTag(`#${clanTag}`)}`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getClanDetails'));
  },
  // Récupérer les détails d'un membre
  getMemberDetails(memberTag) {
    const requestUrl = `/players/${encodeTag(memberTag)}`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getMemberDetails'));
  },
  // Récupérer les dernières guerres d'un clan
  getWarLog(clanTag) {
    const requestUrl = `/clans/${encodeTag(`#${clanTag}`)}/warlog`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getWarLog'));
  },
  // Récupérer les détails de la capitale d'un clan
  getCapitalDetails(clanTag) {
    const requestUrl = `/clans/${encodeTag(`#${clanTag}`)}/capitalraidseasons`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getCapitalDetails'));
  },
  // Récupérer les détails des ligues
  getLeagues() {
    const requestUrl = `/leagues`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getLeagues'));
  },
  // Récupérer les détails de la guerre en cours
  getCurrentWar(clanTag) {
    const requestUrl = `/clans/${encodeTag(`#${clanTag}`)}/currentwar`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getCurrentWar'));
  },
  // Récupérer les détails de la ligue de clan en cours
  getCurrentWarLeague(clanTag) {
    const requestUrl = `/clans/${encodeTag(`#${clanTag}`)}/currentwar/leaguegroup`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getCurrentWarLeague'));
  },
  // Récupérer les détails d'une guerre d'un round de la ligue
  getWarDetails(warTag) {
    const requestUrl = `/clanwarleagues/wars/${encodeTag(warTag)}`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => handleError(error, 'getWarDetails'));
  }
};

export default apiService;
