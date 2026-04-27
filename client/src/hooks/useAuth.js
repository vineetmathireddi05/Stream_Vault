import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

let bootstrapped = false;

export function useAuth() {
  const state = useAuthStore();

  useEffect(() => {
    if (!bootstrapped) {
      bootstrapped = true;
      state.bootstrap();
    }
  }, [state]);

  return state;
}
