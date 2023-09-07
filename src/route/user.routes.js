const router = require('express-promise-router')();
const userController = require('../controller/user.controller');

//CRIAR USUARIO
router.post('/user/signup', userController.signup);

//CRIAR PERFIL
router.post('/user/profile/', userController.AuthMiddleware, userController.userProfile);

// SELECIONAR PERFIL
router.get('/user/profile/', userController.AuthMiddleware, userController.getUserProfile);

// ATUALIZAR PERFIL
router.put('/user/profile/', userController.AuthMiddleware, userController.updateUserProfile);

router.patch('/user/profile/', userController.AuthMiddleware, userController.updateUserProfilePartially);


module.exports = router;