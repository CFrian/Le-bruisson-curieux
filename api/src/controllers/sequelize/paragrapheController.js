const paragrapheService = require('../../services/sequelize/paragrapheService');

async function getAllByChapitre(req, res, next) {
    try {
        const paragraphes = await paragrapheService.getParagraphesByChapitre(req.params.idChapitre);
        res.status(200).json(paragraphes);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const paragraphe = await paragrapheService.getParagrapheById(req.params.id);
        res.status(200).json(paragraphe);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouveauParagraphe = await paragrapheService.createParagraphe(req.params.idChapitre, req.body);
        res.status(201).json(nouveauParagraphe);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await paragrapheService.updateParagraphe(req.params.id, req.body);
        res.status(200).json({ message: 'Paragraphe mis à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await paragrapheService.deleteParagraphe(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllByChapitre, getById, create, update, remove };