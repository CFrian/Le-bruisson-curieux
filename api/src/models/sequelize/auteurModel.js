const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const Auteur = sequelize.define('Auteur', {
  idAuteur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pseudo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'auteur',
  underscored: true,
  timestamps: false,
});

module.exports = Auteur;