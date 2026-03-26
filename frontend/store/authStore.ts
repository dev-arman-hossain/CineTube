import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '../types';
import apiClient from '../services/apiClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateUser: (user: User) => void;
  setHydrated: (isHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (data) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      fetchMe: async () => {
        try {
          const response = await apiClient.get('/auth/me');
          set({ user: response.data.data, isAuthenticated: true });
        } catch (error) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
      updateUser: (user: User) => {
        set({ user });
      },
      setHydrated: (isHydrated: boolean) => {
        set({ isHydrated });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
