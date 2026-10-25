const { Router } = require('express');
const authenticate = require('../../shared/middlewares/authenticate');

const router = Router();

// Semua endpoint modul Magang butuh login; permission dicek per route.
router.use(authenticate);

router.use('/interns', require('./interns/interns.routes'));
router.use('/attendances', require('./attendances/attendances.routes'));
router.use('/logbooks', require('./logbooks/logbooks.routes'));
router.use('/tasks', require('./tasks/tasks.routes'));

module.exports = router;
