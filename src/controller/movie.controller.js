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

exports.getMoviesByDirector = async (req, res) => {
  const { director } = req.query;
  try {
    const { rows: movies } = await db.query('SELECT * FROM movies WHERE director LIKE $1', [`%${director}%`]);
    res.status(200).json({
      body: {
        movies
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filmes' });
  }
};

exports.getMoviesByCountry = async (req, res) => {
  const { country } = req.query;
  try {
    const { rows: movies } = await db.query('SELECT * FROM movies WHERE country LIKE $1', [`%${country}%`]);
    res.status(200).json({
      body: {
        movies
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filmes' });
  }
};

exports.getMoviesByActors = async (req, res) => {
  const { actors } = req.query;
  try {
    const { rows: movies } = await db.query('SELECT * FROM movies WHERE actors LIKE $1', [`%${actors}%`]);
    res.status(200).json({
      body: {
        movies
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filmes' });
  }
};

exports.getMoviesByWriter = async (req, res) => {
  const { writer } = req.query;
  try {
    const { rows: movies } = await db.query('SELECT * FROM movies WHERE writer LIKE $1', [`%${writer}%`]);
    res.status(200).json({
      body: {
        movies
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filmes' });
  }
};

exports.getMoviesByPerson = async (req, res) => {
  const { person } = req.query;
  try {
    const { rows: movies } = await db.query(
      'SELECT * FROM movies WHERE writer LIKE $1 OR director LIKE $1 OR actors LIKE $1',
      [`%${person}%`]
    );
    res.status(200).json({
      body: {
        movies
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filmes' });
  }
};

exports.surpriseMe = async (req, res) => {
  try {
    const keywords = ['action', 'drama', 'comedy', 'thriller', 'sci-fi', 'romance', 'horror', 'adventure'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

    const omdbResponse = await axios.get(`http://www.omdbapi.com/?s=${randomKeyword}&apikey=${OMDB_API_KEY}`);
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










