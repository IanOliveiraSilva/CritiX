const router = require('express').Router();

const routes = [
  { path: '/profile', title: 'Profile page' },
  { path: '/createProfile', title: 'Create Profile page' },
  { path: '/register2', title: 'Register page' },
  { path: '/login2', title: 'Login page' },
  { path: '/createList', title: 'Create List page' },
  { path: '/getAllLists', title: 'Get All Lists page' },
  { path: '/getAllMovieLists', title: 'Get All Movie Lists page' },
  { path: '/updateList', title: 'Update List page' },
  { path: '/deleteList', title: 'Delete List page' },
  { path: '/createReview', title: 'Create Review page' },
  { path: '/getAllReviews', title: 'Get All Review' },
  { path: '/getAllUserReviews', title: 'Get All Review from a User Page' },
  { path: '/getAllMovieReviews', title: 'Get All Review from a Movie Page' },
  { path: '/deleteReview', title: 'Delete Review' },
  { path: '/updateReview', title: 'Update Review' },
  { path: '/createComment', title: 'Create Comment Page' },
  { path: '/getAllReviewsComments', title: 'getAllReviewsComments Page' },
  { path: '/getMovie', title: 'Get a Movie' },
  { path: '/getMovieSurprise', title: 'Get a Surprise Movie' },
  { path: '/', title: 'CritiX' }
];

routes.forEach((route) => {
  router.get(route.path, (req, res, next) => {
    res.render(route.path.slice(1), { title: route.title });
  });
});

module.exports = router;
