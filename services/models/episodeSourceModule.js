import Anime from '../../models/anime.js';
import Episode from '../../models/episode.js';
import EpisodeSource from '../../models/episodesource.js';

export async function createOrUpdateEpisodeSource(episodeId, episodeSourceData) {
  try {
    const episode = await Episode.findByPk(episodeId);

    if (!episode) {
      throw new Error(`No se encontró el episodio con id ${episodeId}`);
    }

    const episodesSource = await Promise.all(
        episodeSourceData.map(async (episodeSource) => {
        const [episodeS, created] = await EpisodeSource.findOrCreate({
          where: {
            episodeId,
            url: episodeSource.url,
          },
          defaults: {
            ...episodeSource,
            episodeId,
          },
        });

        if (!created) {
          await episodeS.update(episodeSource);
        }

        return episodeS;
      })
    );

    return episodesSource;
  } catch (error) {
    console.error('Error al crear o actualizar episodios:', error);
    throw error;
  }
}