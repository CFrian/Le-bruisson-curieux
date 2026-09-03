const ficheInfoRepository = require('../../repositories/sequelize/ficheInfoRepository');
const { sanitize, throwValidationError } = require('../../utils/validators');

function getFicheInfosByArticle(idArticle) {
    return ficheInfoRepository.findAllByArticle(idArticle);
}

async function getFicheInfoById(id) {
    const ficheInfo = await ficheInfoRepository.findById(id);
    if (!ficheInfo) throwValidationError('Fiche info introuvable', 404);
    return ficheInfo;
}

function sanitizeAndValidate(donnees) {
    const cleFicheInfo = sanitize(donnees.cleFicheInfo);
    const valeurFicheInfo = sanitize(donnees.valeurFicheInfo);

    if (!cleFicheInfo) throwValidationError('La clé est obligatoire');
    if (!valeurFicheInfo) throwValidationError('La valeur est obligatoire');

    return { cleFicheInfo, valeurFicheInfo, ordreFicheInfo: donnees.ordreFicheInfo };
}

function createFicheInfo(idArticle, donnees) {
    const clean = sanitizeAndValidate(donnees);
    return ficheInfoRepository.create(idArticle, clean);
}

async function updateFicheInfo(id, donnees) {
    await getFicheInfoById(id);
    const clean = sanitizeAndValidate(donnees);
    return ficheInfoRepository.update(id, clean);
}

async function deleteFicheInfo(id) {
    await getFicheInfoById(id);
    return ficheInfoRepository.remove(id);
}

module.exports = { getFicheInfosByArticle, getFicheInfoById, createFicheInfo, updateFicheInfo, deleteFicheInfo };