const express = require('express');
const path = require('path');
const cors = require('cors');

// ==> Rotas da API:
const index = require('./route/index');
const reviewRoute = require('./route/review.routes');
const userRoute = require('./route/user.routes');
const movieRoute = require('./route/movie.routes');
const listRoute = require('./route/list.routes');
const commentRoute = require('./route/comment.routes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use(index);
app.use('/api/', reviewRoute);
app.use('/api/', userRoute);
app.use('/api/', movieRoute);
app.use('/api/', listRoute);
app.use('/api/', commentRoute);

// Diretório público para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

// Rotas para servir páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'register.html'));
});

app.get('/createReview', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'createReview.html'));
});

app.get('/getAllMovieReviews', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'getAllReviewsMovie.html'));
});

app.get('/getAllUserReviews', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'getAllReviewsUser.html'));
});

app.get('/getMovie', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'getMovie.html'));
});

app.get('/deleteReview', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'deleteReview.html'));
});

app.get('/updateReview', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'updateReview.html'));
});





module.exports = app;
