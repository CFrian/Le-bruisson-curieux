const categorieService = require('../../services/sequelize/categorieService');

async function getAll(_req, res, next) {
    try {
        const categories = await categorieService.getAllCategories();
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const categorie = await categorieService.getCategorieById(req.params.id);
        res.status(200).json(categorie);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouvelleCategorie = await categorieService.createCategorie(req.body);
        res.status(201).json(nouvelleCategorie);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await categorieService.updateCategorie(req.params.id, req.body);
        res.status(200).json({ message: 'Catégorie mise à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await categorieService.deleteCategorie(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, remove };