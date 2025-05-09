import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Development mode with mock data
const isDevEnvironment = true;

// Mock user data
const mockUser = {
  id: 101,
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'patient',
  profileImage: 'https://i.pravatar.cc/150?u=john.doe@example.com'
};

// Mock authentication token
const mockAuthToken = 'mock_jwt_token_for_development';
const mockRefreshToken = 'mock_refresh_token_for_development';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
}

interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profileImage?: string;
  };
  token: string;
  refreshToken: string;
}

class AuthApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check for valid email/password combination
      if (credentials.email !== 'john.doe@example.com' || credentials.password !== 'password123') {
        throw new Error('Invalid email or password');
      }
      
      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('auth_token', mockAuthToken);
      await AsyncStorage.setItem('refresh_token', mockRefreshToken);
      
      return {
        user: mockUser,
        token: mockAuthToken,
        refreshToken: mockRefreshToken
      };
    }
    
    const response = await api.post('/api/auth/login', credentials);
    
    // Store tokens in AsyncStorage
    await AsyncStorage.setItem('auth_token', response.data.token);
    await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already used
      if (data.email === 'john.doe@example.com') {
        throw new Error('Email is already registered');
      }
      
      // Create mock user
      const newUser = {
        id: 102,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'patient',
        profileImage: `https://i.pravatar.cc/150?u=${data.email}`
      };
      
      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('auth_token', mockAuthToken);
      await AsyncStorage.setItem('refresh_token', mockRefreshToken);
      
      return {
        user: newUser,
        token: mockAuthToken,
        refreshToken: mockRefreshToken
      };
    }
    
    const response = await api.post('/api/auth/register', data);
    
    // Store tokens in AsyncStorage
    await AsyncStorage.setItem('auth_token', response.data.token);
    await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  }

  async logout(): Promise<void> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove tokens from AsyncStorage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      
      return;
    }
    
    // Get refresh token
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    
    // Call API to invalidate the token
    if (refreshToken) {
      await api.post('/api/auth/logout', { refreshToken });
    }
    
    // Remove tokens from AsyncStorage
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('refresh_token');
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    // Check if token exists
    const token = await AsyncStorage.getItem('auth_token');
    
    if (!token) {
      return null;
    }
    
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockUser;
    }
    
    try {
      const response = await api.get('/api/auth/me');
      return response.data.user;
    } catch (error) {
      // If token is invalid or expired
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return {
        success: true,
        message: 'Password reset instructions have been sent to your email'
      };
    }
    
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    }
    
    const response = await api.post('/api/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Validate current password
      if (currentPassword !== 'password123') {
        throw new Error('Current password is incorrect');
      }
      
      return {
        success: true,
        message: 'Password has been changed successfully'
      };
    }
    
    const response = await api.post('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
}

export const authApi = new AuthApiService(); 