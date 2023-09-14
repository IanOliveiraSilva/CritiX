const router = require('express-promise-router')();
const movieController = require('../controller/movie.controller');
const userController = require('../controller/user.controller');

// SELECIONAR FILME POR TITULO
router.get('/movie/title', userController.AuthMiddleware, movieController.getMovieByTitle);

// SELECIONAR FILME ALEATORIAMENTE
router.get('/movie/surpriseMe', movieController.surpriseMe);

module.exports = router;
