import axios from 'axios';

const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjllNWJhMTM2LTNkMDctNDFlMi05MzBlLTZkOTNhMDZlN2NmYyIsImlhdCI6MTc0MTE4MzczMCwic3ViIjoiZGV2ZWxvcGVyL2IyMTNhMTgxLTMxYzAtNzc3Yi1jZTA1LTFjNTMxOTY2NGQzYSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEwOS4yMTMuMTk2LjMwIl0sInR5cGUiOiJjbGllbnQifV19.EyUVY84paT2c0O2WcdnGLD3s45RQ0BWP3ozbiHcB5KSNsxC-2yJBMmW4K3uwHOorw0dniEtu0CFG065cansXeQ'; // Remplace par ta clé API
const API_URL = '/api';

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
  console.log(`Requête URL : ${requestUrl}`);
    return apiClient.get(requestUrl)
      .then(response => {
        console.log('Réponse de l\'API :', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Erreur lors de la requête API :', error);
        throw error;
      });
  },

  // Ajoute d'autres méthodes pour interagir avec l'API selon tes besoins
};
