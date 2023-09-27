const router = require('express-promise-router')();
const listController = require('../controller/list.controller');
const userController = require('../controller/user.controller');

/**
 * @swagger
 * /api/list:
 *   post:
 *     summary: Criar uma nova lista.
 *     description: Cria uma nova lista com base nos parâmetros fornecidos.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da lista.
 *               description:
 *                 type: string
 *                 description: Descrição da lista.
 *               movieTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Títulos dos filmes na lista.
 *               isPublic:
 *                 type: boolean
 *                 description: Define se a lista é pública ou privada.
 *     responses:
 *       '201':
 *         description: Lista criada com sucesso.
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
 *                     list:
 *                       type: object
 *                       description: Dados da lista criada.
 *       '400':
 *         description: Requisição inválida, faltando campos obrigatórios.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/list', userController.AuthMiddleware, listController.createList);

/**
 * @swagger
 * /api/allLists:
 *   get:
 *     summary: Obter todas as listas de um usuário.
 *     description: Obtém todas as listas de filmes de um usuário específico.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Listas de filmes encontradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: O ID da lista de filmes.
 *                   user:
 *                     type: string
 *                     description: Nome de usuário do proprietário da lista.
 *                   list_name:
 *                     type: string
 *                     description: Nome da lista de filmes.
 *                   movie_titles:
 *                     type: array
 *                     description: Títulos dos filmes na lista.
 *                     items:
 *                       type: string
 *                   list_description:
 *                     type: string
 *                     description: Descrição da lista de filmes.
 *                   Created_At:
 *                     type: string
 *                     format: date-time
 *                     description: Data e hora de criação da lista.
 *       '400':
 *         description: O usuário não possui listas de filmes.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/allLists', userController.AuthMiddleware, listController.getAllLists);

/**
 * @swagger
 * /api/listById:
 *   get:
 *     summary: Obter uma lista de filmes por ID.
 *     description: Obtém uma lista de filmes por seu ID, pertencente a um usuário específico.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da lista de filmes a ser obtida.
 *     responses:
 *       '200':
 *         description: Lista de filmes encontrada com sucesso.
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
 *                     Lista:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           description: Nome de usuário do proprietário da lista.
 *                         list_name:
 *                           type: string
 *                           description: Nome da lista de filmes.
 *                         movie_titles:
 *                           type: array
 *                           description: Títulos dos filmes na lista.
 *                           items:
 *                             type: string
 *                         list_description:
 *                           type: string
 *                           description: Descrição da lista de filmes.
 *                         Created_At:
 *                           type: string
 *                           format: date-time
 *                           description: Data e hora de criação da lista.
 *       '404':
 *         description: Não foi possível encontrar a lista com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/listById', userController.AuthMiddleware, listController.getListById);

/**
 * @swagger
 * /api/list:
 *   delete:
 *     summary: Apagar lista de filmes.
 *     description: Apaga uma lista de filmes com base no ID da lista.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da lista de filmes a ser apagada.
 *     responses:
 *       '200':
 *         description: Lista de filmes apagada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 list:
 *                   type: object
 *                   description: Dados da lista de filmes apagada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID da lista de filmes apagada.
 *       '404':
 *         description: Não foi possível encontrar a lista de filmes com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.delete('/list', userController.AuthMiddleware, listController.deleteList);

/**
 * @swagger
 * /api/list:
 *   put:
 *     summary: Atualizar lista de filmes.
 *     description: Atualiza uma lista de filmes com base no ID da lista.
 *     tags:
 *       - Lista
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
 *                 description: O ID da lista de filmes a ser atualizada.
 *               name:
 *                 type: string
 *                 description: Novo nome para a lista de filmes.
 *               description:
 *                 type: string
 *                 description: Nova descrição para a lista de filmes.
 *               isPublic:
 *                 type: boolean
 *                 description: Define se a lista de filmes será pública ou privada.
 *               movieTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Títulos dos filmes na lista.
 *     responses:
 *       '200':
 *         description: Lista de filmes atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 list:
 *                   type: object
 *                   description: Dados da lista de filmes atualizada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID da lista de filmes atualizada.
 *       '400':
 *         description: Requisição inválida, faltando campos obrigatórios.
 *       '404':
 *         description: Não foi possível encontrar a lista de filmes com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.put('/list', userController.AuthMiddleware, listController.updateList);

/**
 * @swagger
 * /api/list:
 *   patch:
 *     summary: Atualizar parcialmente uma lista de filmes.
 *     description: Atualiza parcialmente uma lista de filmes com base no ID da lista.
 *     tags:
 *       - Lista
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
 *                 description: O ID da lista de filmes a ser atualizada.
 *               name:
 *                 type: string
 *                 description: Novo nome para a lista de filmes (opcional).
 *               description:
 *                 type: string
 *                 description: Nova descrição para a lista de filmes (opcional).
 *               isPublic:
 *                 type: boolean
 *                 description: Define se a lista de filmes será pública ou privada (opcional).
 *               movieTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Títulos dos filmes na lista (opcional).
 *     responses:
 *       '200':
 *         description: Lista de filmes atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 list:
 *                   type: object
 *                   description: Dados da lista de filmes atualizada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID da lista de filmes atualizada.
 *       '404':
 *         description: Não foi possível encontrar a lista de filmes com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.patch('/list', userController.AuthMiddleware, listController.updateListPartially);


module.exports = router;
