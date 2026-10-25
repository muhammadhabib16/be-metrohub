const { Router } = require('express');
const authenticate = require('../../shared/middlewares/authenticate');

const router = Router();

// Semua endpoint modul Keuangan butuh login; permission dicek per route.
router.use(authenticate);

router.use('/categories', require('./categories/categories.routes'));
router.use('/transactions', require('./transactions/transactions.routes'));
router.use('/summary', require('./summary/summary.routes'));

module.exports = router;
