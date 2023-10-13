const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CritiX',
      version: '1.0.0',
      description: 'Uma plataforma para avaliação de filmes!',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: [], // Para rotas que precisam de autenticação
      },
    ],
  },
  apis: ['src/route/*.js'], // Caminho para as rotas
};

// Gera o swagger com as opções fornecidas
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
