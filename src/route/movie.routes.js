const router = require('express-promise-router')();
const movieController = require('../controller/movie.controller');
const userController = require('../controller/user.controller')

// SELECIONAR FILME POR TITULO
router.get('/movie/title', userController.AuthMiddleware, movieController.getMovieByTitle);

// SELECIONAR FILME POR GENERO
router.get('/movie/genre', userController.AuthMiddleware, movieController.getMoviesByGenre);

// SELECIONAR FILME POR DIRETOR
router.get('/movie/director', userController.AuthMiddleware, movieController.getMoviesByDirector);

// SELECIONAR FILME POR PAIS
router.get('/movie/country', userController.AuthMiddleware, movieController.getMoviesByCountry);

// SELECIONAR FILME POR ATOR
router.get('/movie/actors', userController.AuthMiddleware, movieController.getMoviesByActors);

// SELECIONAR FILME POR ESCRITOR
router.get('/movie/writer', userController.AuthMiddleware, movieController.getMoviesByWriter);

// SELECIONAR FILME POR PESSOA
router.get('/movie/person', userController.AuthMiddleware, movieController.getMoviesByPerson);

// SELECIONAR TODOS OS FILMES
router.get('/movie/', userController.AuthMiddleware, movieController.getAllMovies);

module.exports = router;