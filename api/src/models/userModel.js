const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    mustChangePassword: { type: Boolean, default: true },
    tempPasswordExpireAt: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },      // hash du token de reset, jamais en clair
    resetPasswordExpiresAt: { type: Date, default: null }      // expiration du token (15 min après génération)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users')
