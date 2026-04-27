import { api } from './client';

export const getWatchlist = () => api.get('/watchlist').then((r) => r.data.items);

export const addToWatchlist = (item) => api.post('/watchlist', item).then((r) => r.data.item);

export const removeFromWatchlist = (tmdb_id, media_type = 'movie') =>
  api
    .delete(`/watchlist/${tmdb_id}`, { params: { media_type } })
    .then((r) => r.data);

export const getHistory = () => api.get('/history').then((r) => r.data.items);

export const upsertHistory = (entry) => api.post('/history', entry).then((r) => r.data.item);

export const getProfile = () => api.get('/profiles/me').then((r) => r.data.profile);

export const updateProfile = (patch) =>
  api.patch('/profiles/me', patch).then((r) => r.data.profile);
