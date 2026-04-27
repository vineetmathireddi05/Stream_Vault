import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../api/watchlist';
import { useAuthStore } from '../store/authStore';

export const useProfile = () => {
  const session = useAuthStore((s) => s.session);
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!session,
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
};
