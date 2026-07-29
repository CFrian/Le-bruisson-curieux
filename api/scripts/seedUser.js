require('dotenv').config({ quiet: true })
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../src/models/userModel')

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI)

    //supprime l'admin existant pour éviter les doublons
    await User.deleteMany({})

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) //Nombre de fois que bcrypt applique son algorithme de hachage

    await User.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
    })

    console.log('Profil admin créé avec succès')
    await mongoose.disconnect()
}

seed()

