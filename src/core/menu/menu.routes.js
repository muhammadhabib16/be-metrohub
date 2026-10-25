const { Router } = require('express');
const controller = require('./menu.controller');
const authenticate = require('../../shared/middlewares/authenticate');

const router = Router();

router.get('/', authenticate, controller.getMenu);

module.exports = router;
