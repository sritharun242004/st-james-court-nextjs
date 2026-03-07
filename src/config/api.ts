// API Configuration for Java Backend Integration
export const API_CONFIG = {
  // Base URL for the Java backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },

    // Rooms
    ROOMS: {
      GET_ALL: '/rooms',
      GET_BY_ID: '/rooms/{id}',
      GET_AVAILABILITY: '/rooms/availability',
      GET_PRICING: '/rooms/pricing'
    },

    // Bookings
    BOOKINGS: {
      CREATE: '/bookings',
      GET_BY_ID: '/bookings/{id}',
      GET_USER_BOOKINGS: '/bookings/user/{userId}',
      UPDATE: '/bookings/{id}',
      CANCEL: '/bookings/{id}/cancel',
      CHECK_AVAILABILITY: '/bookings/check-availability'
    },

    // Events
    EVENTS: {
      GET_PACKAGES: '/events/packages',
      GET_VENUES: '/events/venues',
      CREATE_INQUIRY: '/events/inquiry',
      GET_AVAILABILITY: '/events/availability'
    },

    // Contact & Inquiries
    CONTACT: {
      SEND_MESSAGE: '/contact/message',
      NEWSLETTER: '/contact/newsletter',
      GET_FAQ: '/contact/faq'
    },

    // Reviews & Testimonials
    REVIEWS: {
      GET_ALL: '/reviews',
      CREATE: '/reviews',
      GET_BY_ROOM: '/reviews/room/{roomId}',
      GET_STATS: '/reviews/stats'
    },

    // Amenities & Services
    AMENITIES: {
      GET_ALL: '/amenities',
      GET_BY_CATEGORY: '/amenities/category/{category}'
    },

    // Attractions & Explore
    ATTRACTIONS: {
      GET_ALL: '/attractions',
      GET_BY_CATEGORY: '/attractions/category/{category}',
      GET_DAY_TRIPS: '/attractions/day-trips'
    }
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}