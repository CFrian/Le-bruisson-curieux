// Middleware de protection des routes sensibles.
// Vérifie que l'access token JWT est présent et valide dans les cookies.
// Si OK → ajoute req.user avec l'id de l'admin et passe à la suite.
// Si !OK → bloque la requête avec une erreur 401.

const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.accessToken

        if (!token) {
            const error = new Error('Accès non autorisé')
            error.statusCode = 401
            throw error
        }

        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { id: decodedJwt.id }
        next()
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            err.statusCode = 401
            err.message = 'Token invalide'
        }
        next(err)
    }
}

module.exports = requireAuth