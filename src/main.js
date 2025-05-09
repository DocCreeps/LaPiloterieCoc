// main.js
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import apiService from './apiService';
import MaintenancePage from './pages/MaintenancePage.vue';

let appInstance = null;

async function checkMaintenanceAndInitializeApp() {
  try {
    const response = await apiService.getLeagues();

    if (response && response.isMaintenance) {
      console.log('API en maintenance détectée au démarrage, redirection via route...');
      router.push({ name: 'maintenance', query: { message: response.message } });
    } else {
<<<<<<< Updated upstream
      appInstance = createApp(App)
=======
      // Monter l'application principale SEULEMENT s'il n'y a pas de maintenance
      createApp(App)
>>>>>>> Stashed changes
        .use(router)
        .mount('#app');
    }
  } catch (error) {
    console.error('Erreur initiale lors de la vérification de maintenance :', error);
    // En cas d'erreur initiale (autre que la maintenance gérée par l'intercepteur),
<<<<<<< Updated upstream
    // on monte directement le composant MaintenancePage.
    if (!appInstance) {
      appInstance = createApp(MaintenancePage)
        .mount('#app');
    } else {
      // Si l'application est déjà montée et qu'une erreur survient,
      // vous pouvez naviguer vers la page de maintenance via le routeur
      console.error('Erreur lors de la vérification de maintenance après le démarrage, redirection via route...');
      router.push({ name: 'maintenance', query: { message: 'L\'API rencontre des problèmes techniques. Veuillez réessayer ultérieurement.' } });
    }
=======
    // rediriger vers la page de maintenance avec un message générique.
    router.push({ name: 'maintenance', query: { message: 'L\'application n\'a pas pu démarrer correctement. Veuillez réessayer plus tard.' } });
>>>>>>> Stashed changes
  }
}

checkMaintenanceAndInitializeApp();
