
// Route générique d'upload de fichiers vers Cloudinary.

// N'utilise PAS multer-storage-cloudinary (package abandonné, incompatible avec
// cloudinary v2 — voir points de compréhension). À la place : multer garde le fichier
// en mémoire (buffer), puis on l'envoie nous-mêmes à Cloudinary via upload_stream().

const express = require('express');
const router = express.Router();
const upload = require('../config/multerCloudinary');
const cloudinary = require('../config/cloudinary')
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, upload.single('image'), (req, res, next) => {
    if (!req.file) {
        const error = new Error('Aucun fichier reçu');
        error.statusCode = 400;
        return next(error);
    }

    // upload_stream envoie le buffer directement à Cloudinary, sans jamais
    // l'écrire sur le disque du serveur. Le callback (error, result) est appelé
    // une fois l'upload terminé côté Cloudinary.
    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio' },
        (error, result) => {
            if (error) return next(error);
            res.json({ url: result.secure_url, publicId: result.public_id });
        }
    );

    // .end() envoie le buffer dans le stream et déclenche l'upload
    uploadStream.end(req.file.buffer);

}, (err, req, res, next) => {
    // Gestionnaire d'erreur spécifique à multer (taille, format refusé).
    // Signature à 4 paramètres obligatoire pour qu'Express le reconnaisse comme un middleware d'erreur.
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Le fichier dépasse la taille maximale autorisée (5 Mo).' });
    }
    if (err.message?.includes('Format de fichier non autorisé')) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = router;