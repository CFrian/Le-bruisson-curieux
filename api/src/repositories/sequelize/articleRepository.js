const { Article, Auteur, Categorie, Tag, Chapitre, Paragraphe, FicheInfo, Media } = require('../../models/sequelize');

function findAll() {
    return Article.findAll({
        include: [Auteur, Categorie, Tag],
        order: [['dateCreationArticle', 'DESC']],
    });
}

function findById(id) {
    return Article.findByPk(id, {
        include: [
            Auteur,
            Categorie,
            Tag,
            {
                model: Chapitre,
                include: [
                    { model: Paragraphe, separate: true, order: [['ordreParagraphe', 'ASC']] },
                    { model: Media, as: 'mediasChapitre' },
                ],
                separate: true,
                order: [['ordreChap', 'ASC']],
            },
            FicheInfo,
            { model: Media, as: 'mediasArticle' },
        ],
    });
}

function findBySlug(slug) {
    return Article.findOne({
        where: { slugArticle: slug },
        include: [
            Auteur,
            Categorie,
            Tag,
            {
                model: Chapitre,
                include: [
                    { model: Paragraphe, separate: true, order: [['ordreParagraphe', 'ASC']] },
                    { model: Media, as: 'mediasChapitre' },
                ],
                separate: true,
                order: [['ordreChap', 'ASC']],
            },
            FicheInfo,
            { model: Media, as: 'mediasArticle' },
        ],
    });
}

function create(donnees) {
    return Article.create(donnees);
}

async function update(id, donnees) {
    const [nbLignesModifiees] = await Article.update(donnees, { where: { idArticle: id } });
    return nbLignesModifiees;
}

function remove(id) {
    return Article.destroy({ where: { idArticle: id } });
}

module.exports = { findAll, findById, findBySlug, create, update, remove };