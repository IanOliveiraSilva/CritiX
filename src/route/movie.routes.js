const router = require('express-promise-router')();
const movieController = require('../controller/movie.controller');
const userController = require('../controller/user.controller')

// SELECIONAR FILME POR TITULO
router.get('/movie/', userController.AuthMiddleware, movieController.getMovieByTitle);
module.exports = router;