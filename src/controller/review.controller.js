require('dotenv').config();

const axios = require("axios");
const db = require("../config/db");

const lowRating = 0;
const highRating = 5;
const specialRatingMap = new Map([
  ['Horror', 'Horrormetro'],
  ['Comedy', 'Risômetro'],
  ['Action', 'Adrenalimetro'],
  ['Romance', 'Amorômetro'],
  ['Drama', 'Lagrimômetro'],
]);

const updateMovieAverageRating = async (movieId) => {
  const { rows: [movie] } = await db.query(
    `SELECT AVG(rating) AS average_rating FROM reviews WHERE movieId = $1`,
    [movieId]
  );
  const averageRating = movie.average_rating || 0;
  await db.query(
    `UPDATE movies SET mediaNotas = $1 WHERE id = $2`,
    [averageRating, movieId]
  );
  return averageRating;
};

const getSpecialRating = (genre) => {
  const genreArray = genre.split(',');
  const firstGenre = genreArray[0];
  return specialRatingMap.get(firstGenre.trim());
}


exports.createReview = async (req, res) => {
  const { title, rating, comment, isPublic, specialRating  } = req.body;
  const userId = req.user.id;


  try {
    if (!rating || rating < lowRating || rating > highRating) {
      return res.status(400).json({ message: 'Rating deve ser um numero entre 0 a 5' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Titulo é obrigatorio!' });
    }

    if (!comment) {
      return res.status(400).json({ message: 'Review é obrigatoria!' });
    }

    const omdbApiKey = process.env.OMDB_API_KEY;
    const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${omdbApiKey}`);
    if (!omdbResponse.data || omdbResponse.data.Error) {
      return res.status(400).json({ message: 'Filme não encontrado no OMDB' });
    }

    const { imdbID, Title, Year, Runtime, Released, Genre, Director, Writer, Actors, Plot, Country, Awards, Poster, imdbRating, Metascore } = omdbResponse.data;

    let movieId;
    const { rows: [existingMovie] } = await db.query('SELECT * FROM movies WHERE imdbId = $1', [imdbID]);

    if (existingMovie && existingMovie.id) {
      movieId = existingMovie.id;
    } else {
      const { rows: [newMovie] } = await db.query(
        `INSERT INTO movies (imdbID, title, year, runtime, released, genre, director, writer, actors, plot, country, awards, poster, imdbRating, metascore)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [imdbID, Title, Year, Runtime, Released, Genre, Director, Writer, Actors, Plot, Country, Awards, Poster, imdbRating, Metascore]
      );
      movieId = newMovie.id;
    }
    
    const { rows: [review] } = await db.query(
      `INSERT INTO reviews (userId, movieId, rating,
        review,
        isPublic,
        specialRating)
      VALUES ($1,
        $2,
        $3,
        $4,
        $5,
        $6)
      RETURNING *`,
      [userId,
       movieId,
       rating,
       comment,
       isPublic,
       specialRating]
    );

    await updateMovieAverageRating(movieId);

    res.status(201).json({
      message: 'Review criada com sucesso!',
      body: {
        review,
        title: Title,
        [getSpecialRating(Genre)] : review.specialrating 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Um erro aconteceu enquanto a review era criada',
      error
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await db.query(
      'SELECT r.id, r.userid, r.movieid, m.title, r.rating, r.review, r.ispublic, r.created_at FROM reviews r JOIN movies m ON r.movieid = m.id WHERE r.userId = $1',
      [userId]
    );

    if (reviews.rows.length === 0) {
      return res.status(400).json({
        message: 'O usuário não possui reviews'
      });
    }

    return res.status(200).json(reviews.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



exports.getAllReviewsFromMovie = async (req, res) => {
  try {
    const title = req.query.title;

    const reviews = await db.query(
      `SELECT users.username, movies.title , reviews.rating, reviews.fearlevel, reviews.review, reviews.created_at 
      FROM reviews 
      INNER JOIN movies ON reviews.movieId = movies.id 
      INNER JOIN users ON reviews.userId = users.id 
      WHERE movies.title = $1 AND reviews.ispublic = true`,
      [title]
    );

    return res.status(200).json(reviews.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    const { rows: [review] } = await db.query(
      'SELECT * FROM reviews WHERE userId = $1 AND id = $2',
      [userId, id]
    );

    if (!review) {
      return res.status(404).json({
        message: 'Não foi possível encontrar a review com o ID fornecido.'
      });
    }

    return res.status(200).json({
      message: 'Review encontrada com sucesso!',
      body: {
        review
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Ocorreu um erro ao buscar a review.',
      error
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    const { rows } = await db.query(
      `DELETE FROM reviews
       WHERE userId = $1 AND id = $2
       RETURNING *`,
      [userId, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "A review que você tentou deletar não existe."
      });
    }

    return res.status(200).json({
      message: "Review deletada com sucesso!",
      review: rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao deletar a review.",
      error
    });
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.query;
  const userId = req.user.id;
  const { rating, review } = req.body;

  try {
    if (!rating) {
      return res.status(400).json({
        message: 'Rating is required'
      });
    }

    if (!review) {
      return res.status(400).json({
        message: 'Review is required'
      });
    }
    
    const { rows } = await db.query(
      'UPDATE reviews SET rating = $1, review = $2 WHERE id = $3 AND userId = $4 RETURNING *',
      [rating, review, id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Não foi possível encontrar a review com o id fornecido."
      });
    }
    
    return res.status(200).json({
      message: "Review atualizada com sucesso!",
      review: rows[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao atualizar a review.",
      error
    });
  }
};

exports.updateReviewPartionally = async (req, res) => {
  const { id } = req.query;
  const userId = req.user.id;
  const { rating, review, ispublic } = req.body;

  try {
    const existingReview = await db.query(
      "SELECT * FROM reviews WHERE id = $1 AND userId = $2",
      [id, userId]
    );

    if (existingReview.rows.length === 0) {
      return res.status(404).json({
        message: "Não foi possível encontrar a review com o id fornecido.",
      });
    }

    const updatedReview = {
      rating: rating || existingReview.rows[0].rating,
      review: review || existingReview.rows[0].review,
      ispublic: ispublic !== undefined ? ispublic : existingReview.rows[0].ispublic,
    };

    const { rows } = await db.query(
      "UPDATE reviews SET rating = $1, review = $2, ispublic = $3 WHERE userId = $4 AND id = $5 RETURNING *",
      [updatedReview.rating, updatedReview.review, updatedReview.ispublic, userId, id]
    );

    return res.status(200).json({
      message: "Review atualizada com sucesso!",
      review: rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao atualizar a review.",
      error,
    });
  }
};

