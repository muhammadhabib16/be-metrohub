const { Router } = require('express');
const controller = require('./users.controller');
const schema = require('./users.schema');
const { CORE } = require('../permissions');
const { idParam } = require('../../shared/utils/commonSchemas');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');
const validate = require('../../shared/middlewares/validate');

const router = Router();

router.use(authenticate, authorize(CORE.PENGGUNA));

router.get('/', validate({ query: schema.listQuery }), controller.list);
router.post('/', validate({ body: schema.createSchema }), controller.create);
router.get('/:id', validate({ params: idParam }), controller.getById);
router.patch('/:id', validate({ params: idParam, body: schema.updateSchema }), controller.update);
router.patch('/:id/status', validate({ params: idParam, body: schema.statusSchema }), controller.setStatus);

module.exports = router;
