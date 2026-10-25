const { Router } = require('express');
const controller = require('./interns.controller');
const schema = require('./interns.schema');
const { MAGANG } = require('../permissions');
const { idParam } = require('../../../shared/utils/commonSchemas');
const authorize = require('../../../shared/middlewares/authorize');
const validate = require('../../../shared/middlewares/validate');

const router = Router();

// Anak magang (route /me harus di atas /:id)
router.get('/me', authorize(MAGANG.ABSEN), controller.getProfilSaya);

// Admin
router.get('/', authorize(MAGANG.KELOLA), validate({ query: schema.listQuery }), controller.list);
router.post('/', authorize(MAGANG.KELOLA), validate({ body: schema.createSchema }), controller.create);
router.get('/:id', authorize(MAGANG.KELOLA), validate({ params: idParam }), controller.getById);
router.patch('/:id', authorize(MAGANG.KELOLA), validate({ params: idParam, body: schema.updateSchema }), controller.update);
router.patch(
  '/:id/status-kerja',
  authorize(MAGANG.KELOLA),
  validate({ params: idParam, body: schema.statusKerjaSchema }),
  controller.setStatusKerja,
);

module.exports = router;
