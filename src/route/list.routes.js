const router = require('express-promise-router')();
const listController = require('../controller/list.controller');
const userController = require('../controller/user.controller');

// CRIAR LISTA
router.post('/list', userController.AuthMiddleware, listController.createList);

// RETORNAR TODAS AS LISTAS
router.get('/allLists/', userController.AuthMiddleware, listController.getAllLists);

// SELECIONAR LISTA POR ID
router.get('/listById/', userController.AuthMiddleware, listController.getListById);

// APAGAR LISTA
router.delete('/list/', userController.AuthMiddleware, listController.deleteList);

// ATUALIZAR REVIEW
router.put('/list/', userController.AuthMiddleware, listController.updateList);

router.patch('/list/', userController.AuthMiddleware, listController.updateListPartially);

module.exports = router;
