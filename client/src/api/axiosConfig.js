
// Configuration globale d'axios + intercepteur de rafraîchissement automatique de session.
// Toutes les requêtes vers le back passent par cette instance.
// Comportement : si une requête échoue avec 401 (accessToken expiré), on tente
// automatiquement un refresh (POST /api/auth/refresh) puis on rejoue la requête
// initiale 
//
// Si plusieurs requêtes échouent en même temps, un seul refresh est déclenché
// (isRefreshing), les autres requêtes en attente sont mises en file (failedQueue)
// et rejouées une fois le nouveau token obtenu.

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true
  });


let isRefreshing = false;
let failedQueue = [];

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
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute = originalRequest.url?.includes('/api/auth/login')
            || originalRequest.url?.includes('/api/auth/refresh')
            || originalRequest.url?.includes('/api/auth/me');
     
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {

            if (isRefreshing) {
        
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
                // Le refresh a échoué (refreshToken expiré/révoqué)   véritable déconnexion,renvoyer vers le login.
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