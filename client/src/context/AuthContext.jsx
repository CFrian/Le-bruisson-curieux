// Contexte global d'authentification.
// Permet à n'importe quel composant de savoir si l'admin est connecté,
// sans avoir à passer l'info de composant en composant (prop drilling).

import { createContext, useContext, useState } from 'react';

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
    // isAuthenticated et mustChangePassword → états lisibles
    // login et logout → fonctions pour modifier ces états
    return (
        <AuthContext.Provider value={{ isAuthenticated, mustChangePassword, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé qui remplace useContext(AuthContext) partout dans l'app
// Usage dans un composant : const { isAuthenticated, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext);