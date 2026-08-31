import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@constants/index';
import { useAuthStore } from '@store/useAuthStore';

class ApiService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && originalRequest) {
          // Try to refresh token
          const refreshToken = useAuthStore.getState().refreshToken;
          if (refreshToken) {
            try {
              // Refresh token logic - implement on backend
              // const response = await this.apiClient.post('/auth/refresh', { refreshToken });
              // useAuthStore.getState().setToken(response.data.token, response.data.refreshToken);
              // return this.apiClient(originalRequest);
            } catch (refreshError) {
              useAuthStore.getState().logout();
              return Promise.reject(refreshError);
            }
          } else {
            useAuthStore.getState().logout();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.apiClient.post('/auth/login', { email, password });
  }

  async signup(name: string, email: string, password: string, phone: string) {
    return this.apiClient.post('/auth/signup', { name, email, password, phone });
  }

  async logout() {
    return this.apiClient.post('/auth/logout');
  }

  // Restaurant endpoints
  async getRestaurants(latitude?: number, longitude?: number, radius?: number) {
    return this.apiClient.get('/restaurants', {
      params: { latitude, longitude, radius },
    });
  }

  async getRestaurantDetails(restaurantId: string) {
    return this.apiClient.get(`/restaurants/${restaurantId}`);
  }

  async searchRestaurants(query: string) {
    return this.apiClient.get('/restaurants/search', { params: { q: query } });
  }

  // Reservation endpoints
  async getReservations() {
    return this.apiClient.get('/reservations');
  }

  async createReservation(restaurantId: string, date: string, time: string, numberOfPeople: number, specialRequests?: string) {
    return this.apiClient.post('/reservations', {
      restaurantId,
      date,
      time,
      numberOfPeople,
      specialRequests,
    });
  }

  async cancelReservation(reservationId: string) {
    return this.apiClient.put(`/reservations/${reservationId}/cancel`);
  }

  // Points endpoints
  async getUserPoints() {
    return this.apiClient.get('/points');
  }

  async getPointsTransactions() {
    return this.apiClient.get('/points/transactions');
  }

  // User endpoints
  async getUserProfile() {
    return this.apiClient.get('/user/profile');
  }

  async updateUserProfile(userData: any) {
    return this.apiClient.put('/user/profile', userData);
  }

  // Favorites endpoints
  async addFavorite(restaurantId: string) {
    return this.apiClient.post('/favorites', { restaurantId });
  }

  async removeFavorite(restaurantId: string) {
    return this.apiClient.delete(`/favorites/${restaurantId}`);
  }

  async getFavorites() {
    return this.apiClient.get('/favorites');
  }

  // Reviews endpoints
  async getRestaurantReviews(restaurantId: string) {
    return this.apiClient.get(`/restaurants/${restaurantId}/reviews`);
  }

  async createReview(restaurantId: string, rating: number, comment: string) {
    return this.apiClient.post(`/restaurants/${restaurantId}/reviews`, {
      rating,
      comment,
    });
  }
}

export const apiService = new ApiService();
              // const response = await this.refreshAccessToken(refreshToken);
              // useAuthStore.getState().setToken(response.token, response.refreshToken);
              // return this.apiClient(originalRequest);
            } catch (refreshError) {
              useAuthStore.getState().logout();
              return Promise.reject(refreshError);
            }
          } else {
            useAuthStore.getState().logout();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.apiClient.post('/auth/login', { email, password });
  }

  async signup(name: string, email: string, password: string, phone: string) {
    return this.apiClient.post('/auth/signup', { name, email, password, phone });
  }

  async logout() {
    return this.apiClient.post('/auth/logout');
  }

  // Restaurant endpoints
  async getRestaurants(latitude?: number, longitude?: number, radius?: number) {
    return this.apiClient.get('/restaurants', {
      params: { latitude, longitude, radius },
    });
  }

  async getRestaurantDetails(restaurantId: string) {
    return this.apiClient.get(`/restaurants/${restaurantId}`);
  }

  async searchRestaurants(query: string) {
    return this.apiClient.get('/restaurants/search', { params: { q: query } });
  }

  // Reservation endpoints
  async getReservations() {
    return this.apiClient.get('/reservations');
  }

  async createReservation(restaurantId: string, date: string, time: string, numberOfPeople: number, specialRequests?: string) {
    return this.apiClient.post('/reservations', {
      restaurantId,
      date,
      time,
      numberOfPeople,
      specialRequests,
    });
  }

  async cancelReservation(reservationId: string) {
    return this.apiClient.put(`/reservations/${reservationId}/cancel`);
  }

  // Points endpoints
  async getUserPoints() {
    return this.apiClient.get('/points');
  }

  async getPointsTransactions() {
    return this.apiClient.get('/points/transactions');
  }

  // User endpoints
  async getUserProfile() {
    return this.apiClient.get('/user/profile');
  }

  async updateUserProfile(userData: any) {
    return this.apiClient.put('/user/profile', userData);
  }

  // Favorites endpoints
  async addFavorite(restaurantId: string) {
    return this.apiClient.post('/favorites', { restaurantId });
  }

  async removeFavorite(restaurantId: string) {
    return this.apiClient.delete(`/favorites/${restaurantId}`);
  }

  async getFavorites() {
    return this.apiClient.get('/favorites');
  }

  // Reviews endpoints
  async getRestaurantReviews(restaurantId: string) {
    return this.apiClient.get(`/restaurants/${restaurantId}/reviews`);
  }

  async createReview(restaurantId: string, rating: number, comment: string) {
    return this.apiClient.post(`/restaurants/${restaurantId}/reviews`, {
      rating,
      comment,
    });
  }
}

export const apiService = new ApiService();
