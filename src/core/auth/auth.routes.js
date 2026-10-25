const { Router } = require('express');
const controller = require('./auth.controller');
const { loginSchema, ubahPasswordSchema } = require('./auth.schema');
const authenticate = require('../../shared/middlewares/authenticate');
const validate = require('../../shared/middlewares/validate');

const router = Router();

router.post('/login', validate({ body: loginSchema }), controller.login);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);
router.patch('/password', authenticate, validate({ body: ubahPasswordSchema }), controller.ubahPassword);

module.exports = router;
