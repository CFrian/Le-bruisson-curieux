const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const FicheInfo = sequelize.define('FicheInfo', {
    idFicheInfo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cleFicheInfo: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    valeurFicheInfo: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    ordreFicheInfo: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
}, {
    tableName: 'fiche_info',
    underscored: true,
    timestamps: false,
});

module.exports = FicheInfo;