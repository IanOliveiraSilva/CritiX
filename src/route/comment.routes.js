const router = require('express-promise-router')();
const commentController = require('../controller/comment.controller');
const userController = require('../controller/user.controller');

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Criar um comentário em uma revisão.
 *     description: Cria um novo comentário em uma revisão com base no ID da revisão.
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: integer
 *                 description: O ID da revisão em que o comentário será criado.
 *               comment:
 *                 type: string
 *                 description: O conteúdo do comentário.
 *     responses:
 *       '201':
 *         description: Comentário criado com sucesso.
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
 *                   description: Dados do comentário criado.
 *                   properties:
 *                     comment:
 *                       type: object
 *                       description: Dados do comentário criado.
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: O ID do comentário criado.
 *       '400':
 *         description: Revisão não encontrada ou tentativa de comentar na própria revisão.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/comment', userController.AuthMiddleware, commentController.createComment);

/**
 * @swagger
 * /api/comment/user/:
 *   get:
 *     summary: Obter todos os comentários de um usuário.
 *     description: Obtém todos os comentários feitos por um usuário.
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Comentários obtidos com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Uma lista de comentários feitos pelo usuário.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: O ID do comentário.
 *                   reviewid:
 *                     type: integer
 *                     description: O ID da revisão relacionada ao comentário.
 *                   movieid:
 *                     type: integer
 *                     description: O ID do filme relacionado à revisão e ao comentário.
 *                   title:
 *                     type: string
 *                     description: O título do filme.
 *                   comment:
 *                     type: string
 *                     description: O conteúdo do comentário.
 *                   createdAt:
 *                     type: string
 *                     description: Data e hora em que o comentário foi criado.
 *       '400':
 *         description: O usuário não possui comentários.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/comment/user/', userController.AuthMiddleware, commentController.getAllCommentsFromUser);

/**
 * @swagger
 * /api/comment/review:
 *   get:
 *     summary: Obter comentários de uma revisão.
 *     description: Obtém todos os comentários feitos em uma revisão específica com base no ID da revisão.
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da revisão para a qual deseja obter comentários.
 *     responses:
 *       '200':
 *         description: Comentários obtidos com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Uma lista de comentários feitos na revisão especificada.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: O ID do comentário.
 *                   userId:
 *                     type: integer
 *                     description: O ID do usuário que fez o comentário.
 *                   username:
 *                     type: string
 *                     description: O nome de usuário do autor do comentário.
 *                   comment:
 *                     type: string
 *                     description: O conteúdo do comentário.
 *                   createdAt:
 *                     type: string
 *                     description: Data e hora em que o comentário foi criado.
 *       '404':
 *         description: A revisão não possui comentários.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/comment/review', userController.AuthMiddleware, commentController.getReviewComments);

/**
 * @swagger
 * /api/comment:
 *   delete:
 *     summary: Excluir comentário.
 *     description: Exclui um comentário com base no ID do comentário.
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do comentário a ser excluído.
 *     responses:
 *       '200':
 *         description: Comentário excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 comment:
 *                   type: object
 *                   description: Dados do comentário excluído.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID do comentário excluído.
 *       '404':
 *         description: Não foi possível encontrar o comentário com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.delete('/comment', userController.AuthMiddleware, commentController.deleteComment);

/**
 * @swagger
 * /api/comment:
 *   put:
 *     summary: Atualizar comentário.
 *     description: Atualiza um comentário com base no ID do comentário.
 *     tags:
 *       - Comentários
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
 *                 description: O ID do comentário a ser atualizado.
 *               comment:
 *                 type: string
 *                 description: Novo texto do comentário.
 *     responses:
 *       '200':
 *         description: Comentário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 comment:
 *                   type: object
 *                   description: Dados do comentário atualizado.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID do comentário atualizado.
 *       '400':
 *         description: Requisição inválida, faltando campos obrigatórios.
 *       '404':
 *         description: Não foi possível encontrar o comentário com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.put('/comment', userController.AuthMiddleware, commentController.updateComment);

module.exports = router;