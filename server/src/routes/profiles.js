const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/profileController');

const router = express.Router();

router.use(requireAuth);
router.get('/me', ctrl.getMe);
router.patch('/me', ctrl.updateMe);

module.exports = router;
