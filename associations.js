// associations.js
import Anime from './models/anime.js';
import Episode from './models/episode.js';

Anime.hasMany(Episode, { foreignKey: 'animeId' });
Episode.belongsTo(Anime, { foreignKey: 'animeId' });