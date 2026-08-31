// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 10000; // 10 seconds

// Points Configuration
export const POINTS_CONFIG = {
  pointsPerVisit: 10,
  pointsPerDollarSpent: 1,
  bonusPointsMultiplier: 1.5,
};

// Distance Configuration
export const DISTANCE_CONFIG = {
  searchRadiusKm: 50,
  defaultZoom: 12,
};

// Pagination
export const PAGINATION = {
  pageSize: 20,
  defaultPage: 1,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  RESERVATION_CONFIRMED: 'reservation_confirmed',
  RESERVATION_REMINDER: 'reservation_reminder',
  POINTS_EARNED: 'points_earned',
  DISCOUNT_AVAILABLE: 'discount_available',
  SPECIAL_OFFER: 'special_offer',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: '@user',
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  FAVORITES: '@favorites',
  RECENT_SEARCHES: '@recent_searches',
  SETTINGS: '@settings',
};
