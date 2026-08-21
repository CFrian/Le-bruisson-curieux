// Gère la logique de connexion : vérification email/password,
// génération des tokens JWT, et changement de mot de passe.

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authRepository = require('../repositories/authRepository')
const refreshTokenRepository = require('../repositories/refreshTokenRepository');


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


module.exports = { login, logout, changePassword, refresh, getUserById, updateEmail }