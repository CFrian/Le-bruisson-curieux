const auteurService = require('../../services/sequelize/auteurService');

async function getAll(_req, res, next) {
    try {
        const auteurs = await auteurService.getAllAuteurs();
        res.status(200).json(auteurs);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const auteur = await auteurService.getAuteurById(req.params.id);
        res.status(200).json(auteur);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouvelAuteur = await auteurService.createAuteur(req.body);
        res.status(201).json(nouvelAuteur);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await auteurService.updateAuteur(req.params.id, req.body);
        res.status(200).json({ message: 'Auteur mis à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await auteurService.deleteAuteur(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, remove };