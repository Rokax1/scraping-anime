import Anime from '../../models/anime.js';
import Episode from '../../models/episode.js';

export async function createOrUpdateEpisodes(animeId, episodesData) {
  try {
    const anime = await Anime.findByPk(animeId, {
      include: [Episode],
    });

    if (!anime) {
      throw new Error(`No se encontró el anime con id ${animeId}`);
    }

    const episodes = await Promise.all(
      episodesData.map(async (episodeData) => {
        const [episode, created] = await Episode.findOrCreate({
          where: {
            animeId,
            number: episodeData.number,
          },
          defaults: {
            ...episodeData,
            animeId,
          },
        });

        if (!created) {
          await episode.update(episodeData);
        }

        return episode;
      })
    );

    //console.log('Episodios actualizados y creados:', episodes.map((episode) => episode.toJSON()));

    return episodes;
  } catch (error) {
    console.error('Error al crear o actualizar episodios:', error);
    throw error;
  }
}