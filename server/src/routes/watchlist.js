const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/watchlistController');

const router = express.Router();

router.use(requireAuth);
router.get('/', ctrl.list);
router.post('/', ctrl.add);
router.delete('/:tmdb_id', ctrl.remove);

module.exports = router;
