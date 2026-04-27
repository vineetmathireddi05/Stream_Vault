const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/historyController');

const router = express.Router();

router.use(requireAuth);
router.get('/', ctrl.list);
router.post('/', ctrl.upsert);

module.exports = router;
