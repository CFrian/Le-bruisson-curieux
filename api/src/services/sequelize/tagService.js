const tagRepository = require('../../repositories/sequelize/tagRepository');
const { isValidSlug, sanitize, throwValidationError } = require('../../utils/validators');

function getAllTags() {
    return tagRepository.findAll();
}

async function getTagById(id) {
    const tag = await tagRepository.findById(id);
    if (!tag) throwValidationError('Tag introuvable', 404);
    return tag;
}

// Nettoie et valide, renvoie les données prêtes à être enregistrées
function sanitizeAndValidate(donnees) {
    const nomTag = sanitize(donnees.nomTag);
    const slugTag = sanitize(donnees.slugTag);

    if (!nomTag) throwValidationError('Le nom du tag est obligatoire');
    if (!slugTag) throwValidationError('Le slug du tag est obligatoire');
    if (!isValidSlug(slugTag)) throwValidationError('Le slug ne doit contenir que des minuscules, chiffres et tirets');

    return { nomTag, slugTag };
}

function createTag(donnees) {
    const clean = sanitizeAndValidate(donnees);
    return tagRepository.create(clean);
}

async function updateTag(id, donnees) {
    await getTagById(id);
    const clean = sanitizeAndValidate(donnees);
    return tagRepository.update(id, clean);
}

async function deleteTag(id) {
    await getTagById(id);
    const nbArticles = await tagRepository.countArticles(id);
    if (nbArticles > 0) {
        const err = new Error(`Ce tag est utilisé par ${nbArticles} article(s). Retire-le de ces articles avant de le supprimer.`);
        err.statusCode = 409;
        throw err;
    }
    return tagRepository.remove(id);
}

module.exports = { getAllTags, getTagById, createTag, updateTag, deleteTag };