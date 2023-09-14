const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'CritiX',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

app.get('/login', (req, res) => {
  res.oidc.login({ returnTo: '/profile' });
});

app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: '/' });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
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

router.get('/createReview', requiresAuth(), function (req, res, next) {
  res.render('createReview', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Create Review page'
  });
});

router.get('/getAllUserReviews', function (req, res, next) {
  res.render('getAllReviewsUser', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get All Review from a User Page'
  });
});

router.get('/getAllMovieReviews', requiresAuth(), function (req, res, next) {
  res.render('getAllReviewsMovie', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get All Review from a Movie Page'
  });
});

router.get('/getMovie', requiresAuth(), function (req, res, next) {
  res.render('getMovie', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get a Movie'
  });
});

router.get('/getMovieSurprise', requiresAuth(), function (req, res, next) {
  res.render('getMovieSurprise', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Get a Surprise Movie'
  });
});

router.get('/deleteReview', requiresAuth(), function (req, res, next) {
  res.render('deleteReview', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Delete Review'
  });
});

router.get('/updateReview', requiresAuth(), function (req, res, next) {
  res.render('updateReview', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Update Review'
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
