import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`
  }
});

export default {
  getClanDetails(clanTag) {
  const encodedTag = encodeURIComponent(`#${clanTag}`);
  const requestUrl=`/clans/${encodedTag}`;
    return apiClient.get(requestUrl)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la requête API :', error);
        throw error;
      });
  },

  getMemberDetails(memberTag) {
    const encodedTag = encodeURIComponent(memberTag);
    const requestUrl = `/players/${encodedTag}`;
    return apiClient.get(requestUrl)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la requête API :', error);
        throw error;
      });
  },
getWarLog(clanTag) {
  const encodedTag = encodeURIComponent(`#${clanTag}`);
  const requestUrl=`/clans/${encodedTag}/warlog`;
  return apiClient.get(requestUrl)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Erreur lors de la requête API :', error);
      throw error;
    });
},
  getCapitalDetails(clanTag) {
    const encodedTag = encodeURIComponent(`#${clanTag}`);
    const requestUrl = `/clans/${encodedTag}/capitalraidseasons`;
    return apiClient.get(requestUrl)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la requête API :', error);
        throw error;
      });
  },
  getLeagues() {
    const requestUrl = `/leagues`;
    return apiClient.get(requestUrl)
      .then(response => response.data)
      .catch(error => {
        console.error('Erreur lors de la récupération des ligues :', error);
        throw error;
      });
  },
  getCurrentWar(clanTag){
    const encodedTag = encodeURIComponent(`#${clanTag}`);
    const requestUrl=`/clans/${encodedTag}/currentwar`;
    return apiClient.get(requestUrl)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la requête API :', error);
        throw error;
      });
  },
  getCurrentWarLeague(clanTag){
    const encodedTag = encodeURIComponent(`#${clanTag}`);
    const requestUrl=`/clans/${encodedTag}/currentwar/leaguegroup`;
    return apiClient.get(requestUrl)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la requête API :', error);
        throw error;
      });
  },
  getWarDetails(warTag){
    const encodedTag = encodeURIComponent(warTag);
    const requestUrl=`/clanwarleagues/wars/${encodedTag}`;
    return apiClient.get(requestUrl)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la requête API :', error);
        throw error;
      });
  }

};
