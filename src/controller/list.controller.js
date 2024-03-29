require('dotenv').config();

const axios = require("axios");
const db = require("../config/db");
const OMDB_API_KEY = process.env.OMDB_API_KEY;

exports.createList = async (req, res) => {
    const { name, description, movieIds, moviesId, isPublic } = req.body;
    const userId = req.user.id;

    try {
        if (!name) {
            return res.status(400).json({ message: 'Nome é obrigatório!' });
        }

        const { rows: [list] } = await db.query(
            `INSERT INTO lists 
            (name, 
            description, 
            movies, 
            moviesId, 
            isPublic,
            userId)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [name, description, movieIds, moviesId, isPublic, userId]
        );

        for (const title of movieIds) {
            const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`);
            if (omdbResponse.status === 200 && omdbResponse.data && omdbResponse.data.Response === 'True') {
                const movieData = omdbResponse.data;
                let { rows: [movie] } = await db.query('SELECT medianotas FROM movies WHERE title = $1', [title]);

                if (!movie) {
                    const { rows: [newMovie] } = await db.query(
                        `INSERT INTO movies (imdbid, title, year, genre)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id`,
                        [movieData.imdbID, movieData.Title, movieData.Year, movieData.Genre,]
                    );
                    movie = newMovie;
                }
            }
        }

        // Contador para a review
        const { rows: [userProfile] } = await db.query(
            'SELECT "contadorlists" FROM user_profile WHERE userId = $1',
            [userId]
        );

        if (userProfile) {
            const currentListsCount = userProfile.contadorlists || 0;
            const newListsCount = currentListsCount + 1;

            await db.query(
                'UPDATE user_profile SET "contadorlists" = $1 WHERE userId = $2',
                [newListsCount, userId]
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
            `SELECT l.id, l.moviesid, u.username AS user, l.name AS list_name, l.movies AS movie_titles, l.description AS list_description, l.created_at AS Created_At
            FROM lists l
            JOIN users u ON l.userId = u.id
            WHERE u.id = $1
            ORDER BY Created_at DESC;
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

        const lists = await db.query(
            `
            SELECT 
            u.username AS user, 
            l.id,
            l.moviesid,
            l.name AS list_name, 
            l.movies AS movie_titles, 
            l.description AS list_description, 
            l.created_at AS Created_At,
            COUNT(DISTINCT movie) AS movies_count
            FROM lists l
            JOIN users u ON l.userId = u.id
            JOIN user_profile up ON u.id = up.userid
            LEFT JOIN 
            unnest(l.moviesid) AS movie ON true
            WHERE l.id = $1
            GROUP BY u.username, l.id,l.moviesid ,l.name, l.movies, l.description, l.created_at;
            `,
            [id]
        );

        if (lists.rows.length === 0) {
            return res.status(404).json({
                message: 'Não foi possível encontrar a lista com o ID fornecido.'
            });
        }

        return res.status(200).json(lists.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Ocorreu um erro ao buscar a lista.',
            error
        });
    }
};

exports.getListByName = async (req, res) => {
    try {
        const name = 'Meus filmes favoritos';
        const userId = req.user.id;

        const lists = await db.query(
            `
            SELECT u.username AS user, 
            l.name AS list_name, l.movies AS movie_titles, l.moviesid,l.description AS list_description, l.created_at AS Created_At, CONCAT(up.name, ' ', up.familyName) as name,
            COUNT(DISTINCT movie) AS movies_count
            FROM lists l
            JOIN users u ON l.userId = u.id
            JOIN user_profile up ON u.id = up.userid
            LEFT JOIN 
            LATERAL unnest(l.moviesid) AS movie
            ON true
            WHERE l.name = $1 and u.id = $2
            GROUP BY u.username, l.name, l.moviesid,l.movies, l.description, l.created_at, up.name, up.familyname
            `,
            [name, userId]
        );


        if (lists.rows.length === 0) {
            return res.status(404).json({
                message: 'Não foi possível encontrar a lista com o ID fornecido.'
            });
        }

        return res.status(200).json({
            message: 'Lista encontrada com sucesso!',
            body: {
                Lista: lists.rows[0]
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

exports.getListByMovie = async (req, res) => {
    try {
        const { movie_titles } = req.query;

        const lists = await db.query(
            `SELECT u.username AS user,
            l.name AS list_name,
            l.id,
            l.movies AS movie_titles,
            l.description AS list_description,
            l.created_at AS Created_At
            FROM lists l
            JOIN users u ON l.userid = u.id
            WHERE $1 = ANY(l.movies)
            ORDER BY Created_at DESC;
            `,
            [movie_titles]
        );

        if (lists.rows.length === 0) {
            return res.status(404).json({
                message: 'Não foi possível encontrar a lista com o título do filme fornecido.'
            });
        }

        return res.status(200).json({
            message: 'Listas encontrada com sucesso!',
            body: {
                Lista: lists.rows
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

exports.getListByUser = async (req, res) => {
    try {
        const userProfile = req.query.userProfile;

        const userIdQuery = await db.query('SELECT userId FROM user_profile WHERE userProfile = $1', [userProfile]);

        if (userIdQuery.rows.length === 0) {
            return res.status(400).json({
              message: 'O usuário não foi encontrado'
            });
          }
      
        const userId = userIdQuery.rows[0].userid;
      
        const lists = await db.query(
            `SELECT l.id, l.moviesid, u.username AS user, l.name AS list_name, l.movies AS movie_titles, l.description AS list_description, l.created_at AS Created_At
            FROM lists l
            INNER JOIN users u ON l.userid = u.id
            WHERE l.userId = $1 AND l.isPublic = true
            ORDER BY Created_at DESC;
            `,
            [userId]
        );

        if (lists.rows.length === 0) {
            return res.status(404).json({
                message: 'Não foi possível encontrar a lista com o usuario fornecido.'
            });
        }

        return res.status(200).json(lists.rows);
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

        const { rows: [userProfile] } = await db.query(
            'SELECT "contadorlists" FROM user_profile WHERE userId = $1',
            [userId]
          );
      
          if (userProfile) {
            const currentListsCount = userProfile.contadorlists || 0;
            const newListsCount = currentListsCount - 1;
      
            await db.query(
              'UPDATE user_profile SET "contadorlists" = $1 WHERE userId = $2',
              [newListsCount, userId]
            );
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
    const { name, description, isPublic, movieIds } = req.body;

    try {
        if (!name) {
            return res.status(400).json({
                message: 'Nome é obrigatório'
            });
        }

        const { rows } = await db.query(
            'UPDATE lists SET name = $1, description = $2, isPublic = $3, movies = $4 WHERE id = $5 AND userId = $6 RETURNING *',
            [name, description, isPublic, movieIds, id, userId]
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
    const { name, description, isPublic, moviesid, movies} = req.body;

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
            isPublic: isPublic !== undefined ? isPublic : existingList.rows[0].ispublic
        };

        const existingMoviesId = existingList.rows[0].moviesid || [];
        const existingMovies = existingList.rows[0].movies || [];
        let updatedMovies;
        let updatedMoviesId;
        if (existingMoviesId.includes(moviesid)) {
            return res.status(400).json({
                message: "O filme já está na lista.",
            });
        }
        if(moviesid && movies){
            updatedMoviesId = [...existingMoviesId, moviesid].map(moviesid => moviesid.toString()); 
            updatedMovies = [...existingMovies, movies].map(movies => movies.toString());
        }

        
        const { rows } = await db.query(
            "UPDATE lists SET name = $1, description = $2, isPublic = $3, moviesid = $4, movies = $5 WHERE userId = $6 AND id = $7 RETURNING *",
            [updatedList.name, updatedList.description, updatedList.isPublic, updatedMoviesId, updatedMovies ,userId, id]
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

exports.getWatchlist = async (req, res) => {
    try {
        const name = 'Watchlist';
        const userId = req.user.id;

        const lists = await db.query(
            `
            SELECT u.username AS user, 
            l.name AS list_name, l.movies AS movie_titles, l.moviesid,l.description AS list_description, l.created_at AS Created_At, CONCAT(up.name, ' ', up.familyName) as name,
            COUNT(DISTINCT movie) AS movies_count
            FROM lists l
            JOIN users u ON l.userId = u.id
            JOIN user_profile up ON u.id = up.userid
            LEFT JOIN 
            LATERAL unnest(l.moviesid) AS movie
            ON true
            WHERE l.name = $1 and u.id = $2
            GROUP BY u.username, l.name, l.moviesid,l.movies, l.description, l.created_at, up.name, up.familyname;
            `,
            [name, userId]
        );

        return res.status(200).json({
            message: 'Lista encontrada com sucesso!',
            body: {
                Lista: lists.rows[0]
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

exports.getUserWatchlist = async (req, res) => {
    try {
        const name = 'Watchlist';
        const { userprofile } = req.body;

        const lists = await db.query(
            `
            SELECT u.username AS user, 
            l.name AS list_name, l.movies AS movie_titles, l.moviesid,l.description AS list_description, l.created_at AS Created_At, CONCAT(up.name, ' ', up.familyName) as name,
            COUNT(DISTINCT movie) AS movies_count
            FROM lists l
            JOIN users u ON l.userId = u.id
            JOIN user_profile up ON u.id = up.userid
            LEFT JOIN 
            LATERAL unnest(l.movies) AS movie
            ON true
            WHERE l.name = $1 and up.userprofile = $2
            GROUP BY u.username, l.name, l.moviesid,l.movies, l.description, l.created_at, up.name, up.familyname;
            `,
            [name, userprofile]
        );

        if (lists.rows.length === 0) {
            return res.status(404).json({
                message: "Erro",
            });
        }

        return res.status(200).json({
            message: 'Lista encontrada com sucesso!',
            body: {
                Lista: lists.rows[0]
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

exports.updateWatchlist = async (req, res) => {
    const watchlistName = 'Watchlist';
    const userId = req.user.id;
    const { name, description, isPublic, moviesid} = req.body;

    try {
        const existingList = await db.query(
            "SELECT * FROM lists WHERE name = $1 AND userId = $2",
            [watchlistName, userId]
        );

        if (existingList.rows.length === 0) {
            return res.status(404).json({
                message: "Não foi possível encontrar a lista com o id fornecido.",
            });
        }

        const existingMovies = existingList.rows[0].moviesid || [];
        if (existingMovies.includes(moviesid)) {
            return res.status(400).json({
                message: "O filme já está na lista.",
            });
        }

        const updatedMovies = [...existingMovies, moviesid].map(moviesid => moviesid.toString());
        const { rows } = await db.query(
            "UPDATE lists SET name = $1, description = $2, isPublic = $3, moviesid = $4 WHERE userId = $5 AND name = $6 RETURNING *",
            [name || existingList.rows[0].name, description || existingList.rows[0].description, isPublic !== undefined ? isPublic : existingList.rows[0].ispublic, updatedMovies, userId, watchlistName]
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

exports.updateFavoriteList = async (req, res) => {
    const watchlistName = 'Meus filmes favoritos';
    const userId = req.user.id;
    const { name, description, isPublic, moviesid } = req.body;

    try {
        const existingList = await db.query(
            "SELECT * FROM lists WHERE name = $1 AND userId = $2",
            [watchlistName, userId]
        );

        if (existingList.rows.length === 0) {
            return res.status(404).json({
                message: "Não foi possível encontrar a lista com o id fornecido.",
            });
        }
        const existingMovies = existingList.rows[0].moviesid || [];
        if (existingMovies.includes(moviesid)) {
            return res.status(400).json({
                message: "O filme já está na lista.",
            });
        }
        
        if(existingMovies.length >= 4){
            return res.status(400).json({
                message: "Você só pode ter 4 filmes na lista.",
            });
        }

        const updatedMovies = [...existingMovies, moviesid].map(moviesid => moviesid.toString());
        const { rows } = await db.query(
            "UPDATE lists SET name = $1, description = $2, isPublic = $3, moviesid = $4 WHERE userId = $5 AND name = $6 RETURNING *",
            [name || existingList.rows[0].name, description || existingList.rows[0].description, isPublic !== undefined ? isPublic : existingList.rows[0].ispublic, updatedMovies, userId, watchlistName]
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

exports.removeFromWatchlist = async (req, res) => {
    const watchlistName = 'Watchlist';
    const userId = req.user.id;
    const { moviesid } = req.body;

    try {
        const existingList = await db.query(
            "SELECT * FROM lists WHERE name = $1 AND userId = $2",
            [watchlistName, userId]
        );

        if (existingList.rows.length === 0) {
            return res.status(404).json({
                message: "Não foi possível encontrar a lista com o id fornecido.",
            });
        }

        const existingMovies = existingList.rows[0].moviesid;
        if (!existingMovies.includes(moviesid)) {
            return res.status(400).json({
                message: "O filme não está na lista.",
            });
        }

        const updatedMovies = existingMovies.filter(movie => movie !== moviesid);
        

        const { rows } = await db.query(
            "UPDATE lists SET moviesid = $1 WHERE userId = $2 AND name = $3 RETURNING *",
            [updatedMovies, userId, watchlistName]
        );

        return res.status(200).json({
            message: "Filme removido da lista com sucesso!",
            list: rows[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Ocorreu um erro ao remover o filme da lista.",
            error,
        });
    }
};

exports.removeFromFavoriteList = async (req, res) => {
    const watchlistName = 'Meus filmes favoritos';
    const userId = req.user.id;
    const { moviesid } = req.body;

    try {
        const existingList = await db.query(
            "SELECT * FROM lists WHERE name = $1 AND userId = $2",
            [watchlistName, userId]
        );

        if (existingList.rows.length === 0) {
            return res.status(404).json({
                message: "Não foi possível encontrar a lista com o id fornecido.",
            });
        }

       
        const existingMovies = existingList.rows[0].moviesid;
        if (!existingMovies.includes(moviesid)) {
            return res.status(400).json({
                message: "O filme não está na lista.",
            });
        }

        const updatedMovies = existingMovies.filter(movie => movie !== moviesid);

        const { rows } = await db.query(
            "UPDATE lists SET moviesid = $1 WHERE userId = $2 AND name = $3 RETURNING *",
            [updatedMovies, userId, watchlistName]
        );

        return res.status(200).json({
            message: "Filme removido da lista com sucesso!",
            list: rows[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Ocorreu um erro ao remover o filme da lista.",
            error,
        });
    }
};

exports.getRandomMovieFromWatchlist = async (req, res) => {
    try {
        const name = 'Watchlist';
        const userId = req.user.id;

        const lists = await db.query(
            `
            SELECT l.movies AS movie_titles
            FROM lists l
            JOIN users u ON l.userId = u.id
            WHERE l.name = $1 and u.id = $2
            `,
            [name, userId]
        );

        const movieIds = lists.rows[0].movie_titles;
        const randomIndex = Math.floor(Math.random() * movieIds.length);
        const randomMovie = movieIds[randomIndex];

        return res.status(200).json({
            message: 'O filme escolhido foi: ' + randomMovie,
            body: {
                Filme: randomMovie
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Ocorreu um erro ao escolher um filme aleatório.',
            error
        });
    }
};

exports.getRandomMovieFromList = async (req, res) => {
    try {
        const { name } = req.query;
        const userId = req.user.id;

        const lists = await db.query(
            `
            SELECT l.moviesid AS movie_ids
            FROM lists l
            JOIN users u ON l.userId = u.id
            WHERE l.name = $1 and u.id = $2
            `,
            [name, userId]
        );

        const movieIds = lists.rows[0].movie_ids;
        const randomIndex = Math.floor(Math.random() * movieIds.length);
        const randomId = movieIds[randomIndex];

        return res.status(200).json({
            message: 'O filme escolhido foi: ' + randomId,
            body: {
                Filme: randomId,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Ocorreu um erro ao escolher um filme aleatório.',
            error
        });
    }
};






