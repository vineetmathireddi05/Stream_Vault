import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  getHistory,
  upsertHistory,
} from '../api/watchlist';
import { useAuthStore } from '../store/authStore';

export const useWatchlist = () => {
  const session = useAuthStore((s) => s.session);
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: getWatchlist,
    enabled: !!session,
  });
};

export const useAddToWatchlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });
};

export const useRemoveFromWatchlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tmdb_id, media_type }) => removeFromWatchlist(tmdb_id, media_type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  });
};

export const useHistory = () => {
  const session = useAuthStore((s) => s.session);
  return useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
    enabled: !!session,
  });
};

export const useUpsertHistory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertHistory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['history'] }),
  });
};
