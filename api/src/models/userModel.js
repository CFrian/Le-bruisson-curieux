const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    mustChangePassword: { type: Boolean, default: true },
    tempPasswordExpireAt: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users')
