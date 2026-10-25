const { Router } = require('express');
const controller = require('./dashboard.controller');
const { CORE } = require('../permissions');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');

const router = Router();

router.get('/', authenticate, authorize(CORE.DASHBOARD), controller.getRingkasan);

module.exports = router;
