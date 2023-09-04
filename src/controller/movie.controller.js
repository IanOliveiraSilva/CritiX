require('dotenv').config();

const axios = require("axios");
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const db = require("../config/db");

exports.getMovieByTitle = async (req, res) => {
  const { title } = req.query;
  try {
    const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`);
    if (omdbResponse.status === 200 && omdbResponse.data && omdbResponse.data.Response === 'True') {
      const movieData = omdbResponse.data;
      const { rows: [movie] } = await db.query('SELECT medianotas FROM movies WHERE title = $1', [title]);
      res.status(200).json({
        body: {
          movieData,
          movie
        }
      });
    } else {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filme' });
  }
};


exports.getAllMovies = async (req, res) => {
  try {
    const { rows: movies } = await db.query('SELECT * FROM movies');
    res.status(200).json({
      body: {
        movies
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filmes' });
  }
};

exports.getMoviesByGenre = async (req, res) => {
  const { genre } = req.query;
  try {
    const { rows: movies } = await db.query('SELECT * FROM movies WHERE genre LIKE $1', [`%${genre}%`]);
    res.status(200).json({
      body: {
        movies
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filmes' });
  }

  
  
};








