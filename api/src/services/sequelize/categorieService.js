const categorieRepository = require('../../repositories/sequelize/categorieRepository');
const { isValidSlug, sanitize, throwValidationError } = require('../../utils/validators');

function getAllCategories() {
    return categorieRepository.findAll();
}

async function getCategorieById(id) {
    const categorie = await categorieRepository.findById(id);
    if (!categorie) throwValidationError('Catégorie introuvable', 404);
    return categorie;
}

function sanitizeAndValidate(donnees) {
    const nomCategorie = sanitize(donnees.nomCategorie);
    const slugCategorie = sanitize(donnees.slugCategorie);

    if (!nomCategorie) throwValidationError('Le nom de la catégorie est obligatoire');
    if (!slugCategorie) throwValidationError('Le slug de la catégorie est obligatoire');
    if (!isValidSlug(slugCategorie)) throwValidationError('Le slug ne doit contenir que des minuscules, chiffres et tirets');

    return { nomCategorie, slugCategorie };
}

function createCategorie(donnees) {
    const clean = sanitizeAndValidate(donnees);
    return categorieRepository.create(clean);
}

async function updateCategorie(id, donnees) {
    await getCategorieById(id);
    const clean = sanitizeAndValidate(donnees);
    return categorieRepository.update(id, clean);
}

async function deleteCategorie(id) {
    await getCategorieById(id);
    const nbArticles = await categorieRepository.countArticles(id);
    if (nbArticles > 0) {
        const err = new Error(`Cette catégorie est utilisée par ${nbArticles} article(s). Retire-la de ces articles avant de la supprimer.`);
        err.statusCode = 409;
        throw err;
    }
    return categorieRepository.remove(id);
}

module.exports = { getAllCategories, getCategorieById, createCategorie, updateCategorie, deleteCategorie };