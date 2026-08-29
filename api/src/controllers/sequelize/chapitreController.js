const chapitreService = require('../../services/sequelize/chapitreService');

async function getAllByArticle(req, res, next) {
    try {
        const chapitres = await chapitreService.getChapitresByArticle(req.params.idArticle);
        res.status(200).json(chapitres);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const chapitre = await chapitreService.getChapitreById(req.params.id);
        res.status(200).json(chapitre);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouveauChapitre = await chapitreService.createChapitre(req.params.idArticle, req.body);
        res.status(201).json(nouveauChapitre);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await chapitreService.updateChapitre(req.params.id, req.body);
        res.status(200).json({ message: 'Chapitre mis à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await chapitreService.deleteChapitre(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllByArticle, getById, create, update, remove };