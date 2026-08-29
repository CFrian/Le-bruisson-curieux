const { Media } = require('../../models/sequelize');

function findAllByArticle(idArticle) {
    return Media.findAll({
        where: { idArticle, idChapitre: null, idParagraphe: null },
        order: [['ordreMedia', 'ASC']],
    });
}

function findAllByChapitre(idChapitre) {
    return Media.findAll({
        where: { idChapitre, idParagraphe: null },
        order: [['ordreMedia', 'ASC']],
    });
}

function findAllByParagraphe(idParagraphe) {
    return Media.findAll({
        where: { idParagraphe },
        order: [['ordreMedia', 'ASC']],
    });
}

function findById(id) {
    return Media.findByPk(id);
}

function create(donnees) {
    return Media.create(donnees);
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await Media.update(donnees, { where: { idMedia: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return Media.destroy({ where: { idMedia: id } });
}

module.exports = { findAllByArticle, findAllByChapitre, findAllByParagraphe, findById, create, update, remove };