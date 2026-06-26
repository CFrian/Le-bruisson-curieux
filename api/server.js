require('dotenv').config({ quiet: true })
const app = require('./src/app')
const connexionMongo = require('./src/config/mongo')

const PORT = process.env.PORT || 3000

const start = async () => {
    await connexionMongo()
    app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`))
}

start()