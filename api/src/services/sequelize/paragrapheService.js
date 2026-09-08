const paragrapheRepository = require('../../repositories/sequelize/paragrapheRepository');
const { sanitize, throwValidationError } = require('../../utils/validators');

function getParagraphesByChapitre(idChapitre) {
    return paragrapheRepository.findAllByChapitre(idChapitre);
}

async function getParagrapheById(id) {
    const paragraphe = await paragrapheRepository.findById(id);
    if (!paragraphe) throwValidationError('Paragraphe introuvable', 404);
    return paragraphe;
}

function sanitizeAndValidate(donnees) {
    const contenuParagraphe = sanitize(donnees.contenuParagraphe);
    const titreParagraphe = sanitize(donnees.titreParagraphe);

    if (!contenuParagraphe) throwValidationError('Le contenu du paragraphe est obligatoire');
    if (donnees.ordreParagraphe === undefined || donnees.ordreParagraphe === null) {
        throwValidationError('L\'ordre du paragraphe est obligatoire');
    }
    if (!Number.isInteger(donnees.ordreParagraphe) || donnees.ordreParagraphe < 1) {
        throwValidationError('L\'ordre du paragraphe doit être un nombre entier supérieur ou égal à 1');
    }

    return { contenuParagraphe, titreParagraphe, ordreParagraphe: donnees.ordreParagraphe };
}

async function createParagraphe(idChapitre, donnees) {
    const clean = sanitizeAndValidate(donnees);

    const existant = await paragrapheRepository.findByChapitreAndOrdre(idChapitre, clean.ordreParagraphe);
    if (existant) {
        const err = new Error(`Un paragraphe avec l'ordre ${clean.ordreParagraphe} existe déjà pour ce chapitre.`);
        err.statusCode = 409;
        throw err;
    }

    return paragrapheRepository.create(idChapitre, clean);
}

async function updateParagraphe(id, donnees) {
    await getParagrapheById(id);
    const clean = sanitizeAndValidate(donnees);
    return paragrapheRepository.update(id, clean);
}

async function deleteParagraphe(id) {
    await getParagrapheById(id);
    return paragrapheRepository.remove(id);
}

module.exports = { getParagraphesByChapitre, getParagrapheById, createParagraphe, updateParagraphe, deleteParagraphe };