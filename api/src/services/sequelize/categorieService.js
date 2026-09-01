const categorieRepository = require('../../repositories/sequelize/categorieRepository');

function getAllCategories() {
    return categorieRepository.findAll();
}

async function getCategorieById(id) {
    const categorie = await categorieRepository.findById(id);
    if (!categorie) {
        const err = new Error('Catégorie introuvable');
        err.status = 404;
        throw err;
    }
    return categorie;
}

function validerDonnees(donnees) {
    if (!donnees.nomCategorie || donnees.nomCategorie.trim() === '') {
        const err = new Error('Le nom de la catégorie est obligatoire');
        err.status = 400;
        throw err;
    }
    if (!donnees.slugCategorie || donnees.slugCategorie.trim() === '') {
        const err = new Error('Le slug de la catégorie est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createCategorie(donnees) {
    validerDonnees(donnees);
    return categorieRepository.create(donnees);
}

async function updateCategorie(id, donnees) {
    await getCategorieById(id);
    validerDonnees(donnees);
    return categorieRepository.update(id, donnees);
}

async function deleteCategorie(id) {
    await getCategorieById(id);

    const nbArticles = await categorieRepository.countArticles(id);
    if (nbArticles > 0) {
        const err = new Error(`Cette catégorie est utilisée par ${nbArticles} article(s). Retire-la de ces articles avant de la supprimer.`);
        err.status = 409;
        throw err;
    }

    return categorieRepository.remove(id);
}

module.exports = { getAllCategories, getCategorieById, createCategorie, updateCategorie, deleteCategorie };