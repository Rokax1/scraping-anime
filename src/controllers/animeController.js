import Anime from "../../models/anime.js";
import Episode from "../../models/episode.js";
import EpisodeSource from "../../models/episodesource.js";

export const getAnimes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Obtener el límite de la consulta, o usar 10 por defecto
    const page = parseInt(req.query.page) || 1; // Obtener la página de la consulta, o usar 1 por defecto
    const offset = (page - 1) * limit; 

 const { count, rows: animes } = await Anime.findAndCountAll({
  limit: limit,
  offset: offset,
  include: [
    {
      model: Episode,
      include: [
        {
          model: EpisodeSource
        }
      ]
    }
  ],
  distinct: true, 
  col: 'id' 
});

const totalRecords = count;
const totalPages = Math.ceil(totalRecords / limit);
  
    res.json({
      totalRecords: totalRecords,
      totalPages: totalPages,
      currentPage: page,
      data: animes
    });

  } catch (error) {
    console.error("Error al obtener los animes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
