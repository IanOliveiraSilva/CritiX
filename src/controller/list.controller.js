require('dotenv').config();

const axios = require("axios");
const db = require("../config/db");

exports.createList = async (req, res) => {
  const { name, description, movies, isPublic } = req.body;
  const userId = req.user.id;

  try {
      if (!name) {
          return res.status(400).json({ message: 'Nome é obrigatório!' });
      }

      const { rows: [list] } = await db.query(
          `INSERT INTO lists (name, description, movies, isPublic, userId)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *`,
          [name, description, movies ,isPublic, userId]
      );

      for (const movieId of movies) {
          await db.query(
              `INSERT INTO movies_lists (listId, movieId)
              VALUES ($1, $2)`,
              [list.id, movieId]
          );
      }

      res.status(201).json({
          message: 'Lista criada com sucesso!',
          body: {
              list
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Um erro aconteceu enquanto a lista era criada',
          error
      });
  }
};

exports.getAllLists = async (req, res) => {
  try {
      const userId = req.user.id;

      const lists = await db.query(
          `SELECT u.username AS user, l.name AS list_name, m.title AS movie_title, l.description AS list_description, l.created_at AS Created_At
          FROM lists l
          JOIN users u ON l.userId = u.id
          JOIN movies_lists ml ON l.id = ml.listId
          JOIN movies m ON ml.movieId = m.id
          WHERE u.id = $1;
          `,
          [userId]
      );

      if (lists.rows.length === 0) {
          return res.status(400).json({
              message: 'O usuário não possui listas'
          });
      }

      const formattedLists = {};
      for (const row of lists.rows) {
          if (!formattedLists[row.list_name]) {
              formattedLists[row.list_name] = {
                  user_name: row.user_name,
                  list_name: row.list_name,
                  list_description: row.list_description,
                  created_at: row.created_at,
                  movies: []
              };
          }
          formattedLists[row.list_name].movies.push(row.movie_title);
      }

      return res.status(200).json(Object.values(formattedLists));
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getListById = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    const list = await db.query(
      `SELECT u.username AS user, l.name AS list_name, m.title AS movie_title, l.description AS list_description, l.created_at AS Created_At
          FROM lists l
          JOIN users u ON l.userId = u.id
          JOIN movies_lists ml ON l.id = ml.listId
          JOIN movies m ON ml.movieId = m.id
          WHERE u.id = $1 and l.id = $2;
          `,
      [userId, id]
    );

    if (list.length === 0) {
      return res.status(404).json({
          message: 'Não foi possível encontrar a lista com o ID fornecido.'
      });
    } 

    const formattedLists = {};
      for (const row of list.rows) {
          if (!formattedLists[row.list_name]) {
              formattedLists[row.list_name] = {
                  user_name: row.user_name,
                  list_name: row.list_name,
                  list_description: row.list_description,
                  created_at: row.created_at,
                  movies: []
              };
          }
          formattedLists[row.list_name].movies.push(row.movie_title);
      }

    return res.status(200).json({
      message: 'Lista encontrada com sucesso!',
      body: {
        Lista : Object.values(formattedLists)[0]
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Ocorreu um erro ao buscar a lista.',
      error
    });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;

    await db.query(
      `DELETE FROM movies_lists
      WHERE listId = $1`,
      [id]
    );

    const { rows } = await db.query(
      `DELETE FROM lists
      WHERE userId = $1 AND id = $2
      RETURNING *`,
      [userId, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "A Lista que você tentou deletar não existe."
      });
    }

    return res.status(200).json({
      message: "Lista deletada com sucesso!",
      list: rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao deletar a lista.",
      error
    });
  }
};

exports.updateList = async (req, res) => {
  const { id } = req.query;
  const userId = req.user.id;
  const { name, description, isPublic, movies } = req.body;

  try {
      if (!name) {
          return res.status(400).json({
              message: 'Nome é obrigatório'
          });
      }

      const { rows } = await db.query(
          'UPDATE lists SET name = $1, description = $2, isPublic = $3 WHERE id = $4 AND userId = $5 RETURNING *',
          [name, description, isPublic, id, userId]
      );

      if (rows.length === 0) {
          return res.status(404).json({
              message: "Não foi possível encontrar a lista com o id fornecido."
          });
      }

      if (movies) {
          await db.query(
              `DELETE FROM movies_lists
              WHERE listId = $1`,
              [id]
          );

          for (const movieId of movies) {
              await db.query(
                  `INSERT INTO movies_lists (listId, movieId)
                  VALUES ($1, $2)`,
                  [id, movieId]
              );
          }
      }

      return res.status(200).json({
          message: "Lista atualizada com sucesso!",
          list: rows[0]
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "Ocorreu um erro ao atualizar a lista.",
          error
      });
  }
};

exports.updateListPartially = async (req, res) => {
  const { id } = req.query;
  const userId = req.user.id;
  const { name, description, isPublic, movies } = req.body;

  try {
      const existingList = await db.query(
          "SELECT * FROM lists WHERE id = $1 AND userId = $2",
          [id, userId]
      );

      if (existingList.rows.length === 0) {
          return res.status(404).json({
              message: "Não foi possível encontrar a lista com o id fornecido.",
          });
      }

      const updatedList = {
          name: name || existingList.rows[0].name,
          description: description || existingList.rows[0].description,
          isPublic: isPublic !== undefined ? isPublic : existingList.rows[0].ispublic,
      };

      const { rows } = await db.query(
          "UPDATE lists SET name = $1, description = $2, isPublic = $3 WHERE userId = $4 AND id = $5 RETURNING *",
          [updatedList.name, updatedList.description, updatedList.isPublic, userId, id]
      );

      if (movies) {
          await db.query(
              `DELETE FROM movies_lists
              WHERE listId = $1`,
              [id]
          );
          for (const movieId of movies) {
              await db.query(
                  `INSERT INTO movies_lists (listId, movieId)
                  VALUES ($1, $2)`,
                  [id, movieId]
              );
          }
      }

      return res.status(200).json({
          message: "Lista atualizada com sucesso!",
          list: rows[0],
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "Ocorreu um erro ao atualizar a lista.",
          error,
      });
  }
};






  