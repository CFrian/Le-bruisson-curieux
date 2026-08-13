// Composant de protection des routes admin.
// Si l'utilisateur n'est pas authentifié → redirige vers /admin/login.
// Si authentifié → affiche le composant enfant normalement.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    // Récupère l'état d'authentification depuis le contexte global
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p className='text-center pt-15'>Chargement...</p>
    }
    // Si pas connecté → redirection immédiate vers login
    // Navigate remplace la page courante dans l'historique (replace=true)
    // → l'utilisateur ne peut pas revenir en arrière vers la page protégée
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si connecté → affiche le contenu de la route normalement
    return children;
}