// associations.js
import Anime from './models/anime.js';
import Episode from './models/episode.js';
import EpisodeSource from './models/episodesource.js';

Anime.hasMany(Episode, { foreignKey: 'animeId' });
Episode.belongsTo(Anime, { foreignKey: 'animeId' });
Episode.hasMany(EpisodeSource, { foreignKey: 'EpisodeId' }); 
