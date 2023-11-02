const router = require('express-promise-router')();
const userController = require('../controller/user.controller');

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Criar usuário.
 *     description: Cria um novo usuário na plataforma.
 *     tags:
 *       - Usuário
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Dados do usuário a serem criados.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome de usuário.
 *               email:
 *                 type: string
 *                 description: Endereço de e-mail.
 *               password:
 *                 type: string
 *                 description: Senha do usuário.
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *       '400':
 *         description: Erro nos dados de entrada.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/user/signup', userController.signup);

/**
 * @swagger
 * api/user/login:
 *   post:
 *     summary: Fazer login.
 *     description: Permite que um usuário faça login na plataforma.
 *     tags:
 *       - Usuário
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Credenciais de login do usuário.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Endereço de e-mail do usuário.
 *             password:
 *               type: string
 *               description: Senha do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Endereço de e-mail do usuário.
 *               password:
 *                 type: string
 *                 description: Senha do usuário.
 *     responses:
 *       '200':
 *         description: Login bem-sucedido. Retorna o usuário e um token JWT.
 *       '400':
 *         description: Erro nos dados de entrada.
 *       '401':
 *         description: Credenciais inválidas.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/user/login', userController.login);

router.post('/user/changePassword', userController.AuthMiddleware, userController.changePassword);

/**
 * @swagger
 * /api/user/profile:
 *   post:
 *     summary: Criar perfil de usuário.
 *     description: Cria um perfil de usuário com informações pessoais e uma foto de perfil.
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário.
 *               familyName:
 *                 type: string
 *                 description: Sobrenome do usuário.
 *               bio:
 *                 type: string
 *                 description: Biografia do usuário.
 *               icon:
 *                 type: file
 *                 description: Foto de perfil do usuário.
 *     responses:
 *       '201':
 *         description: Perfil de usuário criado com sucesso.
 *       '400':
 *         description: Erro nos dados de entrada.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/user/profile', userController.AuthMiddleware, userController.createUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Obter perfil de usuário.
 *     description: Obtém o perfil de um usuário autenticado.
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfil de usuário encontrado com sucesso.
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
 *                     profile:
 *                       type: object
 *                       description: Dados do perfil do usuário.
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Nome do usuário.
 *                         familyName:
 *                           type: string
 *                           description: Sobrenome do usuário.
 *                         bio:
 *                           type: string
 *                           description: Biografia do usuário.
 *                         contadorreviews:
 *                           type: integer
 *                           description: Número de revisões do usuário.
 *                         contadorlists:
 *                           type: integer
 *                           description: Número de listas do usuário.
 *                         iconBase64:
 *                           type: string
 *                           description: Ícone do perfil do usuário em formato Base64.
 *       '500':
 *         description: Erro interno do servidor.
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/user/profile', userController.AuthMiddleware, userController.getUserProfile);

/**
 * @swagger
 * /api/user/profile/:
 *   get:
 *     summary: Obter perfil de usuário pelo ID.
 *     description: Obtém o perfil de um usuário pelo ID.
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userProfile
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do perfil do usuário.
 *     responses:
 *       '200':
 *         description: Perfil de usuário encontrado com sucesso.
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
 *                     profile:
 *                       type: object
 *                       description: Dados do perfil do usuário.
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Nome do usuário.
 *                         familyName:
 *                           type: string
 *                           description: Sobrenome do usuário.
 *                         bio:
 *                           type: string
 *                           description: Biografia do usuário.
 *                         contadorreviews:
 *                           type: integer
 *                           description: Número de revisões do usuário.
 *                         contadorlists:
 *                           type: integer
 *                           description: Número de listas do usuário.
 *                         iconBase64:
 *                           type: string
 *                           description: Ícone do perfil do usuário em formato Base64.
 *       '400':
 *         description: Usuário não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/profile/userProfile', userController.AuthMiddleware, userController.getProfileByUser);

router.get('/profile/searchUsers', userController.AuthMiddleware, userController.searchUsers);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Atualizar perfil de usuário.
 *     description: Atualiza o perfil de um usuário autenticado.
 *     tags:
 *       - Usuário
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
 *                 description: Nome do usuário.
 *               familyName:
 *                 type: string
 *                 description: Sobrenome do usuário.
 *               bio:
 *                 type: string
 *                 description: Biografia do usuário.
 *     responses:
 *       '200':
 *         description: Perfil de usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 profile:
 *                   type: object
 *                   description: Dados do perfil do usuário atualizado.
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nome do usuário atualizado.
 *                     familyName:
 *                       type: string
 *                       description: Sobrenome do usuário atualizado.
 *                     bio:
 *                       type: string
 *                       description: Biografia do usuário atualizada.
 *       '500':
 *         description: Erro interno do servidor.
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.put('/user/profile', userController.AuthMiddleware, userController.updateUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     summary: Atualizar perfil de usuário parcialmente.
 *     description: Atualiza parcialmente o perfil de um usuário autenticado.
 *     tags:
 *       - Usuário
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
 *                 description: Novo nome do usuário (opcional).
 *               familyName:
 *                 type: string
 *                 description: Novo sobrenome do usuário (opcional).
 *               bio:
 *                 type: string
 *                 description: Nova biografia do usuário (opcional).
 *     responses:
 *       '200':
 *         description: Perfil de usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                 profile:
 *                   type: object
 *                   description: Dados do perfil do usuário atualizado.
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nome do usuário atualizado.
 *                     familyName:
 *                       type: string
 *                       description: Sobrenome do usuário atualizado.
 *                     bio:
 *                       type: string
 *                       description: Biografia do usuário atualizada.
 *       '500':
 *         description: Erro interno do servidor.
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.patch('/user/profile', userController.AuthMiddleware, userController.updateUserProfilePartially);

/**
 * @swagger
 * /api/user/rating/:
 *   get:
 *     summary: Obter contagem de avaliações do usuário logado.
 *     description: Obtém a contagem de avaliações de um usuário logado.
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Contagem de avaliações do usuário encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rating:
 *                   type: array
 *                   description: Lista de contagens de avaliações.
 *                   items:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: integer
 *                         description: Valor da avaliação.
 *                       count:
 *                         type: integer
 *                         description: Número de avaliações com esse valor.
 *       '500':
 *         description: Erro interno do servidor.
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/user/rating', userController.AuthMiddleware, userController.GetRatingCount);

router.get('/rating/id', userController.AuthMiddleware, userController.GetRatingCountByUser);



module.exports = router;