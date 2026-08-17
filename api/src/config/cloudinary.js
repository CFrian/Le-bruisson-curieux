// Configuration de la connexion au service Cloudinary (stockage externe des images/sons).
// Ce fichier centralise l'initialisation — tous les uploads du projet passeront par cette instance.

const { v2: cloudinary } = require('cloudinary');
//{ v2: cloudinary } — le SDK Cloudinary expose une ancienne API (v1) et une nouvelle (v2), 
// j'importe explicitement la version 2, recommandée actuellement.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;