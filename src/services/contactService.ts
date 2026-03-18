import { apiService } from './apiService';
import { API_CONFIG } from '../config/api';
import { ContactMessage, FAQ } from '../types';

export class ContactService {
  // Send contact message
  static async sendMessage(messageData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    try {
      const response = await apiService.post<ContactMessage>(
        API_CONFIG.ENDPOINTS.CONTACT.SEND_MESSAGE,
        messageData
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Subscribe to newsletter
  static async subscribeNewsletter(email: string) {
    try {
      const response = await apiService.post<any>(
        API_CONFIG.ENDPOINTS.CONTACT.NEWSLETTER,
        { email }
      );
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }

  // Get FAQs
  static async getFAQs() {
    try {
      const response = await apiService.get<FAQ[]>(API_CONFIG.ENDPOINTS.CONTACT.GET_FAQ);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }
}