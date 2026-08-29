const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const Chapitre = sequelize.define('Chapitre', {
    idChapitre: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ordreChap: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    titreChap: {
        type: DataTypes.STRING(75),
        allowNull: true,
    },
}, {
    tableName: 'chapitre',
    underscored: true,
    timestamps: false,
});

module.exports = Chapitre;