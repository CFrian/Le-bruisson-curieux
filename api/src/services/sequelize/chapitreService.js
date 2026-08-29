const chapitreRepository = require('../../repositories/sequelize/chapitreRepository');

function getChapitresByArticle(idArticle) {
    return chapitreRepository.findAllByArticle(idArticle);
}

async function getChapitreById(id) {
    const chapitre = await chapitreRepository.findById(id);
    if (!chapitre) {
        const err = new Error('Chapitre introuvable');
        err.status = 404;
        throw err;
    }
    return chapitre;
}

function validerDonnees(donnees) {
    if (donnees.ordreChap === undefined || donnees.ordreChap === null) {
        const err = new Error('L\'ordre du chapitre est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createChapitre(idArticle, donnees) {
    validerDonnees(donnees);
    return chapitreRepository.create(idArticle, donnees);
}

async function updateChapitre(id, donnees) {
    await getChapitreById(id);
    validerDonnees(donnees);
    return chapitreRepository.update(id, donnees);
}

async function deleteChapitre(id) {
    await getChapitreById(id);
    return chapitreRepository.remove(id);
}

module.exports = { getChapitresByArticle, getChapitreById, createChapitre, updateChapitre, deleteChapitre };