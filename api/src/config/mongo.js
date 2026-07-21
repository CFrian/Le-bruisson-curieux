const mongoose = require('mongoose');

const connexionMongo = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB est connecté')
};

module.exports = connexionMongo;