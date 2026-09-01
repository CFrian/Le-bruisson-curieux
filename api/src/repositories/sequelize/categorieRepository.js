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

async function countArticles(idCategorie) {
    const categorie = await Categorie.findByPk(idCategorie);
    if (!categorie) return 0;
    return categorie.countArticles(); // méthode générée par hasMany
}

module.exports = { findAll, findById, create, update, remove, countArticles };
