require('dotenv').config();

const db = require("../config/db");

exports.createComment = async (req, res) => {
    const { reviewId, comment } = req.body;
    const userId = req.user.id;
  
    try {
      const { rows: [existingReview] } = await db.query('SELECT * FROM reviews WHERE id = $1', [reviewId]);
  
      if (!existingReview || !existingReview.id) {
        return res.status(400).json({ message: 'Review não encontrada!' });
      }
  
      const { rows: [newComment] } = await db.query(
        `INSERT INTO comments (reviewId, userId, comment)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [reviewId, userId, comment]
      );
  
      res.status(201).json({
        message: 'Comentário criado com sucesso!',
        body: {
          comment: newComment
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Um erro aconteceu enquanto o comentário era criado',
        error
      });
    }
  };

  exports.getAllCommentsFromUser = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const comments = await db.query(
        'SELECT c.id, c.reviewid, r.movieid, m.title, c.comment, c.createdAt FROM comments c JOIN reviews r ON c.reviewid = r.id JOIN movies m ON r.movieid = m.id WHERE c.userId = $1',
        [userId]
      );
  
      if (comments.rows.length === 0) {
        return res.status(400).json({
          message: 'O usuário não possui comentários'
        });
      }
  
      return res.status(200).json(comments.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getReviewComments = async (req, res) => {
    const { reviewId } = req.params;
  
    try {
      const comments = await db.query(
        'SELECT c.id, c.userId, u.username, c.comment, c.createdAt FROM comments c JOIN users u ON c.userId = u.id WHERE c.reviewId = $1',
        [reviewId]
      );
  
      if (comments.rows.length === 0) {
        return res.status(400).json({
          message: 'A review não possui comentários'
        });
      }

      
  
      return res.status(200).json(comments.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.deleteComment = async (req, res) => {
    try {
      const { id } = req.query;
      const userId = req.user.id;
  
      const { rows } = await db.query(
        `DELETE FROM comments
         WHERE userId = $1 AND id = $2
         RETURNING *`,
        [userId, id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({
          message: "O comentário que você tentou deletar não existe."
        });
      }
  
      return res.status(200).json({
        message: "Comentário deletado com sucesso!",
        comment: rows[0]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ocorreu um erro ao deletar o comentário.",
        error
      });
    }
  };
  
  
  
