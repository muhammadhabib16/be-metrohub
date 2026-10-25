const { Router } = require('express');
const controller = require('./officeSettings.controller');
const { updateSchema } = require('./officeSettings.schema');
const { CORE } = require('../permissions');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');
const validate = require('../../shared/middlewares/validate');

const router = Router();

router.use(authenticate, authorize(CORE.LOKASI));

router.get('/', controller.get);
router.put('/', validate({ body: updateSchema }), controller.update);

module.exports = router;
