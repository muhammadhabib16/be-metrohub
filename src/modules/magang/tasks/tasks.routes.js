const { Router } = require('express');
const controller = require('./tasks.controller');
const schema = require('./tasks.schema');
const { MAGANG } = require('../permissions');
const { idParam } = require('../../../shared/utils/commonSchemas');
const authorize = require('../../../shared/middlewares/authorize');
const validate = require('../../../shared/middlewares/validate');

const router = Router();

// Anak magang
router.get('/me', authorize(MAGANG.ABSEN), controller.listSaya);
router.patch(
  '/:id/progress',
  authorize(MAGANG.ABSEN),
  validate({ params: idParam, body: schema.progressSchema }),
  controller.updateProgress,
);

// Admin
router.get('/', authorize(MAGANG.KELOLA), validate({ query: schema.listQuery }), controller.list);
router.post('/', authorize(MAGANG.KELOLA), validate({ body: schema.createSchema }), controller.create);
router.patch('/:id', authorize(MAGANG.KELOLA), validate({ params: idParam, body: schema.updateSchema }), controller.update);
router.delete('/:id', authorize(MAGANG.KELOLA), validate({ params: idParam }), controller.remove);

module.exports = router;
