const router = require('express').Router();

const routes = [
  { path: '/profile', title: 'Profile page' },
  { path: '/createProfile', title: 'Create Profile page' },
  { path: '/register', title: 'Register page' },
  { path: '/login', title: 'Login page' },
  { path: '/createList', title: 'Create List page' },
  { path: '/getAllLists', title: 'Get All Lists page' },
  { path: '/getAllMovieLists', title: 'Get All Movie Lists page' },
  { path: '/updateList', title: 'Update List page' },
  { path: '/createReview', title: 'Create Review page' },
  { path: '/getAllReviews', title: 'Get All Review' },
  { path: '/getAllUserReviews', title: 'Get All Review from a User Page' },
  { path: '/getAllMovieReviews', title: 'Get All Review from a Movie Page' },
  { path: '/updateReview', title: 'Update Review' },
  { path: '/getAllReviewsComments', title: 'getAllReviewsComments Page' },
  { path: '/getMovie', title: 'Get a Movie' },
  { path: '/getMovieSurprise', title: 'Get a Surprise Movie' },
  { path: '/getProfileByUserProfile', title: 'Get a user Profile'},
  { path: '/updateProfile', title: 'Update user Profile'},
  { path: '/getAllUserLists', title: 'Get all User Lists'},
  { path: '/getWatchlist', title: 'Get Watchlist'},
  { path: '/getMovieByTitle', title: 'Get Movie By Title'},
  { path: '/getUserWatchlist', title: 'Get a user watchlist'},
  { path: '/getListById', title: 'Get List By ID'},
  { path: '/getReviewById', title: 'Get Review By ID'},
  { path: '/updateComment', title: 'Update Comment'},
  { path: '/changePassword', title: 'Change Password'},
  { path: '/getGame', title: 'Get Game'},
  { path: '/', title: 'CritiX' }
];

routes.forEach((route) => {
  router.get(route.path, (req, res, next) => {
    res.render(route.path.slice(1), { title: route.title });
  });
});

module.exports = router;
