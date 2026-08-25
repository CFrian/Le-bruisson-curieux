
// Configuration globale d'axios + intercepteur de rafraîchissement automatique de session.
// Toutes les requêtes vers le back passent par cette instance.
// Comportement : si une requête échoue avec 401 (accessToken expiré), on tente
// automatiquement un refresh (POST /api/auth/refresh) puis on rejoue la requête
// initiale — invisible pour l'utilisateur, pas de déconnexion intempestive.
//
// Si plusieurs requêtes échouent en même temps, un seul refresh est déclenché
// (isRefreshing), les autres requêtes en attente sont mises en file (failedQueue)
// et rejouées une fois le nouveau token obtenu.

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true
    // withCredentials: true : par défaut, les requêtes cross-origin 
    // (React sur port 5173, API sur port 3000) n'envoient pas les cookies. 
    // Cette option force leur envoi — indispensable pour que l'authentification via cookies httpOnly fonctionne.
});


let isRefreshing = false;
let failedQueue = [];

// Vide la file d'attente : soit en erreur (si le refresh a échoué),
// soit en relançant chaque requête en attente (si le refresh a réussi).
const processQueue = (error) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    // Si la requête réussit, on ne fait rien de spécial — comportement normal
    (response) => response,

    // Si la requête échoue, on regarde si c'est un 401 qu'on peut tenter de résoudre
    async (error) => {
        const originalRequest = error.config;

        // Ne tente le refresh que si :
        // - c'est bien une erreur 401
        // - ce n'est pas déjà une tentative de retry (évite une boucle infinie)
        // - ce n'est pas la requête de login/refresh elle-même qui échoue
        //   (sinon un mauvais mot de passe déclencherait un refresh inutile)
        const isAuthRoute = originalRequest.url?.includes('/api/auth/login')
            || originalRequest.url?.includes('/api/auth/refresh')
            || originalRequest.url?.includes('/api/auth/me');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {

            if (isRefreshing) {
                // Un refresh est déjà en cours : on met cette requête en attente
                // plutôt que de déclencher un second refresh en parallèle.
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post('/api/auth/refresh');
                processQueue(null); // libère les requêtes en attente
                return api(originalRequest); // rejoue la requête initiale avec le nouveau cookie
            } catch (refreshError) {
                processQueue(refreshError);
                // Le refresh a échoué (refreshToken expiré/révoqué) — véritable déconnexion,
                // impossible de faire autrement que de renvoyer vers le login.
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;