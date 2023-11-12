const router = require('express-promise-router')();
const gameController = require('../controller/game.controller');

router.get('/game/title', gameController.getGameByTitle);

router.get('/game/id', gameController.getGameById);

module.exports = router;
