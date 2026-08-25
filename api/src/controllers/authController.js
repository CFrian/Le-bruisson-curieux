const authService = require('../services/authService');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
};

// GET /api/auth/me
const me = async (req, res, next) => {
    try {
        // req.user.id vient de requireAuth (décodé depuis le JWT)
        const user = await authService.getUserById(req.user.id);

        if (!user) {
            const error = new Error('Utilisateur introuvable');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            authenticated: true,
            mustChangePassword: user.mustChangePassword
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, mustChangePassword } = await authService.login(email, password);

        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ message: 'Connexion réussie', mustChangePassword });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken); // supprime le token de la base
        }
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        res.json({ message: 'Déconnexion réussie' });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            const error = new Error('Session expirée, veuillez vous reconnecter');
            error.statusCode = 401;
            throw error;
        }
        const accessToken = await authService.refresh(refreshToken);
        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 1000
        });
        res.json({ message: 'Token renouvelé' });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/change-password first connection
const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await authService.changePassword(req.user.id, oldPassword, newPassword);
        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (err) {
        next(err);
    }
};


const updateEmail = async (req, res, next) => {
    try {
        const { newEmail, currentPassword } = req.body;
        await authService.updateEmail(req.user.id, newEmail, currentPassword);
        res.json({ message: 'Email modifié avec succès' });
    } catch (err) {
        next(err);
    }
};


// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        // Réponse identique que l'email existe ou non en base — évite l'énumération de comptes
        res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        res.json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (err) {
        next(err);
    }
};

module.exports = { login, logout, refresh, changePassword, me, updateEmail, forgotPassword, resetPassword };