const chapitreRepository = require('../../repositories/sequelize/chapitreRepository');
const { sanitize, throwValidationError } = require('../../utils/validators');

function getChapitresByArticle(idArticle) {
    return chapitreRepository.findAllByArticle(idArticle);
}

async function getChapitreById(id) {
    const chapitre = await chapitreRepository.findById(id);
    if (!chapitre) throwValidationError('Chapitre introuvable', 404);
    return chapitre;
}

function sanitizeAndValidate(donnees) {
    const titreChap = sanitize(donnees.titreChap);

    if (donnees.ordreChap === undefined || donnees.ordreChap === null) {
        throwValidationError('L\'ordre du chapitre est obligatoire');
    }
    if (!Number.isInteger(donnees.ordreChap) || donnees.ordreChap < 1) {
        throwValidationError('L\'ordre du chapitre doit être un nombre entier supérieur ou égal à 1');
    }

    return { titreChap, ordreChap: donnees.ordreChap };
}

async function createChapitre(idArticle, donnees) {
    const clean = sanitizeAndValidate(donnees);

    const existant = await chapitreRepository.findByArticleAndOrdre(idArticle, clean.ordreChap);
    if (existant) {
        const err = new Error(`Un chapitre avec l'ordre ${clean.ordreChap} existe déjà pour cet article.`);
        err.statusCode = 409;
        throw err;
    }

    return chapitreRepository.create(idArticle, clean);
}

async function updateChapitre(id, donnees) {
    await getChapitreById(id);
    const clean = sanitizeAndValidate(donnees);
    return chapitreRepository.update(id, clean);
}

async function deleteChapitre(id) {
    await getChapitreById(id);
    return chapitreRepository.remove(id);
}

module.exports = { getChapitresByArticle, getChapitreById, createChapitre, updateChapitre, deleteChapitre };