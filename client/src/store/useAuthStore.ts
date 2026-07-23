import { create } from 'zustand';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  clearAuth: () => void;
}

const DEV_MODE = import.meta.env.DEV;

export const useAuthStore = create<AuthState>((set) => ({
  user: DEV_MODE
    ? {
        id: '660000000000000000000000',
        name: 'Admin Developer',
        email: 'admin@geekhell.com',
        role: 'admin',
      }
    : null,
  accessToken: DEV_MODE ? 'dev-admin-token' : null,
  isAuthenticated: DEV_MODE,
  setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));
