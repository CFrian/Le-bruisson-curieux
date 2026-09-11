const multer = require('multer');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

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