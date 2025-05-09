// main.js
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import apiService from './apiService'; // Assurez-vous que le chemin est correct

async function checkMaintenanceAndInitializeApp() {
  try {
    const response = await apiService.getLeagues();

    if (response && response.isMaintenance) {
      console.log('API en maintenance détectée au démarrage, redirection...');
      router.push({ name: 'maintenance', query: { message: response.message } });
    } else {
      // Monter l'application principale SEULEMENT s'il n'y a pas de maintenance
      createApp(App)
        .use(router)
        .mount('#app');
    }
  } catch (error) {
    console.error('Erreur initiale lors de la vérification de maintenance :', error);
    // En cas d'erreur initiale (autre que la maintenance gérée par l'intercepteur),
    // rediriger vers la page de maintenance avec un message générique.
    router.push({ name: 'maintenance', query: { message: 'L\'application n\'a pas pu démarrer correctement. Veuillez réessayer plus tard.' } });
  }
}

checkMaintenanceAndInitializeApp();
