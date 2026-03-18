import { apiService } from './apiService';
import { API_CONFIG } from '../config/api';
import { Booking, BookingRequest } from '../types';

export class BookingService {
  // Create new booking
  static async createBooking(bookingData: BookingRequest) {
    try {
      const response = await apiService.post<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.CREATE,
        bookingData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId: string) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.BOOKINGS.GET_BY_ID.replace('{id}', bookingId);
      const response = await apiService.get<Booking>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  // Get user bookings
  static async getUserBookings(userId: string) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.BOOKINGS.GET_USER_BOOKINGS.replace('{userId}', userId);
      const response = await apiService.get<Booking[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  // Update booking
  static async updateBooking(bookingId: string, updateData: Partial<BookingRequest>) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE.replace('{id}', bookingId);
      const response = await apiService.put<Booking>(endpoint, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Cancel booking
  static async cancelBooking(bookingId: string, reason?: string) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.BOOKINGS.CANCEL.replace('{id}', bookingId);
      const response = await apiService.post<Booking>(endpoint, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Check booking availability
  static async checkBookingAvailability(availabilityData: any) {
    try {
      const response = await apiService.post<any>(
        API_CONFIG.ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY,
        availabilityData
      );
      return response.data;
    } catch (error) {
      console.error('Error checking booking availability:', error);
      throw error;
    }
  }
}