const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const Paragraphe = sequelize.define('Paragraphe', {
    idParagraphe: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titreParagraphe: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    contenuParagraphe: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ordreParagraphe: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'paragraphe',
    underscored: true,
    timestamps: false,
});

module.exports = Paragraphe;