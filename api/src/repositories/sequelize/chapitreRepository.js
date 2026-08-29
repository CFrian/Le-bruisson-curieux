const { Chapitre, Paragraphe, Media } = require('../../models/sequelize');

function findAllByArticle(idArticle) {
    return Chapitre.findAll({
        where: { idArticle },
        order: [['ordreChap', 'ASC']],
    });
}

function findById(id) {
    return Chapitre.findByPk(id, {
        include: [
            { model: Paragraphe, separate: true, order: [['ordreParagraphe', 'ASC']] },
            { model: Media, as: 'mediasChapitre' },
        ],
    });
}

function create(idArticle, donnees) {
    return Chapitre.create({ ...donnees, idArticle });
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await Chapitre.update(donnees, { where: { idChapitre: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return Chapitre.destroy({ where: { idChapitre: id } });
}

module.exports = { findAllByArticle, findById, create, update, remove };