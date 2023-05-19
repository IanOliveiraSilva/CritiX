const express = require('express');
const cors = require('cors');

// ==> Rotas da API:
const index = require('./route/index');
const reviewRoute = require('./route/review.routes');
const userRoute = require('./route/user.routes');
const movieRoute = require('./route/movie.routes')


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));

app.use(cors());
app.use(index);
app.use('/api/', reviewRoute);
app.use('/api/', userRoute);
app.use('/api/', movieRoute);

module.exports = app;