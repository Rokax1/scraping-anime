import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Episode from './episode.js';

const Anime = sequelize.define('Anime', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING
  }
});

export default Anime;