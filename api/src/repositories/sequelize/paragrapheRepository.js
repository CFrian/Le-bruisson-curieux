const { Paragraphe, Media } = require('../../models/sequelize');

function findAllByChapitre(idChapitre) {
    return Paragraphe.findAll({
        where: { idChapitre },
        order: [['ordreParagraphe', 'ASC']],
    });
}

function findById(id) {
    return Paragraphe.findByPk(id, {
        include: [{ model: Media, as: 'mediasParagraphe' }],
    });
}

function create(idChapitre, donnees) {
    return Paragraphe.create({ ...donnees, idChapitre });
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await Paragraphe.update(donnees, { where: { idParagraphe: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return Paragraphe.destroy({ where: { idParagraphe: id } });
}

module.exports = { findAllByChapitre, findById, create, update, remove };