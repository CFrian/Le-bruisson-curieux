// Gère la logique de connexion : vérification email/password,
// génération des tokens JWT, et changement de mot de passe.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const crypto = require('crypto');
const { Resend } = require('resend');


const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
}

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    )
}

// Vérifie email + mot de passe, renvoie les deux tokens si OK
const login = async (email, password) => {

    const user = await authRepository.findByEmail(email)
    if (!user) {
        const error = new Error('identifiant invalide')
        error.statusCode = 401
        throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        const error = new Error('identifiant invalide')
        error.statusCode = 401
        throw error
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)


    await refreshTokenRepository.save(refreshToken, user._id) //sauvegarde le refresh token  !

    return {
        accessToken,
        refreshToken,
        mustChangePassword: user.mustChangePassword
    }
}

const logout = async (refreshToken) => {
    await refreshTokenRepository.deleteToken(refreshToken)   // supprime le refresh token !
}

// Change le mot de passe et désactive le flag mustChangePassword
const changePassword = async (userId, oldPassword, newPassword) => {
    // Récupère l'utilisateur pour comparer son mot de passe actuel (hashé)
    const user = await authRepository.findById(userId);
    if (!user) {
        const error = new Error('Utilisateur introuvable');
        error.statusCode = 404;
        throw error;
    }

    // Vérifie que l'ancien mot de passe fourni correspond bien à celui en base.
    // Sans cette étape, n'importe quelle session active (même volée) pourrait
    // changer le mot de passe sans connaître l'actuel.
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        const error = new Error('Ancien mot de passe incorrect');
        error.statusCode = 401;
        throw error;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        const error = new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)');
        error.statusCode = 400;
        throw error;
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await authRepository.updateUser(userId, {
        password: hashed,
        mustChangePassword: false,
        tempPasswordExpireAt: null
    })

    // Révoque toutes les sessions actives de cet utilisateur — si le mot de passe
    // a été changé suite à une compromission (ou juste par prudence), on force
    // une reconnexion partout, y compris sur d'éventuels autres appareils/navigateurs.
    await refreshTokenRepository.deleteAllForUser(userId)
}

const updateEmail = async (userId, newEmail, currentPassword) => {
    const user = await authRepository.findById(userId);
    if (!user) {
        const error = new Error('Utilisateur introuvable');
        error.statusCode = 404;
        throw error;
    }

    // Vérifie le mot de passe actuel avant de changer l'email —
    // même logique de sécurité que changePassword : une session active seule
    // ne doit pas suffire à modifier une info sensible du compte.
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        const error = new Error('Mot de passe incorrect');
        error.statusCode = 401;
        throw error;
    }

    await authRepository.updateUser(userId, { email: newEmail });
};





const refresh = async (refreshToken) => {
    const stored = await refreshTokenRepository.findToken(refreshToken)
    if (!stored) {
        const error = new Error('Session expirée, veuillez vous reconnecter')
        error.statusCode = 401
        throw error
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    return generateAccessToken(decoded.id);
}


const getUserById = async (id) => {
    return await authRepository.findById(id);
};



const resend = new Resend(process.env.RESEND_API_KEY);

// Génère un token de reset, l'enregistre (hashé) en base avec une expiration de 15 min,
// puis envoie un email contenant le lien avec le token EN CLAIR.
// Le token en clair n'existe jamais en base — seul son hash y est stocké,
// pour qu'un accès en lecture à la BDD ne permette pas de forger des liens valides.
const forgotPassword = async (email) => {
    const user = await authRepository.findByEmail(email);

    // Ne révèle jamais si l'email existe ou non en base — sinon on donne
    // à un attaquant un moyen de vérifier quels emails sont enregistrés
    // (énumération de comptes). On répond "succès" dans tous les cas côté controller.
    if (!user) return;

    // Token aléatoire, imprévisible (crypto, pas Math.random qui n'est pas sécurisé)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Hash stocké en base — même principe qu'un mot de passe, jamais en clair
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await authRepository.updateUser(user._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
    });

    const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password?token=${rawToken}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev', // à remplacer par un domaine vérifié en prod
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p><a href="${resetUrl}">Cliquez ici pour définir un nouveau mot de passe</a></p>
            <p>Ce lien expire dans 15 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        `
    });
};



// Vérifie le token reçu (le hash, puis compare), applique le nouveau mot de passe,
// invalide le token (usage unique), révoque toutes les sessions actives.
const resetPassword = async (rawToken, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await authRepository.findByResetToken(hashedToken);
    if (!user) {
        const error = new Error('Lien de réinitialisation invalide ou expiré');
        error.statusCode = 400;
        throw error;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        const error = new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)');
        error.statusCode = 400;
        throw error;
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await authRepository.updateUser(user._id, {
        password: hashed,
        mustChangePassword: false,
        resetPasswordToken: null,       // token à usage unique — invalidé après utilisation
        resetPasswordExpiresAt: null
    });

    await refreshTokenRepository.deleteAllForUser(user._id);
};




module.exports = { login, logout, changePassword, refresh, getUserById, updateEmail, forgotPassword, resetPassword }