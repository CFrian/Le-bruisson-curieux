//ce fichier cherche un utilisateur par email ou par id, et permet de mettre à jour ses données (nous on cherche mustChangePassword) en ciblant le document via son id.
const User = require('../models/userModel')

const findByEmail = (email) => User.findOne({ email })
const findById = (id) => User.findById(id)
const updateUser = (id, data) => User.findByIdAndUpdate(
    id,
    { $set: data },
    { returnDocument: 'after', runValidator: true }
)
// Retrouve un utilisateur via son token de reset (hashé), utilisé lors de la
// confirmation du reset — le token en clair reçu du front est d'abord hashé,
// puis comparé à ce qui est stocké en base.
const findByResetToken = (hashedToken) => User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiresAt: { $gt: Date.now() } // ne retrouve que si le token n'est pas expiré
});

module.exports = { findByEmail, findById, updateUser, findByResetToken }