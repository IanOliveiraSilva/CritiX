const router = require('express-promise-router')();
const reviewController = require('../controller/review.controller');
const userController = require('../controller/user.controller');

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Criar uma Avaliação.
 *     description: Cria uma avaliação 
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: Avaliação
 *         description: Dados da avaliação a serem criadas.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             rating:
 *               type: integer
 *             comment:
 *               type: string
 *             isPublic:
 *               type: boolean
 *             specialRating:
 *               type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nome do filme.
 *               rating:
 *                 type: integer
 *                 description: Nota do filme.
 *               comment:
 *                 type: string
 *                 description: Avaliação do filme.
 *               isPublic:
 *                 type: boolean
 *                 description: Avaliação pública ou não.
 *               specialRating:
 *                 type: integer
 *                 description: Avaliação especial do filme.
 *     responses:
 *       '201':
 *         description: Avaliação criada com sucesso.
 *       '400':
 *         description: Erro nos dados de entrada.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/review', userController.AuthMiddleware, reviewController.createReview);

/**
 * @swagger
 * /api/reviewById:
 *   get:
 *     summary: Obter uma avaliação.
 *     description: Obtém uma avaliação pelo ID.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: O ID da avaliação.
 *     responses:
 *       '200':
 *         description: Avaliação encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 body:
 *                   type: object
 *                   properties:
 *                     review:
 *                       type: object
 *                       description: Dados da avaliação.
 *                       properties:
 *                         username:
 *                           type: string
 *                           description: Nome do usuário que fez a avaliação.
 *                         title:
 *                           type: string
 *                           description: Título do filme avaliado.
 *                         rating:
 *                           type: integer
 *                           description: Nota dada ao filme.
 *                         specialrating:
 *                           type: integer
 *                           description: Avaliação especial do filme.
 *                         review:
 *                           type: string
 *                           description: Comentário sobre o filme.
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           description: Data e hora da criação da avaliação.
 *       '404':
 *         description: Não foi possível encontrar a avaliação com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */

router.get('/reviewById/', userController.AuthMiddleware, reviewController.getReviewById);

/**
 * @swagger
 * /api/allReviews:
 *   get:
 *     summary: Obter todas as avaliações.
 *     description: Obtém todas as avaliações disponíveis.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Avaliações encontradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 body:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       description: Lista de avaliações.
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: Nome do usuário que fez a avaliação.
 *                           title:
 *                             type: string
 *                             description: Título do filme avaliado.
 *                           rating:
 *                             type: integer
 *                             description: Nota dada ao filme.
 *                           specialrating:
 *                             type: integer
 *                             description: Avaliação especial do filme.
 *                           review:
 *                             type: string
 *                             description: Comentário sobre o filme.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             description: Data e hora da criação da avaliação.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/allReviews/', userController.AuthMiddleware, reviewController.getAllReviews);

/**
 * @swagger
 * /api/allReviews/movies:
 *   get:
 *     summary: Obter todas as avaliações de um filme pelo título.
 *     description: Obtém todas as avaliações de um filme com base no título do filme.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: O título do filme para o qual deseja obter as avaliações.
 *     responses:
 *       '200':
 *         description: Avaliações encontradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 body:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       description: Lista de avaliações do filme.
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: Nome do usuário que fez a avaliação.
 *                           title:
 *                             type: string
 *                             description: Título do filme avaliado.
 *                           genre:
 *                             type: string
 *                             description: Gênero do filme.
 *                           rating:
 *                             type: integer
 *                             description: Nota dada ao filme.
 *                           specialrating:
 *                             type: integer
 *                             description: Avaliação especial do filme.
 *                           review:
 *                             type: string
 *                             description: Comentário sobre o filme.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             description: Data e hora da criação da avaliação.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/allReviews/movies', userController.AuthMiddleware, reviewController.getAllReviewsFromMovie);

/**
 * @swagger
 * /api/allReviews/user:
 *   get:
 *     summary: Obter todas as avaliações de um usuário.
 *     description: Obtém todas as avaliações feitas por um usuário autenticado com base no nome de usuário.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userProfile
 *         schema:
 *           type: string
 *         description: O nome de usuário do usuário cujas avaliações serão obtidas.
 *     responses:
 *       '200':
 *         description: Avaliações encontradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 body:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       description: Lista de avaliações do usuário.
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: Nome do usuário que fez a avaliação.
 *                           title:
 *                             type: string
 *                             description: Título do filme avaliado.
 *                           genre:
 *                             type: string
 *                             description: Gênero do filme.
 *                           rating:
 *                             type: integer
 *                             description: Nota dada ao filme.
 *                           specialrating:
 *                             type: integer
 *                             description: Avaliação especial do filme.
 *                           review:
 *                             type: string
 *                             description: Comentário sobre o filme.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             description: Data e hora da criação da avaliação.
 *       '400':
 *         description: Nenhuma avaliação encontrada para o usuário.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/allReviews/user', userController.AuthMiddleware, reviewController.getAllReviewsFromUser);

/**
 * @swagger
 * /api/review:
 *   delete:
 *     summary: Apagar avaliação.
 *     description: Apaga uma avaliação com base no ID da avaliação.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da avaliação a ser apagada.
 *     responses:
 *       '200':
 *         description: Avaliação apagada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 review:
 *                   type: object
 *                   description: Dados da avaliação apagada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID da avaliação apagada.
 *                     # Adicione outras propriedades da avaliação aqui, se necessário.
 *       '404':
 *         description: Não foi possível encontrar a avaliação com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.delete('/review', userController.AuthMiddleware, reviewController.deleteReview);

/**
 * @swagger
 * /api/review:
 *   put:
 *     summary: Atualizar avaliação.
 *     description: Atualiza uma avaliação com base no ID da avaliação.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: O ID da avaliação a ser atualizada.
 *               rating:
 *                 type: integer
 *                 description: Nota a ser atualizada na avaliação.
 *               review:
 *                 type: string
 *                 description: Comentário a ser atualizado na avaliação.
 *               specialRating:
 *                 type: integer
 *                 description: Avaliação especial a ser atualizada na avaliação.
 *     responses:
 *       '200':
 *         description: Avaliação atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 review:
 *                   type: object
 *                   description: Dados da avaliação atualizada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID da avaliação atualizada.
 *       '400':
 *         description: Requisição inválida, faltando campos obrigatórios.
 *       '404':
 *         description: Não foi possível encontrar a avaliação com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.put('/review', userController.AuthMiddleware, reviewController.updateReview);

/**
 * @swagger
 * /api/review:
 *   patch:
 *     summary: Atualizar avaliação parcialmente.
 *     description: Atualiza parcialmente uma avaliação com base no ID da avaliação.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: O ID da avaliação a ser atualizada.
 *               rating:
 *                 type: integer
 *                 description: Nova nota para a avaliação (opcional).
 *               review:
 *                 type: string
 *                 description: Novo comentário para a avaliação (opcional).
 *               ispublic:
 *                 type: boolean
 *                 description: Novo status de público para a avaliação (opcional).
 *               specialrating:
 *                 type: integer
 *                 description: Nova avaliação especial para a avaliação (opcional).
 *     responses:
 *       '200':
 *         description: Avaliação atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 review:
 *                   type: object
 *                   description: Dados da avaliação atualizada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID da avaliação atualizada.
 *       '404':
 *         description: Não foi possível encontrar a avaliação com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.patch('/review', userController.AuthMiddleware, reviewController.updateReviewPartionally);

/**
 * @swagger
 * /api/lastActivity:
 *   get:
 *     summary: Obter as ultimas avaliações.
 *     description: Obtém as ultimas avaliações disponíveis.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Avaliações encontradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 body:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       description: Lista de avaliações.
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: Nome do usuário que fez a avaliação.
 *                           title:
 *                             type: string
 *                             description: Título do filme avaliado.
 *                           rating:
 *                             type: integer
 *                             description: Nota dada ao filme.
 *                           specialrating:
 *                             type: integer
 *                             description: Avaliação especial do filme.
 *                           review:
 *                             type: string
 *                             description: Comentário sobre o filme.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             description: Data e hora da criação da avaliação.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/lastActivity', userController.AuthMiddleware, reviewController.getLastActivity);

/**
 * @swagger
 * /api/reviewsThisYear:
 *   get:
 *     summary: Obter todas avaliações do ano atual.
 *     description: Obtém todas avaliações do ano atual disponíveis.
 *     tags:
 *       - Avaliação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Avaliações encontradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 body:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       description: Lista de avaliações.
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: Nome do usuário que fez a avaliação.
 *                           title:
 *                             type: string
 *                             description: Título do filme avaliado.
 *                           rating:
 *                             type: integer
 *                             description: Nota dada ao filme.
 *                           specialrating:
 *                             type: integer
 *                             description: Avaliação especial do filme.
 *                           review:
 *                             type: string
 *                             description: Comentário sobre o filme.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             description: Data e hora da criação da avaliação.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/reviewsThisYear', userController.AuthMiddleware, reviewController.getThisYearReview);

module.exports = router;
