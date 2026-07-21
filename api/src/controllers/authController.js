const authService = require('../services/authService');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
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

module.exports = { login, logout, refresh, changePassword };