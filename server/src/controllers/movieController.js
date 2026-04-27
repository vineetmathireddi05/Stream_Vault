const tmdb = require('../services/tmdb');

const wrap = (fn) => async (req, res, next) => {
  try {
    const data = await fn(req);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.trending = wrap(() => tmdb.trending());
exports.popular = wrap((req) => tmdb.popularMovies(req.query.page));
exports.topRated = wrap((req) => tmdb.topRatedMovies(req.query.page));
exports.genres = wrap(() => tmdb.movieGenres());
exports.detail = wrap((req) => tmdb.movieDetail(req.params.id));

exports.tvPopular = wrap((req) => tmdb.popularTv(req.query.page));
exports.tvTopRated = wrap((req) => tmdb.topRatedTv(req.query.page));
exports.tvDetail = wrap((req) => tmdb.tvDetail(req.params.id));
