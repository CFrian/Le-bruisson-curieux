const auteurRepository = require('../../repositories/sequelize/auteurRepository');
const { sanitize, throwValidationError } = require('../../utils/validators');

function getAllAuteurs() {
    return auteurRepository.findAll();
}

async function getAuteurById(id) {
    const auteur = await auteurRepository.findById(id);
    if (!auteur) throwValidationError('Auteur introuvable', 404);
    return auteur;
}

function sanitizeAndValidate(donnees) {
    const pseudo = sanitize(donnees.pseudo);
    const bio = sanitize(donnees.bio);

    if (!pseudo) throwValidationError('Le pseudo est obligatoire');

    return { pseudo, bio };
}

function createAuteur(donnees) {
    const clean = sanitizeAndValidate(donnees);
    return auteurRepository.create(clean);
}

async function updateAuteur(id, donnees) {
    await getAuteurById(id);
    const clean = sanitizeAndValidate(donnees);
    return auteurRepository.update(id, clean);
}

async function deleteAuteur(id) {
    await getAuteurById(id);
    return auteurRepository.remove(id);
}

module.exports = { getAllAuteurs, getAuteurById, createAuteur, updateAuteur, deleteAuteur };