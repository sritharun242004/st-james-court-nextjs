import { apiService } from './apiService';
import { API_CONFIG } from '../config/api';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

export class AuthService {
  // Login user
  static async login(credentials: LoginRequest) {
    try {
      const response = await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // Store auth token
      if (response.data.token) {
        apiService.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Register user
  static async register(userData: RegisterRequest) {
    try {
      const response = await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );
      
      // Store auth token
      if (response.data.token) {
        apiService.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  // Logout user
  static async logout() {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      apiService.removeAuthToken();
    } catch (error) {
      console.error('Error logging out:', error);
      // Remove token even if logout fails
      apiService.removeAuthToken();
      throw error;
    }
  }

  // Get user profile
  static async getProfile() {
    try {
      const response = await apiService.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Refresh token
  static async refreshToken() {
    try {
      const response = await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH
      );
      
      if (response.data.token) {
        apiService.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!apiService.getAuthToken();
  }
}