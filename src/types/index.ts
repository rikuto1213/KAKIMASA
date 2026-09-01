// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  points: number;
  avatar?: string;
  createdAt: Date;
}

// Restaurant related types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  phoneNumber: string;
  email: string;
  website?: string;
  openingHours: OpeningHours;
  pointsPerVisit: number;
  discounts: Discount[];
}

export interface OpeningHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export interface TimeSlot {
  open: string;
  close: string;
  closed?: boolean;
}

// Reservation related types
export interface Reservation {
  id: string;
  restaurantId: string;
  userId: string;
  date: Date;
  time: string;
  numberOfPeople: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  pointsEarned?: number;
  createdAt: Date;
}

// Points related types
export interface PointsTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'used';
  amount: number;
  restaurantId?: string;
  reservationId?: string;
  description: string;
  date: Date;
}

// Discount related types
export interface Discount {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  pointsRequired: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  validUntil: Date;
  active: boolean;
}

// Review related types
export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
