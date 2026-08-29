const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const Article = sequelize.define('Article', {
  idArticle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titreArticle: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  slugArticle: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  extraitArticle: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  contenuIntroArticle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dureeLectureArticle: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  statutArticle: {
    type: DataTypes.ENUM('brouillon', 'publié'),
    allowNull: false,
    defaultValue: 'brouillon',
  },
  dateCreationArticle: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  datePublicationArticle: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dateMajArticle: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  motDeLaFinArticle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'article', //force Sequelize à utiliser la table existante
  underscored: true,
  timestamps: false, // désactive les colonnes auto createdAt/updatedAt que Sequelize ajoute par défaut vu que je les gère à la main
});

module.exports = Article;