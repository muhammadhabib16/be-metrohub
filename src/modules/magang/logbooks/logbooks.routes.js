const { Router } = require('express');
const controller = require('./logbooks.controller');
const schema = require('./logbooks.schema');
const { MAGANG } = require('../permissions');
const authorize = require('../../../shared/middlewares/authorize');
const validate = require('../../../shared/middlewares/validate');

const router = Router();

// Anak magang
router.get('/today', authorize(MAGANG.ABSEN), controller.getHariIni);
router.put('/today', authorize(MAGANG.ABSEN), validate({ body: schema.isiSchema }), controller.simpanHariIni);
router.get('/me', authorize(MAGANG.ABSEN), validate({ query: schema.periodeQuery }), controller.riwayatSaya);

// Admin
router.get('/', authorize(MAGANG.KELOLA), validate({ query: schema.listQuery }), controller.list);

module.exports = router;
