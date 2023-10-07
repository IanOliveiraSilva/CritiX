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
 * /api/list/favoriteMovies:
 *   get:
 *     summary: Obter a lista de filmes favoritos do usuario.
 *     description: Obtém a lista de filmes favoritos do usuario, pertencente a o usuario autenticado.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
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
router.get('/list/favoriteMovies', userController.AuthMiddleware, listController.getListByName);

/**
 * @swagger
 * /api/list/movie:
 *   get:
 *     summary: Obter listas de filmes por título.
 *     description: Obtém listas de filmes que contenham um título específico.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: movie_titles
 *         schema:
 *           type: string
 *         required: true
 *         description: O título do filme a ser usado para buscar listas.
 *     responses:
 *       '200':
 *         description: Listas de filmes encontradas com sucesso.
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
 *                       type: array
 *                       description: Lista de listas de filmes correspondentes ao título fornecido.
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                             description: Nome de usuário do proprietário da lista.
 *                           list_name:
 *                             type: string
 *                             description: Nome da lista de filmes.
 *                           movie_titles:
 *                             type: array
 *                             description: Títulos dos filmes na lista.
 *                             items:
 *                               type: string
 *                           list_description:
 *                             type: string
 *                             description: Descrição da lista de filmes.
 *                           Created_At:
 *                             type: string
 *                             format: date-time
 *                             description: Data e hora de criação da lista.
 *       '404':
 *         description: Não foi possível encontrar nenhuma lista com o título do filme fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/list/movie', userController.AuthMiddleware, listController.getListByMovie);

/**
 * @swagger
 * /api/list/user:
 *   get:
 *     summary: Obter listas de filmes por usuario.
 *     description: Obtém listas de filmes que contenham um usuario específico.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userProfile
 *         schema:
 *           type: string
 *         required: true
 *         description: O usuario a ser usado para buscar listas.
 *     responses:
 *       '200':
 *         description: Listas de filmes encontradas com sucesso.
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
 *                       type: array
 *                       description: Lista de listas de filmes correspondentes ao título fornecido.
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                             description: Nome de usuário do proprietário da lista.
 *                           list_name:
 *                             type: string
 *                             description: Nome da lista de filmes.
 *                           movie_titles:
 *                             type: array
 *                             description: Títulos dos filmes na lista.
 *                             items:
 *                               type: string
 *                           list_description:
 *                             type: string
 *                             description: Descrição da lista de filmes.
 *                           Created_At:
 *                             type: string
 *                             format: date-time
 *                             description: Data e hora de criação da lista.
 *       '404':
 *         description: Não foi possível encontrar nenhuma lista com o título do filme fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/list/user', userController.AuthMiddleware, listController.getListByUser);

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

/**
 * @swagger
 * /api/watchlist:
 *   patch:
 *     summary: Atualizar a watchlist.
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
 *               name:
 *                 type: string
 *                 description: Novo nome para a lista de filmes (opcional).
 *               description:
 *                 type: string
 *                 description: Nova descrição para a lista de filmes (opcional).
 *               isPublic:
 *                 type: boolean
 *                 description: Define se a lista de filmes será pública ou privada (opcional).
 *               movieTitle:
 *                 type: string
 *                 description: Título do filme a ser adicionado à lista (opcional).
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
 *                     name:
 *                       type: string
 *                       description: Nome da lista de filmes.
 *                     description:
 *                       type: string
 *                       description: Descrição da lista de filmes.
 *                     isPublic:
 *                       type: boolean
 *                       description: Define se a lista de filmes é pública ou privada.
 *                     movies:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Títulos dos filmes na lista.
 *       '400':
 *         description: O filme já está na lista ou requisição inválida.
 *       '404':
 *         description: Não foi possível encontrar a lista de filmes com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.patch('/watchlist', userController.AuthMiddleware, listController.updateWatchlist);

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     summary: Obter a watchlist do usuario autenticado.
 *     description: Obtém a lista de filmes do usuário baseado no nome da lista e no ID do usuário.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
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
 *                   description: Dados da lista de filmes encontrada.
 *                   properties:
 *                     Lista:
 *                       type: object
 *                       description: Informações da lista de filmes.
 *                       properties:
 *                         user:
 *                           type: string
 *                           description: Nome de usuário associado à lista de filmes.
 *                         list_name:
 *                           type: string
 *                           description: Nome da lista de filmes.
 *                         movie_titles:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Títulos dos filmes na lista.
 *                         list_description:
 *                           type: string
 *                           description: Descrição da lista de filmes.
 *                         Created_At:
 *                           type: string
 *                           format: date-time
 *                           description: Data de criação da lista de filmes.
 *       '404':
 *         description: Não foi possível encontrar a lista de filmes para o usuário.
 *       '500':
 *         description: Erro interno do servidor ao buscar a lista de filmes.
 */
router.get('/watchlist', userController.AuthMiddleware, listController.getWatchlist);

/**
 * @swagger
 * /api/user/watchlist:
 *   get:
 *     summary: Obter a watchlist de um usuário específico.
 *     description: Obtém a lista de filmes de um usuário específico com base no nome da lista, no ID do usuário e no perfil do usuário.
 *     tags:
 *       - Lista
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userprofile
 *         schema:
 *           type: string
 *         description: Perfil do usuário para filtrar a lista (opcional).
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
 *                   description: Dados da lista de filmes encontrada.
 *                   properties:
 *                     Lista:
 *                       type: object
 *                       description: Informações da lista de filmes.
 *                       properties:
 *                         user_profile:
 *                           type: string
 *                           description: Perfil do usuário associado à lista de filmes.
 *                         list_name:
 *                           type: string
 *                           description: Nome da lista de filmes.
 *                         movie_titles:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Títulos dos filmes na lista.
 *                         list_description:
 *                           type: string
 *                           description: Descrição da lista de filmes.
 *                         Created_At:
 *                           type: string
 *                           format: date-time
 *                           description: Data de criação da lista de filmes.
 *       '404':
 *         description: Não foi possível encontrar a lista de filmes para o usuário com o perfil fornecido.
 *       '500':
 *         description: Erro interno do servidor ao buscar a lista de filmes.
 */
router.get('/user/watchlist', userController.AuthMiddleware, listController.getUserWatchlist);

/**
 * @swagger
 * /api/watchlist/remove:
 *   delete:
 *     summary: Remover um filme da watchlist.
 *     description: Remove um filme da lista de filmes do usuário com base no nome da lista e no ID do usuário.
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
 *               movieTitle:
 *                 type: string
 *                 description: Título do filme a ser removido da lista.
 *     responses:
 *       '200':
 *         description: Filme removido da lista com sucesso.
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
 *                   description: Dados da lista de filmes atualizada após a remoção do filme.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: O ID da lista de filmes atualizada.
 *       '400':
 *         description: O filme não está na lista ou requisição inválida.
 *       '404':
 *         description: Não foi possível encontrar a lista de filmes com o ID fornecido.
 *       '500':
 *         description: Erro interno do servidor ao remover o filme da lista.
 */
router.delete('/watchlist/remove', userController.AuthMiddleware, listController.removeFromWatchlist);


module.exports = router;
