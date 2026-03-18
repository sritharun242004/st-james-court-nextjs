import { apiService } from './apiService';
import { API_CONFIG } from '../config/api';
import { Room, AvailabilityRequest, AvailabilityResponse } from '../types';

export class RoomService {
  // Get all rooms
  static async getAllRooms() {
    try {
      const response = await apiService.get<Room[]>(API_CONFIG.ENDPOINTS.ROOMS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  // Get room by ID
  static async getRoomById(roomId: string) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.ROOMS.GET_BY_ID.replace('{id}', roomId);
      const response = await apiService.get<Room>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  // Check room availability
  static async checkAvailability(availabilityData: AvailabilityRequest) {
    try {
      const response = await apiService.post<AvailabilityResponse>(
        API_CONFIG.ENDPOINTS.ROOMS.GET_AVAILABILITY,
        availabilityData
      );
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }

  // Get room pricing
  static async getRoomPricing(roomId: string, checkIn: string, checkOut: string) {
    try {
      const response = await apiService.post<any>(
        API_CONFIG.ENDPOINTS.ROOMS.GET_PRICING,
        { roomId, checkInDate: checkIn, checkOutDate: checkOut }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching pricing:', error);
      throw error;
    }
  }
}