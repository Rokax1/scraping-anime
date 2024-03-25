import Anime from '../../models/anime.js';

export async function createAnime(_name_, _status_) {
  try {
    // Buscar si el anime ya existe
    const existingAnime = await Anime.findOne({ where: { name: _name_ } });

    if (existingAnime) {
      console.log('Anime existente encontrado:', existingAnime.toJSON());
      return existingAnime;
    } else {
      const newAnime = await Anime.create({ name: _name_, status: _status_ });
      console.log('Anime creado:', newAnime.toJSON());
      return newAnime;
    }
  } catch (error) {
    console.error('Error al crear o buscar Anime:', error);
    throw error;
  }
}