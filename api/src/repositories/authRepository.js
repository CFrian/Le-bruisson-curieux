//ce fichier cherche un utilisateur par email ou par id, et permet de mettre à jour ses données (nous on cherche mustChangePassword) en ciblant le document via son id.
const User = require('../models/userModel')

const findByEmail = (email) => User.findOne({ email })
const findById = (id) => User.findById(id)
const updateUser = (id, data) => User.findByIdAndUpdate(
    id,
    { $set: data },
    { returnDocument: 'after', runValidator: true }
)

module.exports = { findByEmail, findById, updateUser }