const router = require('express-promise-router')();
const movieController = require('../controller/movie.controller');

/**
 * @swagger
 * /api/movie/title:
 *   get:
 *     summary: Obter informações de um filme por título.
 *     description: Obtém informações de um filme com base no título fornecido.
 *     tags:
 *       - Filme
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Título do filme a ser pesquisado.
 *     responses:
 *       '200':
 *         description: Informações do filme obtidas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: object
 *                   properties:
 *                     movieData:
 *                       type: object
 *                     movie:
 *                       type: object
 *       '404':
 *         description: Filme não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/movie/title', movieController.getMovieByTitle);

/**
 * @swagger
 * /api/movie/title:
 *   get:
 *     summary: Obter informações de um filme por título.
 *     description: Obtém informações de um filme com base no título fornecido.
 *     tags:
 *       - Filme
 *     parameters:
 *       - in: query
 *         name: imdbID
 *         schema:
 *           type: string
 *         required: true
 *         description: Título do filme a ser pesquisado.
 *     responses:
 *       '200':
 *         description: Informações do filme obtidas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: object
 *                   properties:
 *                     movieData:
 *                       type: object
 *                     movie:
 *                       type: object
 *       '404':
 *         description: Filme não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/movie/id', movieController.getMovieById);

/**
 * @swagger
 * /api/movie/surpriseMe/:
 *   get:
 *     summary: Surpreenda-me com um filme aleatório.
 *     description: Obtém informações sobre um filme aleatório para surpreender o usuário.
 *     tags:
 *       - Filme
 *     responses:
 *       '200':
 *         description: Filme aleatório obtido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: object
 *                   properties:
 *                     omdbMovie:
 *                       type: object
 *       '404':
 *         description: Filme não encontrado na OMDB ou TMDB.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/movie/surpriseMe', movieController.surpriseMe);

router.get('/movie/tendency', movieController.getMoviesTendency);

module.exports = router;
