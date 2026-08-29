const paragrapheRepository = require('../../repositories/sequelize/paragrapheRepository');

function getParagraphesByChapitre(idChapitre) {
    return paragrapheRepository.findAllByChapitre(idChapitre);
}

async function getParagrapheById(id) {
    const paragraphe = await paragrapheRepository.findById(id);
    if (!paragraphe) {
        const err = new Error('Paragraphe introuvable');
        err.status = 404;
        throw err;
    }
    return paragraphe;
}

function validerDonnees(donnees) {
    if (donnees.ordreParagraphe === undefined || donnees.ordreParagraphe === null) {
        const err = new Error('L\'ordre du paragraphe est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createParagraphe(idChapitre, donnees) {
    validerDonnees(donnees);
    return paragrapheRepository.create(idChapitre, donnees);
}

async function updateParagraphe(id, donnees) {
    await getParagrapheById(id);
    validerDonnees(donnees);
    return paragrapheRepository.update(id, donnees);
}

async function deleteParagraphe(id) {
    await getParagrapheById(id);
    return paragrapheRepository.remove(id);
}

module.exports = { getParagraphesByChapitre, getParagrapheById, createParagraphe, updateParagraphe, deleteParagraphe };