// Empêche un utilisateur déjà connecté d'accéder à la page de login.
// Garde-fou de sécurité/logique — indépendant de ce qui est affiché dans la Navbar.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RedirectIfAuthenticated({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p className="text-center pt-15">Chargement...</p>;
    }

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
}