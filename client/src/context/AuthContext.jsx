// Contexte global d'authentification.
// Permet à n'importe quel composant de savoir si l'admin est connecté,
// sans avoir à passer l'info de composant en composant (prop drilling).

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

// createContext crée un "espace de partage" global accessible depuis n'importe quel composant enfant
// null = valeur par défaut si le composant est utilisé hors du Provider
const AuthContext = createContext(null);

// AuthProvider est le composant qui englobe toute l'app (voir main.jsx plus tard)
// children = tout ce qui est imbriqué à l'intérieur de ce composant
export const AuthProvider = ({ children }) => {

    // isAuthenticated : true si l'admin est connecté, false sinon
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // mustChangePassword : true si c'est la première connexion avec mot de passe temporaire
    const [mustChangePassword, setMustChangePassword] = useState(false);

    // loading : true tant qu'on n'a pas encore vérifié si un cookie de session valide existe déjà.
    // Indispensable car les cookies httpOnly sont invisibles en JS — la seule façon de savoir
    // si l'utilisateur est déjà connecté (ex: après un rafraîchissement de page) est de demander
    // au back via une requête. Tant que cette requête n'a pas répondu, on ne sait pas encore.
    const [loading, setLoading] = useState(true);

    // Au tout premier chargement de l'app (montage du Provider), on vérifie
    // si un cookie accessToken valide existe déjà côté navigateur.
    // useEffect avec [] → s'exécute une seule fois, jamais rejoué ensuite.
    useEffect(() => {
        api.get('/api/auth/me')
            .then((response) => {
                // Le back a validé le cookie → l'utilisateur est bien connecté
                setIsAuthenticated(true);
                setMustChangePassword(response.data.mustChangePassword);
            })
            .catch(() => {
                // 401 = pas de cookie valide, comportement normal si non connecté.
                // Pas une vraie erreur à signaler, juste l'état "non connecté".
                setIsAuthenticated(false);
            })
            .finally(() => {
                // Dans tous les cas, la vérification est terminée
                setLoading(false);
            });
    }, []);

    // Appelée après un login réussi — met à jour les deux états
    // mustChange vient de la réponse du back { mustChangePassword: true/false }
    const login = (mustChange) => {
        setIsAuthenticated(true);
        setMustChangePassword(mustChange);
    };

    // Appelée après un logout — remet tout à zéro
    const logout = () => {
        setIsAuthenticated(false);
        setMustChangePassword(false);
    };

    // value = tout ce qu'on expose aux composants enfants
    // isAuthenticated, mustChangePassword, loading → états lisibles
    // login et logout → fonctions pour modifier ces états
    return (
        <AuthContext.Provider value={{ isAuthenticated, mustChangePassword, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé qui remplace useContext(AuthContext) partout dans l'app
// Usage dans un composant : const { isAuthenticated, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext);