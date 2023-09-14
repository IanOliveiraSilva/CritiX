const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const Auth0Lock = require('auth0-lock');
const lock = new Auth0Lock('98Vu4GGbLqr3q5EzRPV52lxAQswGHsAf', 'https://dev-q0cc14eebp14ttye.us.auth0.com');


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'CritiX',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/login', (req, res) => {
  res.oidc.login({ returnTo: '/profile' });
});

router.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: '/' });
});

router.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const { accessToken } = req.oidc;
    lock.getUserInfo(accessToken, function(error, profile) {
      if (!error) {
        res.render('profile', {
          userProfile: JSON.stringify(profile, null, 2),
          title: 'Profile page',
          bio: profile['https://critix-402174fcc250.herokuapp.com/bio'],
          familyName: profile['https://critix-402174fcc250.herokuapp.com/familyName'],
          givenName: profile['https://critix-402174fcc250.herokuapp.com/givenName']
        });
      } else {
      }
    });
  } else {
    res.redirect('/login');
  }
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
