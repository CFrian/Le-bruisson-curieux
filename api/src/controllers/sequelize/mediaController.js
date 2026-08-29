const mediaService = require('../../services/sequelize/mediaService');

async function getAll(req, res, next) {
    try {
        let medias;
        if (req.params.idParagraphe) {
            medias = await mediaService.getMediasByParagraphe(req.params.idParagraphe);
        } else if (req.params.idChapitre) {
            medias = await mediaService.getMediasByChapitre(req.params.idChapitre);
        } else {
            medias = await mediaService.getMediasByArticle(req.params.idArticle);
        }
        res.status(200).json(medias);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const media = await mediaService.getMediaById(req.params.id);
        res.status(200).json(media);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const nouveauMedia = await mediaService.createMedia(
            req.params.idArticle,
            req.params.idChapitre,
            req.params.idParagraphe,
            req.body
        );
        res.status(201).json(nouveauMedia);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        await mediaService.updateMedia(req.params.id, req.body);
        res.status(200).json({ message: 'Média mis à jour' });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await mediaService.deleteMedia(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, remove };