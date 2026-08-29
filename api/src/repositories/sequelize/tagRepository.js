const { Tag } = require('../../models/sequelize');

function findAll() {
    return Tag.findAll({ order: [['nomTag', 'ASC']] });
}

function findById(id) {
    return Tag.findByPk(id);
}

function create(donnees) {
    return Tag.create(donnees);
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await Tag.update(donnees, { where: { idTag: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return Tag.destroy({ where: { idTag: id } });
}

module.exports = { findAll, findById, create, update, remove };