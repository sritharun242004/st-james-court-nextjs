import { apiService } from './apiService';
import { API_CONFIG } from '../config/api';
import { Review } from '../types';

export class ReviewService {
  // Get all reviews
  static async getAllReviews(page = 0, size = 10, category?: string) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(category && { category })
      });
      
      const response = await apiService.get<any>(
        `${API_CONFIG.ENDPOINTS.REVIEWS.GET_ALL}?${params}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Create review
  static async createReview(reviewData: {
    roomId?: string;
    rating: number;
    title: string;
    content: string;
    stayDate: string;
  }) {
    try {
      const response = await apiService.post<Review>(
        API_CONFIG.ENDPOINTS.REVIEWS.CREATE,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Get reviews by room
  static async getReviewsByRoom(roomId: string) {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.REVIEWS.GET_BY_ROOM.replace('{roomId}', roomId);
      const response = await apiService.get<Review[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching room reviews:', error);
      throw error;
    }
  }

  // Get review statistics
  static async getReviewStats() {
    try {
      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.REVIEWS.GET_STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }
}