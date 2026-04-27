const express = require('express');
const ctrl = require('../controllers/movieController');

const router = express.Router();

router.get('/trending', ctrl.trending);
router.get('/popular', ctrl.popular);
router.get('/top-rated', ctrl.topRated);
router.get('/genres', ctrl.genres);
router.get('/:id', ctrl.detail);

module.exports = router;
