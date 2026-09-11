// Utilitaires de validation/sanitation, réutilisés par tous les services Sequelize.

// Slug : uniquement minuscules, chiffres, tirets — jamais d'espace, de majuscule ou d'accent.
function isValidSlug(slug) {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

// URL : http(s) valide, ou chemin local d'upload commençant par /uploads/
function isValidUrl(url) {
    const isHttpUrl = /^https?:\/\/.+/i.test(url);
    const isLocalUploadPath = /^\/uploads\/.+/.test(url);
    return isHttpUrl || isLocalUploadPath;
}

function sanitize(value) {
    return (value || '').trim();
}

function throwValidationError(message, statusCode = 400) {
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err;
}

module.exports = { isValidSlug, isValidUrl, sanitize, throwValidationError };
