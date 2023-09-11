const router = require('express-promise-router')();
const reviewController = require('../controller/review.controller');
const userController = require('../controller/user.controller');

// ADICIONAR REVIEWS
router.post('/review', userController.AuthMiddleware, reviewController.createReview);

// SELECIONAR REVIEW POR ID
router.get('/reviewById/', userController.AuthMiddleware, reviewController.getReviewById);

// SELECIONAR TODAS REVIEWS 
router.get('/allReviews/', userController.AuthMiddleware, reviewController.getAllReviews);

// SELECIONAR TODAS REVIEWS DE UM FILME
router.get('/allReviews/movies/', userController.AuthMiddleware, reviewController.getAllReviewsFromMovie);

// SELECIONAR TODAS REVIEWS DE UM USUARIO
router.get('/allReviews/user/', userController.AuthMiddleware, reviewController.getAllReviewsFromUser);

// APAGAR REVIEW
router.delete('/review/', userController.AuthMiddleware, reviewController.deleteReview);

// ATUALIZAR REVIEW
router.put('/review/', userController.AuthMiddleware, reviewController.updateReview);

router.patch('/review/', userController.AuthMiddleware, reviewController.updateReviewPartionally);

module.exports = router;
