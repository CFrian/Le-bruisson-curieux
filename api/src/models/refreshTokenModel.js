// Stocke les refresh tokens actifs en base.
// À la déconnexion, le token est supprimé → il ne peut plus générer de nouvel access token.
// Protège contre le vol de session : un token révoqué devient immédiatement inutilisable.

const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' } // TTL index — suppression automatique après 7 jours
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens');
