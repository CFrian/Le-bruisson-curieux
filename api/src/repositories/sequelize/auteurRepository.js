const { Auteur } = require('../../models/sequelize');

function findAll() {
    return Auteur.findAll({ order: [['pseudo', 'ASC']] });
}

function findById(id) {
    return Auteur.findByPk(id);
}

function create(donnees) {
    return Auteur.create(donnees);
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await Auteur.update(donnees, { where: { idAuteur: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return Auteur.destroy({ where: { idAuteur: id } });
}

module.exports = { findAll, findById, create, update, remove };