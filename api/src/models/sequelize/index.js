//Fichier central qui importe tous les modèles et déclare leurs relations

const Article = require('./articleModel');
const Auteur = require('./auteurModel');
const Categorie = require('./categorieModel');
const Tag = require('./tagModel')
const Chapitre = require('./chapitreModel');
const Paragraphe = require('./paragrapheModel');
const FicheInfo = require('./ficheInfoModel');
const Media = require('./mediaModel');

// ARTICLE (1,1) appartient à AUTEUR => FK auteur_id sur ARTICLE
Article.belongsTo(Auteur, { foreignKey: 'idAuteur' });
Auteur.hasMany(Article, { foreignKey: 'idAuteur' });

// ARTICLE (1,1) appartient à CATEGORIE => FK id_categorie sur ARTICLE
Article.belongsTo(Categorie, { foreignKey: 'idCategorie' });
Categorie.hasMany(Article, { foreignKey: 'idCategorie' });

// ARTICLE (0,n) <> (0,n) TAG, via la table de joinction concerne
Article.belongsToMany(Tag, {
    through: 'concerne',
    // indique à Sequelize d'utiliser la table concerne existante comme table pivot 
    // il n'a pas besoin qu'elle soit "modélisée" formellement, 
    // juste de connaître son nom et les deux colonnes de jointure 
    // (idArticle/idTag, mappées automatiquement vers id_article/id_tag grâce à underscored).
    foreignKey: 'idArticle',
    otherKey: 'idTag',
    timestamps: false,
});

Tag.belongsToMany(Article, {
    through: 'concerne',
    foreignKey: 'idTag',
    otherKey: 'idArticle',
    timestamps: false,
});

// ARTICLE (1,1) -- DECOUPER_EN -- (0,n) CHAPITRE
Article.hasMany(Chapitre, { foreignKey: 'idArticle' });
Chapitre.belongsTo(Article, { foreignKey: 'idArticle' });

// CHAPITRE (1,1) -- CONTENIR -- (0,n) PARAGRAPHE
Chapitre.hasMany(Paragraphe, { foreignKey: 'idChapitre' });
Paragraphe.belongsTo(Chapitre, { foreignKey: 'idChapitre' });

// ARTICLE (1,1) ── DETAILLER ── (0,n) FICHE_INFO
Article.hasMany(FicheInfo, { foreignKey: 'idArticle' });
FicheInfo.belongsTo(Article, { foreignKey: 'idArticle' });

// MEDIA — 3 rattachements, chacun avec un alias distinct
Article.hasMany(Media, { foreignKey: 'idArticle', as: 'mediasArticle' });
Media.belongsTo(Article, { foreignKey: 'idArticle', as: 'article' });

Chapitre.hasMany(Media, { foreignKey: 'idChapitre', as: 'mediasChapitre' });
Media.belongsTo(Chapitre, { foreignKey: 'idChapitre', as: 'chapitre' });

Paragraphe.hasMany(Media, { foreignKey: 'idParagraphe', as: 'mediasParagraphe' });
Media.belongsTo(Paragraphe, { foreignKey: 'idParagraphe', as: 'paragraphe' });

module.exports = { Article, Auteur, Categorie, Tag, Chapitre, Paragraphe, FicheInfo, Media };