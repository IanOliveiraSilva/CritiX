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
      let { rows: [movie] } = await db.query(
        `
      SELECT medianotas, mediaspecialrating
      FROM movies WHERE title = $1
      `,
        [title]);

      const { rows: [reviewCount] } = await db.query(
        `
      SELECT COUNT(*) AS review_count 
      FROM reviews 
      INNER JOIN movies ON reviews.movieId = movies.id 
      WHERE movies.title = $1 AND reviews.ispublic = true
      `,
        [title]);

      if (!movie) {
        movie = {
          medianotas: 0,
          mediaspecialrating: 0,
        };
      }
      res.status(200).json({
        body: {
          movieData,
          movie,
          reviewCount: reviewCount.review_count
        }
      });
    } else {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filme' });
  }
};

exports.getMovieById = async (req, res) => {
  const { imdbID } = req.query;

  try {
    const omdbResponse = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);

    if (omdbResponse.status === 200 && omdbResponse.data && omdbResponse.data.Response === 'True') {
      const movieData = omdbResponse.data;
      let { rows: [movie] } = await db.query(
        `
      SELECT medianotas, mediaspecialrating
      FROM movies WHERE imdbID = $1
      `,
        [imdbID]);

      const { rows: [reviewCount] } = await db.query(
        `
      SELECT COUNT(*) AS review_count 
      FROM reviews 
      INNER JOIN movies ON reviews.movieId = movies.id 
      WHERE movies.imdbID = $1 AND reviews.ispublic = true
      `,
        [imdbID]);

      if (!movie) {
        movie = {
          medianotas: 0,
          mediaspecialrating: 0,
        };
      }

      res.status(200).json({
        body: {
          movieData,
          movie,
          reviewCount: reviewCount.review_count
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
  const TMDB_API_KEY = 'b42f7ed941f9bfa455c43a95f488a734';
  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}`);

    if (tmdbResponse.status === 200 && tmdbResponse.data && tmdbResponse.data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * tmdbResponse.data.results.length);
      const movieData = tmdbResponse.data.results[randomIndex];
      const { title } = movieData;

      const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`);
      if (omdbResponse.status === 200 && omdbResponse.data && omdbResponse.data.Response === 'True') {
        const omdbMovieData = omdbResponse.data;

        let { rows: [movie] } = await db.query(
          `
        SELECT medianotas, mediaspecialrating
        FROM movies WHERE title = $1
        `,
          [omdbMovieData.Title]);

        if (movie == undefined) {
          movie = {
            "medianotas": null,
            "mediaspecialrating": null
          }
        }

        const { rows: [reviewCount] } = await db.query(
          `
      SELECT COUNT(*) AS review_count 
      FROM reviews 
      INNER JOIN movies ON reviews.movieId = movies.id 
      WHERE movies.title = $1 AND reviews.ispublic = true
      `,
          [omdbMovieData.Title]);


        res.status(200).json({
          body: {
            omdbMovie: omdbMovieData,
            movie,
            reviewCount: reviewCount.review_count
          }
        });
      } else {
        return res.status(404).json({ message: 'Filme não encontrado na OMDB' });
      }
    } else {
      return res.status(404).json({ message: 'Nenhum filme encontrado na TMDB' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao pesquisar filme' });
  }
};

exports.getMoviesTendency = async (req, res) => {
  try {
    const { rows: moviesWithReviewCounts } = await db.query(
      `
      SELECT movies.id, movies.imdbid, movies.title, COUNT(reviews.id) AS review_count
      FROM movies
      LEFT JOIN reviews ON movies.id = reviews.movieId
      WHERE reviews.ispublic = true OR reviews.ispublic IS NULL
      GROUP BY movies.id, movies.title
      ORDER BY review_count DESC
      LIMIT 4
      `
    );

    res.status(200).json({
      movies: moviesWithReviewCounts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
};













