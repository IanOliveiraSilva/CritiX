require('dotenv').config();

const axios = require("axios");
const db = require("../config/db");

const lowRating = 0;
const highRating = 5;
const specialRatingMap = new Map([
  ['Horror', 'Nivel de Medo'],
  ['Comedy', 'Nivel de Diversão'],
  ['Action', 'Nivel de Adrenalina'],
  ['Romance', 'Nivel de Amor'],
  ['Drama', 'Nivel de Choro'],
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

const updateMovieAverageSpecialRating = async (movieId) => {
  const { rows: [movie] } = await db.query(
    `SELECT AVG(specialrating) AS average_specialrating FROM reviews WHERE movieId = $1`,
    [movieId]
  );
  const average_specialrating = movie.average_specialrating || 0;
  await db.query(
    `UPDATE movies SET mediaspecialrating = $1 WHERE id = $2`,
    [average_specialrating, movieId]
  );
  return average_specialrating;
};

const getSpecialRating = (genre) => {
  const genreArray = genre.split(',');
  const firstGenre = genreArray[0];
  return specialRatingMap.get(firstGenre.trim());
}

exports.createReview = async (req, res) => {
  const { title, imdbID, rating, comment, isPublic, specialRating } = req.body;
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

    const { Title, Year, Runtime, Released, Genre, Director, Writer, Actors, Plot, Country, Awards, Poster, imdbRating, Metascore } = omdbResponse.data;

    let movieId;
    const { rows: [existingMovie] } = await db.query('SELECT * FROM movies WHERE imdbId = $1', [imdbID]);

    if (existingMovie && existingMovie.id) {
      movieId = existingMovie.id;
    } else {
      const { rows: [newMovie] } = await db.query(
        `
        INSERT INTO movies (imdbID, title, year, runtime, released, genre, director, writer, actors, plot, country, awards, poster, imdbRating, metascore)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING *
        `,
        [imdbID, Title, Year, Runtime, Released, Genre, Director, Writer, Actors, Plot, Country, Awards, Poster, imdbRating, Metascore]
      );
      movieId = newMovie.id;
    }

    const { rows: [review] } = await db.query(
      `INSERT INTO reviews (userId, imdbid,movieId, rating,
        review,
        isPublic,
        specialRating)
      VALUES ($1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7)
      RETURNING *`,
      [userId,
        imdbID,
        movieId,
        rating,
        comment,
        isPublic,
        specialRating]
    );

    await updateMovieAverageRating(movieId);
    await updateMovieAverageSpecialRating(movieId);

    const { rows: [userProfile] } = await db.query(
      `SELECT "contadorlists" 
      FROM user_profile WHERE userId = $1
      `,
      [userId]
    );

    if (userProfile) {
      const currentReviewCount = userProfile.contadorreviews || 0;
      let newReviewCount = currentReviewCount + 1;

      if (newReviewCount < 0) {
        newReviewCount = 0
      }

      await db.query(
        `UPDATE user_profile 
        SET "contadorreviews" = $1
        WHERE userId = $2
        `,
        [newReviewCount, userId]
      );
    }

    res.status(201).json({
      message: 'Review criada com sucesso!',
      body: {
        review,
        title: Title,
        [getSpecialRating(Genre)]: review.specialrating
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
      `SELECT r.id, r.userid, r.movieid, m.title, m.genre, m.imdbid, r.specialrating, r.rating, r.review, r.ispublic, r.created_at, COUNT(c.id) AS comment_count
      FROM reviews r
      LEFT JOIN comments c ON r.id = c.reviewId 
      JOIN movies m ON r.movieid = m.id 
      WHERE r.userId = $1
      GROUP BY r.id, m.title, m.genre, m.imdbid
      
      `,
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
    const movieimbdId = req.query.title;

    const reviews = await db.query(
      `
      SELECT users.username, reviews.id, movies.title , movies.genre, reviews.rating, reviews.specialrating, reviews.review, reviews.created_at, COUNT(c.id) AS comment_count
      FROM reviews 
      INNER JOIN movies ON reviews.movieId = movies.id 
      INNER JOIN users ON reviews.userId = users.id 
      LEFT JOIN comments c ON reviews.id = c.reviewId 
      WHERE movies.imdbid = $1 AND reviews.ispublic = true
      GROUP BY reviews.id, users.username, movies.title, movies.genre
      `,
      [movieimbdId]
    );

    return res.status(200).json(reviews.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllReviewsFromUser = async (req, res) => {
  try {
    const userProfile = req.query.userProfile;

    const userIdQuery = await db.query('SELECT userId FROM user_profile WHERE userProfile = $1', [userProfile]);

    if (userIdQuery.rows.length === 0) {
      return res.status(400).json({
        message: 'O usuário não foi encontrado'
      });
    }

    const userId = userIdQuery.rows[0].userid;

    const reviews = await db.query(
      `SELECT users.username, movies.title, movies.genre, r.rating, r.id, r.specialRating, r.review, r.created_at, COUNT(c.*)
      FROM reviews r
      INNER JOIN movies ON r.movieId = movies.id
      INNER JOIN comments c ON r.id = c.reviewId 
      INNER JOIN users ON r.userId = users.id
      WHERE r.userId = $1 AND r.isPublic = true
      GROUP BY r.id, users.username, movies.title, movies.genre, movies.imdbid
      `,
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

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.query;
    const review = await db.query(
      `SELECT r.id, r.userid, u.username,r.movieid, m.year, m.title, m.genre, m.imdbid,r.specialrating, r.rating, r.review, r.ispublic, r.created_at 
      FROM reviews r 
      INNER JOIN movies m ON r.movieId = m.id
      INNER JOIN users u ON r.userId = u.id
      WHERE r.id = $1 and r.ispublic = true`,
      [id]
    );

    if (!review) {
      return res.status(404).json({
        message: 'Não foi possível encontrar a review com o ID fornecido.'
      });
    }

    return res.status(200).json(review.rows);
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

    await db.query('DELETE FROM comments WHERE reviewid = $1', [id]);

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

    const { rows: [userProfile] } = await db.query(
      'SELECT "contadorreviews" FROM user_profile WHERE userId = $1',
      [userId]
    );

    if (userProfile) {
      const currentReviewCount = userProfile.contadorreviews || 0;
      let newReviewCount = currentReviewCount - 1;

      if (newReviewCount < 0) {
        newReviewCount = 0;
      }

      await db.query(
        'UPDATE user_profile SET "contadorreviews" = $1 WHERE userId = $2',
        [newReviewCount, userId]
      );
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
  const { rating, review, specialRating } = req.body;

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
      'UPDATE reviews SET rating = $1, review = $2, specialRating = $3 WHERE id = $4 AND userId = $5 RETURNING *',
      [rating, review, specialRating, id, userId]
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
  const { rating, review, ispublic, specialrating } = req.body;

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
      specialrating: specialrating || existingReview.rows[0].specialrating,

    };

    const { rows } = await db.query(
      "UPDATE reviews SET rating = $1, specialrating = $2, review = $3, ispublic = $4 WHERE userId = $5 AND id = $6 RETURNING *",
      [updatedReview.rating, updatedReview.specialrating, updatedReview.review, updatedReview.ispublic, userId, id]
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

exports.getLastActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await db.query(
      `
      SELECT users.username, movies.title, reviews.rating, reviews.specialrating, reviews.review, reviews.created_at 
      FROM reviews
      INNER JOIN movies ON reviews.movieId = movies.id
      INNER JOIN users ON reviews.userId = users.id
      WHERE userId = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    if (!review) {
      return res.status(404).json({
        message: 'Não foi possível encontrar a review com o ID fornecido.'
      });
    }

    return res.status(200).json(review.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Ocorreu um erro ao buscar a review.',
      error
    });
  }
};

exports.getThisYearReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewResult = await db.query(
      `
      SELECT users.username, movies.title, r.rating, r.specialrating, r.review, r.created_at
      FROM reviews r
      INNER JOIN users ON r.userid = users.id
      INNER JOIN movies ON r.movieId = movies.id
      WHERE r.userId = $1 AND EXTRACT(YEAR FROM r.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
      `,
      [userId]
    );
    
    const reviewCountResult = await db.query(
      `
      SELECT COUNT(r.id) as total_reviews
      FROM reviews r
      WHERE r.userId = $1 AND EXTRACT(YEAR FROM r.created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
      `,
      [userId]
    );

    const reviews = reviewResult.rows;
    const reviewCount = reviewCountResult.rows[0].total_reviews;
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        message: 'Não foram encontradas revisões para o usuário no ano atual.'
      });
    }

    return res.status(200).json({
      reviews: reviews,
      total_reviews: reviewCount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Ocorreu um erro ao buscar as revisões.',
      error: error.message
    });
  }
};

