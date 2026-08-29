const mediaRepository = require('../../repositories/sequelize/mediaRepository');

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
    if (!media) {
        const err = new Error('Média introuvable');
        err.status = 404;
        throw err;
    }
    return media;
}

function validerDonnees(donnees) {
    if (!donnees.typeMedia || !['image', 'video', 'audio'].includes(donnees.typeMedia)) {
        const err = new Error('Type de média accepté : image, video ou audio');
        err.status = 400;
        throw err;
    }
    if (!donnees.urlMedia || donnees.urlMedia.trim() === '') {
        const err = new Error('L\'URL du média est obligatoire');
        err.status = 400;
        throw err;
    }
    if (donnees.ordreMedia === undefined || donnees.ordreMedia === null) {
        const err = new Error('L\'ordre du média est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createMedia(idArticle, idChapitre, idParagraphe, donnees) {
    validerDonnees(donnees);
    return mediaRepository.create({
        ...donnees,
        idArticle,
        idChapitre: idChapitre || null,
        idParagraphe: idParagraphe || null,
    });
}

async function updateMedia(id, donnees) {
    await getMediaById(id);
    validerDonnees(donnees);
    return mediaRepository.update(id, donnees);
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