const axios = require('axios');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
});

tmdb.interceptors.request.use((config) => {
  config.params = { ...(config.params || {}), api_key: TMDB_API_KEY };
  return config;
});

const get = async (path, params = {}) => {
  if (!TMDB_API_KEY) {
    const err = new Error('TMDB_API_KEY is not configured');
    err.status = 500;
    throw err;
  }
  const { data } = await tmdb.get(path, { params });
  return data;
};

module.exports = {
  trending: () => get('/trending/all/week'),
  popularMovies: (page = 1) => get('/movie/popular', { page }),
  topRatedMovies: (page = 1) => get('/movie/top_rated', { page }),
  movieGenres: () => get('/genre/movie/list'),
  movieDetail: (id) => get(`/movie/${id}`, { append_to_response: 'videos,credits,recommendations' }),
  popularTv: (page = 1) => get('/tv/popular', { page }),
  topRatedTv: (page = 1) => get('/tv/top_rated', { page }),
  tvDetail: (id) => get(`/tv/${id}`, { append_to_response: 'videos,credits,recommendations' }),
  searchMulti: (query, page = 1) => get('/search/multi', { query, page, include_adult: false }),
};
