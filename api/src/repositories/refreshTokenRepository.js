const RefreshToken = require('../models/refreshTokenModel');

// Sauvegarde un nouveau refresh token en base
const save = (token, userId) => RefreshToken.create({ token, user: userId });

// Vérifie qu'un refresh token existe en base (non révoqué)
const findToken = (token) => RefreshToken.findOne({ token });

// Supprime le refresh token à la déconnexion
const deleteToken = (token) => RefreshToken.deleteOne({ token });

// Supprime tous les tokens d'un utilisateur (déconnexion totale)
const deleteAllForUser = (userId) => RefreshToken.deleteMany({ user: userId });

module.exports = { save, findToken, deleteToken, deleteAllForUser };