import { create } from 'zustand';
import type { Reservation, Restaurant } from '../types';

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  favorites: string[]; // Restaurant IDs
  userReservations: Reservation[];
  isLoading: boolean;

  // Actions
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  addFavorite: (restaurantId: string) => void;
  removeFavorite: (restaurantId: string) => void;
  isFavorited: (restaurantId: string) => boolean;
  setUserReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  favorites: [],
  userReservations: [],
  isLoading: false,

  setRestaurants: (restaurants) => set({ restaurants }),

  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),

  addFavorite: (restaurantId) => {
    set((state) => ({
      favorites: [...new Set([...state.favorites, restaurantId])],
    }));
  },

  removeFavorite: (restaurantId) => {
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== restaurantId),
    }));
  },

  isFavorited: (restaurantId) => {
    return get().favorites.includes(restaurantId);
  },

  setUserReservations: (reservations) => set({ userReservations: reservations }),

  addReservation: (reservation) => {
    set((state) => ({
      userReservations: [reservation, ...state.userReservations],
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
