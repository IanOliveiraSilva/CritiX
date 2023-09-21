const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'CritiX',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

router.get("/signup", (req, res) => {
  res.oidc.login({
    returnTo: "/",
    authorizationParams: { screen_hint: "signup" },
  });
});

router.get('/login2', function (req, res, next) {
  res.render('login2', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Login page'
  });
});

router.get('/createList', function (req, res, next) {
  res.render('createList', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Create List page'
  });
});

router.get('/getAllLists', function (req, res, next) {
  res.render('getAllLists', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get All Lists page'
  });
});

router.get('/updateList', function (req, res, next) {
  res.render('updateList', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Update List page'
  });
});

router.get('/deleteList', function (req, res, next) {
  res.render('deleteList', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Delete List page'
  });
});

router.get('/register2', function (req, res, next) {
  res.render('register2', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Register page'
  });
});

router.get('/createReview', function (req, res, next) {
  res.render('createReview', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Create Review page'
  });
});

router.get('/getAllReviews', function (req, res, next) {
  res.render('getAllReviews', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get All Review'
  });
});

router.get('/getAllUserReviews', function (req, res, next) {
  res.render('getAllReviewsUser', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get All Review from a User Page'
  });
});

router.get('/getAllMovieReviews', function (req, res, next) {
  res.render('getAllReviewsMovie', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get All Review from a Movie Page'
  });
});

router.get('/getMovie', function (req, res, next) {
  res.render('getMovie', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get a Movie'
  });
});

router.get('/getMovieSurprise', function (req, res, next) {
  res.render('getMovieSurprise', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get a Surprise Movie'
  });
});

router.get('/deleteReview', function (req, res, next) {
  res.render('deleteReview', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Delete Review'
  });
});

router.get('/updateReview', function (req, res, next) {
  res.render('updateReview', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Update Review'
  });
});

router.get('/createComment', function (req, res, next) {
  res.render('createComment', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Create Comment Page'
  });
});

router.get('/getAllReviewsComments', function (req, res, next) {
  res.render('getAllReviewsComments', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'getAllReviewsComments Page'
  });
});

router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Successful!',
    version: '1.0.0',
  });
});

module.exports = router;
