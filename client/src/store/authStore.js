import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../api/supabase';

export const useAuthStore = create(
  persist(
    (set) => ({
      session: null,
      user: null,
      loading: true,

      setSession: (session) => set({ session, user: session?.user || null, loading: false }),
      clear: () => set({ session: null, user: null, loading: false }),

      bootstrap: async () => {
        const { data } = await supabase.auth.getSession();
        set({ session: data.session, user: data.session?.user || null, loading: false });
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ session, user: session?.user || null, loading: false });
        });
      },

      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        set({ session: data.session, user: data.user, loading: false });
        return data;
      },

      signUp: async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: username || email.split('@')[0] } },
        });
        if (error) throw error;
        set({ session: data.session, user: data.user, loading: false });
        return data;
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, loading: false });
      },
    }),
    {
      name: 'streamvault.authstore',
      partialize: (state) => ({ session: state.session, user: state.user }),
    }
  )
);
