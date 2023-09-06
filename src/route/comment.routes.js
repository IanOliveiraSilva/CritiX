const router = require('express-promise-router')();
const commentController = require('../controller/comment.controller');
const userController = require('../controller/user.controller');



// ADICIONAR COMENTARIO
router.post('/comment', userController.AuthMiddleware, commentController.createComment);

// SELECIONAR TODOS COMENTARIOS DE UM USUARIO
router.get('/comment/user/', userController.AuthMiddleware, commentController.getAllCommentsFromUser);

// SELECIONAR TODOS COMENTARIOS DE UM USUARIO
router.get('/comment/review/:reviewId', userController.AuthMiddleware, commentController.getReviewComments);

// APAGAR REVIEW
router.delete('/comment/', userController.AuthMiddleware, commentController.deleteComment);

module.exports = router;