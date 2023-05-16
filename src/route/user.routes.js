const router = require('express-promise-router')();
const userController = require('../controller/user.controller')

//CRIAR PESSOA
router.post('/user/signup', userController.signup);

module.exports = router;