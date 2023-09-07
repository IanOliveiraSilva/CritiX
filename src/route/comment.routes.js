const router = require('express-promise-router')();
const commentController = require('../controller/comment.controller');
const userController = require('../controller/user.controller');



// ADICIONAR COMENTARIO
router.post('/comment', userController.AuthMiddleware, commentController.createComment);

// SELECIONAR TODOS COMENTARIOS DE UM USUARIO
router.get('/comment/user/', userController.AuthMiddleware, commentController.getAllCommentsFromUser);

// SELECIONAR TODOS COMENTARIOS DE UMA REVIEW
router.get('/comment/review/', userController.AuthMiddleware, commentController.getReviewComments);

// APAGAR COMENTARIO
router.delete('/comment/', userController.AuthMiddleware, commentController.deleteComment);

// ATUALIZAR COMENTARIO
router.put('/comment/', userController.AuthMiddleware, commentController.updateComment);

module.exports = router;