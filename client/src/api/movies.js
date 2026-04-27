import { api } from './client';

export const fetchTrending = () => api.get('/movies/trending').then((r) => r.data);
export const fetchPopularMovies = () => api.get('/movies/popular').then((r) => r.data);
export const fetchTopRatedMovies = () => api.get('/movies/top-rated').then((r) => r.data);
export const fetchMovieDetail = (id) => api.get(`/movies/${id}`).then((r) => r.data);
export const fetchPopularTv = () => api.get('/tv/popular').then((r) => r.data);
export const fetchTopRatedTv = () => api.get('/tv/top-rated').then((r) => r.data);
export const fetchTvDetail = (id) => api.get(`/tv/${id}`).then((r) => r.data);
export const fetchSearch = (q) =>
  api.get('/search', { params: { q } }).then((r) => r.data);
