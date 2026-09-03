const mediaRepository = require('../../repositories/sequelize/mediaRepository');
const { isValidUrl, sanitize, throwValidationError } = require('../../utils/validators');

function getMediasByArticle(idArticle) {
    return mediaRepository.findAllByArticle(idArticle);
}

function getMediasByChapitre(idChapitre) {
    return mediaRepository.findAllByChapitre(idChapitre);
}

function getMediasByParagraphe(idParagraphe) {
    return mediaRepository.findAllByParagraphe(idParagraphe);
}

async function getMediaById(id) {
    const media = await mediaRepository.findById(id);
    if (!media) throwValidationError('Média introuvable', 404);
    return media;
}

function sanitizeAndValidate(donnees) {
    const urlMedia = sanitize(donnees.urlMedia);
    const legendeMedia = sanitize(donnees.legendeMedia);

    if (!donnees.typeMedia || !['image', 'video', 'audio'].includes(donnees.typeMedia)) {
        throwValidationError('Le type de média doit être image, video ou audio');
    }
    if (!urlMedia) throwValidationError('L\'URL du média est obligatoire');
    if (!isValidUrl(urlMedia)) {
        throwValidationError('L\'URL du média doit être une adresse http(s) valide ou un chemin /uploads/...');
    }
    if (donnees.ordreMedia === undefined || donnees.ordreMedia === null) {
        throwValidationError('L\'ordre du média est obligatoire');
    }
    if (!Number.isInteger(donnees.ordreMedia) || donnees.ordreMedia < 1) {
        throwValidationError('L\'ordre du média doit être un nombre entier supérieur ou égal à 1');
    }

    return {
        typeMedia: donnees.typeMedia,
        urlMedia,
        legendeMedia,
        ordreMedia: donnees.ordreMedia,
        timecodeSecondesMedia: donnees.timecodeSecondesMedia ?? null,
    };
}

function createMedia(idArticle, idChapitre, idParagraphe, donnees) {
    const clean = sanitizeAndValidate(donnees);
    return mediaRepository.create({
        ...clean,
        idArticle,
        idChapitre: idChapitre || null,
        idParagraphe: idParagraphe || null,
    });
}

async function updateMedia(id, donnees) {
    await getMediaById(id);
    const clean = sanitizeAndValidate(donnees);
    return mediaRepository.update(id, clean);
}

async function deleteMedia(id) {
    await getMediaById(id);
    return mediaRepository.remove(id);
}

module.exports = {
    getMediasByArticle,
    getMediasByChapitre,
    getMediasByParagraphe,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
};