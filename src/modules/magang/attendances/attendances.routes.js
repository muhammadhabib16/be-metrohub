const { Router } = require('express');
const controller = require('./attendances.controller');
const schema = require('./attendances.schema');
const { FOTO_DIR } = require('./attendances.service');
const { MAGANG } = require('../permissions');
const { idParam } = require('../../../shared/utils/commonSchemas');
const authorize = require('../../../shared/middlewares/authorize');
const validate = require('../../../shared/middlewares/validate');
const uploadPhoto = require('../../../shared/middlewares/uploadPhoto');

const router = Router();
const upload = uploadPhoto(FOTO_DIR);

// Anak magang. upload harus sebelum validate agar req.body terisi dari multipart.
router.get('/today', authorize(MAGANG.ABSEN), controller.getHariIni);
router.get('/me', authorize(MAGANG.ABSEN), validate({ query: schema.periodeQuery }), controller.riwayatSaya);
router.post('/checkin', authorize(MAGANG.ABSEN), upload, validate({ body: schema.lokasiSchema }), controller.checkIn);
router.post('/checkout', authorize(MAGANG.ABSEN), upload, validate({ body: schema.lokasiSchema }), controller.checkOut);

// Admin
router.get('/', authorize(MAGANG.KELOLA), validate({ query: schema.rekapQuery }), controller.rekap);
router.get('/photos/:filename', authorize(MAGANG.KELOLA), validate({ params: schema.fotoParam }), controller.getFoto);
router.patch('/:id', authorize(MAGANG.KELOLA), validate({ params: idParam, body: schema.koreksiSchema }), controller.koreksi);

module.exports = router;
