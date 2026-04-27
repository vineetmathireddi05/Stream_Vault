const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.post('/logout', requireAuth, ctrl.logout);
router.get('/me', requireAuth, ctrl.me);

module.exports = router;
