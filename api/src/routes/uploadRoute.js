// Route générique d'upload de fichiers vers Cloudinary.
// Réutilisable pour toute image du site (projets, CV...) — le front envoie le fichier,
// cette route renvoie l'URL Cloudinary à stocker ensuite dans le document concerné
// (Project, CV...) via les routes PATCH/POST existantes.

const express = require('express');
const router = express.Router();
const upload = require('../config/multerCloudinary');
const requireAuth = require('../middlewares/requireAuth');

// upload.single('image') : attend un seul fichier, envoyé sous le nom de champ "image"
// dans le FormData depuis le front. Après ce middleware, req.file contient les infos
// du fichier uploadé (notamment son URL Cloudinary dans req.file.path).
router.post('/', requireAuth, upload.single('image'), (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('Aucun fichier reçu');
            error.statusCode = 400;
            throw error;
        }
        res.json({ url: req.file.path });
    } catch (err) {
        next(err);
    }
}, (err, req, res, next) => {
    // Gestionnaire d'erreur spécifique à multer (fichier trop volumineux, format refusé...)
    // Placé après la route car Express traite les erreurs des middlewares précédents
    // via cette signature à 4 paramètres (err en premier).
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Le fichier dépasse la taille maximale autorisée (5 Mo).' });
    }
    next(err);
});