const express = require('express');
const ctrl = require('../controllers/movieController');

const router = express.Router();

router.get('/popular', ctrl.tvPopular);
router.get('/top-rated', ctrl.tvTopRated);
router.get('/:id', ctrl.tvDetail);

module.exports = router;
