import { STORAGE_KEYS } from '@constants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { AuthResponse, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken: string) => void;
  setAuth: (authResponse: AuthResponse) => void;
  logout: () => void;
  initialize: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user }),

  setToken: (token, refreshToken) => {
    set({ token, refreshToken });
    AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  setAuth: (authResponse) => {
    set({
      user: authResponse.user,
      token: authResponse.token,
      refreshToken: authResponse.refreshToken,
      isAuthenticated: true,
    });
    AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authResponse.user));
    AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.token);
    AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
  },

  logout: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    AsyncStorage.removeItem(STORAGE_KEYS.USER);
    AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  initialize: async () => {
    try {
      const [user, token, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      if (user && token && refreshToken) {
        set({
          user: JSON.parse(user),
          token,
          refreshToken,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: (userUpdate) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userUpdate } : null,
    }));
  },
}));
