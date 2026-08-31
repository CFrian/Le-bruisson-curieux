const articleService = require('../../services/sequelize/articleService');

async function getAll(req, res, next) {
    try {
        const articles = await articleService.getAllArticles();
        res.status(200).json(articles);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const article = await articleService.getArticleById(req.params.id);
        res.status(200).json(article);
    } catch (err) {
        next(err);
    }
}

async function getBySlug(req, res, next) {
    try {
        const article = await articleService.getArticleBySlug(req.params.slug);
        res.status(200).json(article);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouvelArticle = await articleService.createArticle(req.body);
        res.status(201).json(nouvelArticle);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await articleService.updateArticle(req.params.id, req.body);
        res.status(200).json({ message: 'Article mis à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await articleService.deleteArticle(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

async function updateTags(req, res, next) {
    try {
        await articleService.syncTags(req.params.id, req.body.tagIds);
        res.status(200).json({ message: 'Tags synchronisés' });
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, getBySlug, create, update, remove, updateTags };

