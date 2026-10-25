const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth/auth.routes'));
router.use('/users', require('./users/users.routes'));
router.use('/roles', require('./roles/roles.routes'));
router.use('/dashboard', require('./dashboard/dashboard.routes'));
router.use('/office-settings', require('./office-settings/officeSettings.routes'));
router.use('/menu', require('./menu/menu.routes'));

module.exports = router;
