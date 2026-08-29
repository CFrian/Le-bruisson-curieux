const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const Media = sequelize.define('Media', {
    idMedia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    typeMedia: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    urlMedia: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    legendeMedia: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    ordreMedia: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    timecodeSecondesMedia: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: 'media',
    underscored: true,
    timestamps: false,
});

module.exports = Media;