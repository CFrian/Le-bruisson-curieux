// Reçoit les requêtes HTTP liées à l'auth, appelle le service,
// et gère les cookies httpOnly pour les tokens.

const authService = require('../services/authService');

// Options communes aux deux cookies
const cookieOptions = {
    httpOnly: true,     // inaccessible au JavaScript front (protection XSS)
    secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
    sameSite: 'strict'  // protection CSRF
};

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, mustChangePassword } = await authService.login(email, password);

        // Stocke les tokens dans des cookies httpOnly
        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 1000 // 1h en millisecondes
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours en millisecondes
        });

        res.json({ message: 'Connexion réussie', mustChangePassword });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/logout
const logout = (req, res) => {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.json({ message: 'Déconnexion réussie' });
};

// POST /api/auth/change-password
const changePassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        await authService.changePassword(req.user.id, newPassword);
        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (err) {
        next(err);
    }
};

module.exports = { login, logout, changePassword };