const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerSpec = require('../swagger');
const swaggerUi = require('swagger-ui-express');
const app = express();

// Configuração do View Engine e pasta de views
app.set('views', path.join(__dirname, '..', 'public', 'views'));
app.set('view engine', 'ejs');

// Middleware para processar dados JSON e formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Middleware para permitir requisições de diferentes origens
app.use(cors());

// Rotas
const index = require('./route/index');
const reviewRoute = require('./route/review.routes');
const userRoute = require('./route/user.routes');
const movieRoute = require('./route/movie.routes');
const listRoute = require('./route/list.routes');
const commentRoute = require('./route/comment.routes');

// Middleware para o uso das rotas
app.use(index);
app.use('/api/', reviewRoute);
app.use('/api/', userRoute);
app.use('/api/', movieRoute);
app.use('/api/', listRoute);
app.use('/api/', commentRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
