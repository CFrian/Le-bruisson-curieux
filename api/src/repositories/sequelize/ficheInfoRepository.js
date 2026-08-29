const { FicheInfo } = require('../../models/sequelize');

function findAllByArticle(idArticle) {
    return FicheInfo.findAll({
        where: { idArticle },
        order: [['ordreFicheInfo', 'ASC']],
    });
}

function findById(id) {
    return FicheInfo.findByPk(id);
}

function create(idArticle, donnees) {
    return FicheInfo.create({ ...donnees, idArticle });
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await FicheInfo.update(donnees, { where: { idFicheInfo: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return FicheInfo.destroy({ where: { idFicheInfo: id } });
}

module.exports = { findAllByArticle, findById, create, update, remove };