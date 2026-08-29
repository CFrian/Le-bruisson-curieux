const articleRepository = require('../../repositories/sequelize/articleRepository');

function getAllArticles() {
    return articleRepository.findAll();
}

async function getArticleById(id) {
    const article = await articleRepository.findById(id);
    if (!article) {
        const err = new Error('Article introuvable');
        err.status = 404;
        throw err;
    }
    return article;
}

async function getArticleBySlug(slug) {
    const article = await articleRepository.findBySlug(slug);
    if (!article) {
        const err = new Error('Article introuvable');
        err.status = 404;
        throw err;
    }
    return article;
}

function validerDonnees(donnees) {
    if (!donnees.titreArticle || donnees.titreArticle.trim() === '') {
        const err = new Error('Le titre est obligatoire');
        err.status = 400;
        throw err;
    }
    if (!donnees.slugArticle || donnees.slugArticle.trim() === '') {
        const err = new Error('Le slug est obligatoire');
        err.status = 400;
        throw err;
    }
    if (!donnees.extraitArticle || donnees.extraitArticle.trim() === '') {
        const err = new Error('L\'extrait est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createArticle(donnees) {
    validerDonnees(donnees);
    return articleRepository.create(donnees);
}

async function updateArticle(id, donnees) {
    await getArticleById(id); // vérifie l'existence, sinon lève 404
    validerDonnees({ ...donnees });
    return articleRepository.update(id, donnees);
}

async function deleteArticle(id) {
    await getArticleById(id);
    return articleRepository.remove(id);
}

module.exports = { getAllArticles, getArticleById, getArticleBySlug, createArticle, updateArticle, deleteArticle };