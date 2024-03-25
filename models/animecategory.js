const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Anime = require('./anime');
const Category = require('./category');

const AnimeCategory = sequelize.define('AnimeCategory', {
  animeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

AnimeCategory.belongsTo(Anime);
AnimeCategory.belongsTo(Category);

module.exports = AnimeCategory;
