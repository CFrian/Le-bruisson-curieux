// Configure multer pour envoyer directement les fichiers reçus vers Cloudinary,
// sans jamais les écrire sur le disque du serveur (important : le système de fichiers
// de Render est éphémère, un stockage local serait perdu à chaque redéploiement).

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio', // dossier Cloudinary où seront rangés les fichiers
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'] // limite les types de fichiers acceptés
    }
});

const upload = multer({
    storage: storage,
    // Limite la taille max d'un fichier uploadé à 5 Mo.
    // Protège contre un abus (upload de fichiers énormes) même par un compte authentifié
    // compromis — évite une consommation excessive de la quota Cloudinary gratuite.
    limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo, en octets 
});

module.exports = upload;