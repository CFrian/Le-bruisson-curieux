const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const Categorie = sequelize.define('Categorie', {
    idCategorie: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nomCategorie: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    slugCategorie: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'categorie',
    underscored: true,
    timestamps: false,
});

module.exports = Categorie;