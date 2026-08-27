require('dotenv').config({ quiet: true })
const connexionMongo = require('./src/config/mongo')
const app = require('./src/app')

const PORT = process.env.PORT || 3000

const sequelize = require('./src/config/sequelize/mysql');

sequelize.authenticate()
    .then(() => console.log('MySQL connecté'))
    .catch((err) => console.error('Erreur connexion MySQL :', err.message));

const start = async () => {
    await connexionMongo()
    app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`))
}

start()