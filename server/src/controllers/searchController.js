const tmdb = require('../services/tmdb');

exports.search = async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim();
    if (!q) return res.json({ results: [], page: 1, total_results: 0 });
    const data = await tmdb.searchMulti(q, req.query.page || 1);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
