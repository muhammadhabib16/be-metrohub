const { Router } = require('express');
const controller = require('./roles.controller');
const { setPermissionsSchema } = require('./roles.schema');
const { CORE } = require('../permissions');
const { idParam } = require('../../shared/utils/commonSchemas');
const authenticate = require('../../shared/middlewares/authenticate');
const authorize = require('../../shared/middlewares/authorize');
const validate = require('../../shared/middlewares/validate');

const router = Router();

router.use(authenticate, authorize(CORE.PENGGUNA));

router.get('/', controller.list);
router.get('/permissions', controller.daftarPermission);
router.get('/:id/permissions', validate({ params: idParam }), controller.getPermissions);
router.put('/:id/permissions', validate({ params: idParam, body: setPermissionsSchema }), controller.setPermissions);

module.exports = router;
