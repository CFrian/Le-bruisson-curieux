const articleRepository = require('../../repositories/sequelize/articleRepository');
const { isValidSlug, sanitize, throwValidationError } = require('../../utils/validators');

function getAllArticles() {
    return articleRepository.findAll();
}

async function getArticleById(id) {
    const article = await articleRepository.findById(id);
    if (!article) throwValidationError('Article introuvable', 404);
    return article;
}

async function getArticleBySlug(slug) {
    const article = await articleRepository.findBySlug(slug);
    if (!article) throwValidationError('Article introuvable', 404);
    return article;
}

function sanitizeAndValidate(donnees) {
    const titreArticle = sanitize(donnees.titreArticle);
    const slugArticle = sanitize(donnees.slugArticle);
    const extraitArticle = sanitize(donnees.extraitArticle);
    const contenuIntroArticle = sanitize(donnees.contenuIntroArticle);
    const motDeLaFinArticle = sanitize(donnees.motDeLaFinArticle);

    if (!titreArticle) throwValidationError('Le titre est obligatoire');
    if (!slugArticle) throwValidationError('Le slug est obligatoire');
    if (!isValidSlug(slugArticle)) throwValidationError('Le slug ne doit contenir que des minuscules, chiffres et tirets');
    if (!extraitArticle) throwValidationError('L\'extrait est obligatoire');

    return {
        ...donnees,
        titreArticle,
        slugArticle,
        extraitArticle,
        contenuIntroArticle,
        motDeLaFinArticle,
    };
}

function createArticle(donnees) {
    const clean = sanitizeAndValidate(donnees);
    return articleRepository.create(clean);
}

async function updateArticle(id, donnees) {
    await getArticleById(id);
    const clean = sanitizeAndValidate(donnees);
    return articleRepository.update(id, clean);
}

async function deleteArticle(id) {
    await getArticleById(id);
    return articleRepository.remove(id);
}

async function syncTags(idArticle, tagIds) {
    const article = await articleRepository.setTags(idArticle, tagIds);
    if (!article) throwValidationError('Article introuvable', 404);
    return article;
}

module.exports = { getAllArticles, getArticleById, getArticleBySlug, createArticle, updateArticle, deleteArticle, syncTags };