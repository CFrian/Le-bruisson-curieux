// Configuration globale d'axios.
// Toutes les requêtes vers le back passent par cette instance.
// withCredentials: true → envoie automatiquement les cookies httpOnly avec chaque requête.


import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true
    // withCredentials: true : par défaut, les requêtes cross-origin 
    // (React sur port 5173, API sur port 3000) n'envoient pas les cookies. 
    // Cette option force leur envoi — indispensable pour que l'authentification via cookies httpOnly fonctionne.
});

export default api;