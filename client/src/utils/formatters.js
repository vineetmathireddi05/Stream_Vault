export const formatRuntime = (mins) => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatYear = (date) => (date ? new Date(date).getFullYear() : '');

export const formatRating = (vote) => (vote ? Number(vote).toFixed(1) : 'NR');

export const truncate = (text, max = 200) =>
  text && text.length > max ? `${text.slice(0, max).trim()}…` : text || '';

export const titleOf = (item) => item?.title || item?.name || 'Untitled';
export const releaseOf = (item) => item?.release_date || item?.first_air_date || '';
export const mediaTypeOf = (item) =>
  item?.media_type || (item?.first_air_date || item?.name ? 'tv' : 'movie');
