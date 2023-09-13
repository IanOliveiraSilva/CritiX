const express = require('express');
const {  auth  } = require('express-openid-connect');
const path = require('path');
const router = require('../src/route/index');
const cors = require('cors');

const app = express();

app.set('views', path.join(__dirname, '..', 'public', 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
app.use(cors());

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'minhaChaveSecretaSuperSegura123!@#',
  baseURL: 'http://localhost:3000',
  clientID: '98Vu4GGbLqr3q5EzRPV52lxAQswGHsAf',
  issuerBaseURL: 'https://dev-q0cc14eebp14ttye.us.auth0.com'
};

app.use(auth(config));

app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router);

const index = require('./route/index');
const reviewRoute = require('./route/review.routes');
const userRoute = require('./route/user.routes');
const movieRoute = require('./route/movie.routes');
const listRoute = require('./route/list.routes');
const commentRoute = require('./route/comment.routes');

app.use(index);
app.use('/api/', reviewRoute);
app.use('/api/', userRoute);
app.use('/api/', movieRoute);
app.use('/api/', listRoute);
app.use('/api/', commentRoute);

module.exports = app;
