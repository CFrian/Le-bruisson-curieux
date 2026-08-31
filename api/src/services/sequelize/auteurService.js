const auteurRepository = require('../../repositories/sequelize/auteurRepository');

function getAllAuteurs() {
    return auteurRepository.findAll();
}

async function getAuteurById(id) {
    const auteur = await auteurRepository.findById(id);
    if (!auteur) {
        const err = new Error('Auteur introuvable');
        err.status = 404;
        throw err;
    }
    return auteur;
}

function validerDonnees(donnees) {
    if (!donnees.pseudo || donnees.pseudo.trim() === '') {
        const err = new Error('Le pseudo est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createAuteur(donnees) {
    validerDonnees(donnees);
    return auteurRepository.create(donnees);
}

async function updateAuteur(id, donnees) {
    await getAuteurById(id);
    validerDonnees(donnees);
    return auteurRepository.update(id, donnees);
}

async function deleteAuteur(id) {
    await getAuteurById(id);
    return auteurRepository.remove(id);
}

module.exports = { getAllAuteurs, getAuteurById, createAuteur, updateAuteur, deleteAuteur };