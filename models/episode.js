import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Anime from './anime.js';

const Episode = sequelize.define('Episode', {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  animeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING
  },
  content_url: {
    type: DataTypes.STRING
  }
});



export default Episode;