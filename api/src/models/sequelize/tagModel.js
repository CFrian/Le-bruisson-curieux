const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize/mysql');

const Tag = sequelize.define('Tag', {
  idTag: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomTag: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  slugTag: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'tag',
  underscored: true,
  timestamps: false,
});

module.exports = Tag;