import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Development environment API base URL
// In production, this would be your actual API URL
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.healthcare-system.com/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    // Get the auth token from storage
    const token = await AsyncStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // If no refresh token, redirect to login
          // This would typically be handled by your auth service
          return Promise.reject(error);
        }
        
        // Request a new token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        // Save the new tokens
        const { token, refreshToken: newRefreshToken } = response.data;
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('refresh_token', newRefreshToken);
        
        // Update the authorization header
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('refresh_token');
        
        // This would typically be handled by your auth service
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      // You could dispatch to a global error store here
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 