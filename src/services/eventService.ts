import { apiService } from './apiService';
import { API_CONFIG } from '../config/api';
import { EventPackage, EventInquiry } from '../types';

export class EventService {
  // Get event packages
  static async getEventPackages() {
    try {
      const response = await apiService.get<EventPackage[]>(
        API_CONFIG.ENDPOINTS.EVENTS.GET_PACKAGES
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching event packages:', error);
      throw error;
    }
  }

  // Get event venues
  static async getEventVenues() {
    try {
      const response = await apiService.get<any[]>(
        API_CONFIG.ENDPOINTS.EVENTS.GET_VENUES
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching event venues:', error);
      throw error;
    }
  }

  // Create event inquiry
  static async createEventInquiry(inquiryData: {
    packageId: string;
    contactName: string;
    email: string;
    phone: string;
    eventDate: string;
    guestCount: number;
    message?: string;
  }) {
    try {
      const response = await apiService.post<EventInquiry>(
        API_CONFIG.ENDPOINTS.EVENTS.CREATE_INQUIRY,
        inquiryData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating event inquiry:', error);
      throw error;
    }
  }

  // Check event availability
  static async checkEventAvailability(date: string, packageId: string) {
    try {
      const response = await apiService.post<any>(
        API_CONFIG.ENDPOINTS.EVENTS.GET_AVAILABILITY,
        { date, packageId }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking event availability:', error);
      throw error;
    }
  }
}