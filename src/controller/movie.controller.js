require('dotenv').config();

const axios = require("axios");
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
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

exports.surpriseMe = async (req, res) => {
  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}`);
    
    if (tmdbResponse.status === 200 && tmdbResponse.data && tmdbResponse.data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * tmdbResponse.data.results.length);
      const movieData = tmdbResponse.data.results[randomIndex];

      res.status(200).json({
        body: {
          movie: movieData
        }
      });
    } else {
      return res.status(404).json({ message: 'Nenhum filme encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filme' });
  }
};













