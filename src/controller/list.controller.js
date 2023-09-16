require('dotenv').config();

const axios = require("axios");
const db = require("../config/db");
const OMDB_API_KEY = process.env.OMDB_API_KEY;

exports.createList = async (req, res) => {
    const { name, description, movieTitles, isPublic } = req.body;
    const userId = req.user.id;

    try {
        if (!name) {
            return res.status(400).json({ message: 'Nome é obrigatório!' });
        }

        const { rows: [list] } = await db.query(
            `INSERT INTO lists (name, description, movies ,isPublic ,userId)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [name ,description ,movieTitles ,isPublic ,userId]
        );

        for (const title of movieTitles) {
            const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`);
            if (omdbResponse.status === 200 && omdbResponse.data && omdbResponse.data.Response === 'True') {
                const movieData = omdbResponse.data;
                let { rows: [movie] } = await db.query('SELECT medianotas FROM movies WHERE title = $1', [title]);
                
                // Se o filme não existir no banco de dados local, insira-o
                if (!movie) {
                    const { rows: [newMovie] } = await db.query(
                        `INSERT INTO movies (imdbid, title, year, runtime, released, genre, director, writer, actors, plot, country, awards, poster, imdbrating, metascore)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                        RETURNING id`, // Certifique-se de que o ID do filme é retornado
                        [movieData.imdbID, movieData.Title, movieData.Year, movieData.Runtime, movieData.Released,
                         movieData.Genre, movieData.Director, movieData.Writer,movieData.Actors,movieData.Plot,
                         movieData.Country,movieData.Awards,movieData.Poster,movieData.imdbRating,movieData.Metascore]
                    );
                    movie = newMovie;
                }
            }
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
            `SELECT l.id, u.username AS user, l.name AS list_name, l.movies AS movie_titles, l.description AS list_description, l.created_at AS Created_At
            FROM lists l
            JOIN users u ON l.userId = u.id
            WHERE u.id = $1;
            `,
            [userId]
        );
  
        if (lists.rows.length === 0) {
            return res.status(400).json({
                message: 'O usuário não possui listas'
            });
        }
  
        return res.status(200).json(lists.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  exports.getListById = async (req, res) => {
    try {
        const { id } = req.query;
        const userId = req.user.id;
  
        const lists = await db.query(
            `SELECT u.username AS user, l.name AS list_name, l.movies AS movie_titles, l.description AS list_description, l.created_at AS Created_At
            FROM lists l
            JOIN users u ON l.userId = u.id
            WHERE u.id = $1 and l.id = $2;
            `,
            [userId, id]
        );
  
        if (lists.rows.length === 0) {
            return res.status(404).json({
                message: 'Não foi possível encontrar a lista com o ID fornecido.'
            });
        }
  
        return res.status(200).json({
            message: 'Lista encontrada com sucesso!',
            body: {
                Lista : lists.rows[0]
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
    const { name, description, isPublic, movieTitles } = req.body;
  
    try {
        if (!name) {
            return res.status(400).json({
                message: 'Nome é obrigatório'
            });
        }
  
        const { rows } = await db.query(
            'UPDATE lists SET name = $1, description = $2, isPublic = $3, movies = $4 WHERE id = $5 AND userId = $6 RETURNING *',
            [name, description, isPublic, movieTitles, id, userId]
        );
  
        if (rows.length === 0) {
            return res.status(404).json({
                message: "Não foi possível encontrar a lista com o id fornecido."
            });
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
    const { name, description, isPublic, movieTitles } = req.body;
  
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
            movies: movieTitles || existingList.rows[0].movies
        };
  
        const { rows } = await db.query(
            "UPDATE lists SET name = $1, description = $2, isPublic = $3, movies = $4 WHERE userId = $5 AND id = $6 RETURNING *",
            [updatedList.name, updatedList.description, updatedList.isPublic, updatedList.movies, userId, id]
        );
  
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
  






  