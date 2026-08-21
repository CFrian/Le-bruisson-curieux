// Configure multer pour garder le fichier reçu en mémoire (buffer),
// jamais écrit sur le disque du serveur — cohérent avec le système de fichiers éphémère de Render.
//  C'est ensuite uploadRoute.js qui envoie ce buffer à Cloudinary via cloudinary.uploader.upload_stream().

const multer = require('multer');

// Formats d'image acceptés — vérifié via le mimetype envoyé par le navigateur
// avec le fichier (ex: "image/png", "image/jpeg").
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

// fileFilter : fonction appelée par multer pour chaque fichier reçu, AVANT
// de l'accepter. cb(null, true) = accepté, cb(new Error(...), false) = rejeté.
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WEBP, SVG.'), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
    fileFilter: fileFilter
});

module.exports = upload;