// main.js
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import apiService from './apiService'; // Assurez-vous que le chemin est correct
import ErrorInitialisation from './components/ErrorInitialisation.vue'; // Créez ce composant

let appInstance = null;

async function checkMaintenanceAndInitializeApp() {
  try {
    const response = await apiService.getLeagues();

    if (response && response.isMaintenance) {
      console.log('API en maintenance détectée au démarrage, redirection...');
      router.push({ name: 'maintenance', query: { message: response.message } });
    } else {
      appInstance = createApp(App)
        .use(router)
        .mount('#app');
    }
  } catch (error) {
    console.error('Erreur initiale lors de la vérification de maintenance :', error);
    // Si l'application n'a pas pu être créée (première tentative d'erreur),
    // on monte un composant d'erreur initial.
    if (!appInstance) {
      appInstance = createApp(ErrorInitialisation)
        .mount('#app');
    } else {
      // Si l'application est déjà montée et qu'une erreur survient lors de la vérification,
      // vous pouvez afficher un message d'erreur dans l'application elle-même.
      console.error('Erreur lors de la vérification de maintenance après le démarrage.');
      // Vous pourriez émettre un événement global pour informer les composants de l'erreur.
    }
  }
}

checkMaintenanceAndInitializeApp();
