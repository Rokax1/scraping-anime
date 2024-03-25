import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Episode from './episode.js';

const EpisodeSource = sequelize.define('EpisodeSource', {
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  EpisodeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

EpisodeSource.belongsTo(Episode);

export default EpisodeSource;
