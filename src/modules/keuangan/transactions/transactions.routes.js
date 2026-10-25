const { Router } = require('express');
const controller = require('./transactions.controller');
const schema = require('./transactions.schema');
const { KEUANGAN } = require('../permissions');
const { idParam } = require('../../../shared/utils/commonSchemas');
const authorize = require('../../../shared/middlewares/authorize');
const validate = require('../../../shared/middlewares/validate');

const router = Router();

router.use(authorize(KEUANGAN.KELOLA));

router.get('/', validate({ query: schema.listQuery }), controller.list);
router.post('/', validate({ body: schema.createSchema }), controller.create);
router.patch('/:id', validate({ params: idParam, body: schema.updateSchema }), controller.update);
router.delete('/:id', validate({ params: idParam }), controller.remove);

module.exports = router;
