// Gère la logique de connexion : vérification email/password,
// génération des tokens JWT, et changement de mot de passe.

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authRepository = require('../repositories/authRepository')


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

    return {
        accessToken,
        refreshToken,
        mustChangePassword: user.mustChangePassword
    }
}

// Change le mot de passe et désactive le flag mustChangePassword
const changePassword = async (userId, newPassword) => {
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
}

module.exports = { login, changePassword }