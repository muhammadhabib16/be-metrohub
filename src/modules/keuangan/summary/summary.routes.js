const { Router } = require('express');
const controller = require('./summary.controller');
const { summaryQuery } = require('./summary.schema');
const { KEUANGAN } = require('../permissions');
const authorize = require('../../../shared/middlewares/authorize');
const validate = require('../../../shared/middlewares/validate');

const router = Router();

router.get('/', authorize(KEUANGAN.LIHAT), validate({ query: summaryQuery }), controller.getRingkasanBulan);

module.exports = router;
