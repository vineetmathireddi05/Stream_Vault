export const TMDB_IMG = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = { sm: 'w185', md: 'w342', lg: 'w500' };
export const BACKDROP_SIZES = { sm: 'w780', lg: 'w1280', orig: 'original' };

export const posterUrl = (path, size = POSTER_SIZES.md) =>
  path ? `${TMDB_IMG}/${size}${path}` : 'https://placehold.co/342x513/141414/808080?text=No+Image';

export const backdropUrl = (path, size = BACKDROP_SIZES.lg) =>
  path ? `${TMDB_IMG}/${size}${path}` : 'https://placehold.co/1280x720/141414/808080?text=StreamVault';

export const profileUrl = (path) =>
  path ? `${TMDB_IMG}/w185${path}` : 'https://placehold.co/185x278/141414/808080?text=?';

export const youTubeUrl = (key) => `https://www.youtube.com/watch?v=${key}`;

export const PLAN_LABELS = {
  free: 'Free',
  standard: 'Standard',
  premium: 'Premium',
};

export const AVATAR_PRESETS = [
  'https://api.dicebear.com/9.x/notionists/svg?seed=Streamer1&backgroundColor=e50914',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Streamer2&backgroundColor=141414',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Streamer3&backgroundColor=1c1c1c',
  'https://api.dicebear.com/9.x/notionists/svg?seed=Streamer4&backgroundColor=4a4a4a',
];
