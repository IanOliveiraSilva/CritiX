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

exports.surpriseMe = async (req, res) => {
  try {
    const keywords = ['action', 'drama', 'comedy', 'thriller', 'sci-fi', 'romance', 'horror', 'adventure'];
    const selectedGenre = req.query.genre;

    const omdbResponse = await axios.get(`http://www.omdbapi.com/?s=${selectedGenre}&type=movie&apikey=${OMDB_API_KEY}`);
    if (omdbResponse.status === 200 && omdbResponse.data && omdbResponse.data.Response === 'True') {
      const movies = omdbResponse.data.Search;
      const randomIndex = Math.floor(Math.random() * movies.length);
      const movieTitle = movies[randomIndex].Title;

      const movieResponse = await axios.get(`http://www.omdbapi.com/?t=${movieTitle}&apikey=${OMDB_API_KEY}`);
      if (movieResponse.status === 200 && movieResponse.data && movieResponse.data.Response === 'True') {
        const movieData = movieResponse.data;
        res.status(200).json({
          body: {
            movie: movieData
          }
        });
      } else {
        return res.status(404).json({ message: 'Nenhum filme encontrado' });
      }
    } else {
      return res.status(404).json({ message: 'Nenhum filme encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filme' });
  }
};










