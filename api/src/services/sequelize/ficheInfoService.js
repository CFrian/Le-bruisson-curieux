const ficheInfoRepository = require('../../repositories/sequelize/ficheInfoRepository');

function getFicheInfosByArticle(idArticle) {
    return ficheInfoRepository.findAllByArticle(idArticle);
}

async function getFicheInfoById(id) {
    const ficheInfo = await ficheInfoRepository.findById(id);
    if (!ficheInfo) {
        const err = new Error('Fiche info introuvable');
        err.status = 404;
        throw err;
    }
    return ficheInfo;
}

function validerDonnees(donnees) {
    if (!donnees.cleFicheInfo || donnees.cleFicheInfo.trim() === '') {
        const err = new Error('La clé est obligatoire');
        err.status = 400;
        throw err;
    }
    if (!donnees.valeurFicheInfo || donnees.valeurFicheInfo.trim() === '') {
        const err = new Error('La valeur est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createFicheInfo(idArticle, donnees) {
    validerDonnees(donnees);
    return ficheInfoRepository.create(idArticle, donnees);
}

async function updateFicheInfo(id, donnees) {
    await getFicheInfoById(id);
    validerDonnees(donnees);
    return ficheInfoRepository.update(id, donnees);
}

async function deleteFicheInfo(id) {
    await getFicheInfoById(id);
    return ficheInfoRepository.remove(id);
}

module.exports = { getFicheInfosByArticle, getFicheInfoById, createFicheInfo, updateFicheInfo, deleteFicheInfo };