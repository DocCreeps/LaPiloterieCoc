import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import apiService from './apiService'; // Assurez-vous que le chemin est correct

// main.js
async function checkMaintenanceAndInitializeApp() {
  try {
    const response = await apiService.getLeagues();

    if (response && response.isMaintenance) {
      console.log('API en maintenance détectée au démarrage, redirection...');
      router.push({ name: 'maintenance', query: { message: response.message } });
    } else {
      createApp(App)
        .use(router)
        .mount('#app');
    }
  } catch (error) {
    console.error('Erreur initiale lors de la vérification de maintenance :', error);
    // Rediriger vers la page de maintenance en cas d'erreur initiale (y compris 500)
    router.push({ name: 'maintenance', query: { message: 'L\'API rencontre des problèmes techniques. Veuillez réessayer ultérieurement.' } });
  }
}


checkMaintenanceAndInitializeApp();
