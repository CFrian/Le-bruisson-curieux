const { Categorie } = require('../../models/sequelize');

function findAll() {
    return Categorie.findAll({ order: [['nomCategorie', 'ASC']] });
}

function findById(id) {
    return Categorie.findByPk(id);
}

function create(donnees) {
    return Categorie.create(donnees);
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await Categorie.update(donnees, { where: { idCategorie: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return Categorie.destroy({ where: { idCategorie: id } });
}

module.exports = { findAll, findById, create, update, remove };