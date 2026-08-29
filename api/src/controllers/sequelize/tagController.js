const tagService = require('../../services/sequelize/tagService');

async function getAll(_req, res, next) {
    try {
        const tags = await tagService.getAllTags();
        res.status(200).json(tags);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const tag = await tagService.getTagById(req.params.id);
        res.status(200).json(tag);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouveauTag = await tagService.createTag(req.body);
        res.status(201).json(nouveauTag);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await tagService.updateTag(req.params.id, req.body);
        res.status(200).json({ message: 'Tag mis à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await tagService.deleteTag(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, remove };