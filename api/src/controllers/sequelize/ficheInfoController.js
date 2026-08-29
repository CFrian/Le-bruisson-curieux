const ficheInfoService = require('../../services/sequelize/ficheInfoService');

async function getAllByArticle(req, res, next) {
    try {
        const fichesInfo = await ficheInfoService.getFicheInfosByArticle(req.params.idArticle);
        res.status(200).json(fichesInfo);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const ficheInfo = await ficheInfoService.getFicheInfoById(req.params.id);
        res.status(200).json(ficheInfo);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouvelleFicheInfo = await ficheInfoService.createFicheInfo(req.params.idArticle, req.body);
        res.status(201).json(nouvelleFicheInfo);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await ficheInfoService.updateFicheInfo(req.params.id, req.body);
        res.status(200).json({ message: 'Fiche info mise à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await ficheInfoService.deleteFicheInfo(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllByArticle, getById, create, update, remove };