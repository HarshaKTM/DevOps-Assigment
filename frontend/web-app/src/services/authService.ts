import { api } from './api';

// Development mode with mock data - change to false to use real API
const isDevEnvironment = process.env.NODE_ENV === 'development';

// Mock user data for development
const mockUser = {
  id: 101,
  email: 'patient@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'patient',
  phoneNumber: '+1234567890',
  avatar: 'https://i.pravatar.cc/150?u=patient'
};

// Mock token
const mockToken = 'mock-jwt-token-for-development-only';

class AuthApiService {
  async login(email: string, password: string) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Basic validation for development
      if (email === 'patient@example.com' && password === 'password') {
        return {
          user: mockUser,
          token: mockToken
        };
      } else if (email === 'doctor@example.com' && password === 'password') {
        return {
          user: {
            ...mockUser,
            id: 201,
            email: 'doctor@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'doctor',
            avatar: 'https://i.pravatar.cc/150?u=doctor'
          },
          token: mockToken
        };
      } else if (email === 'admin@example.com' && password === 'password') {
        return {
          user: {
            ...mockUser,
            id: 301,
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            avatar: 'https://i.pravatar.cc/150?u=admin'
          },
          token: mockToken
        };
      } else {
        throw {
          response: {
            data: {
              error: { 
                message: 'Invalid email or password' 
              }
            }
          }
        };
      }
    }
    
    try {
      // Updated endpoint to match our backend route
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
  }) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Basic validation for development
      if (userData.email && userData.password && userData.firstName && userData.lastName) {
        return {
          user: {
            ...mockUser,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber || mockUser.phoneNumber,
            role: userData.role || 'patient'
          },
          token: mockToken
        };
      } else {
        throw {
          response: {
            data: {
              error: { 
                message: 'All fields are required' 
              }
            }
          }
        };
      }
    }
    
    try {
      // Updated endpoint to match our backend route
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockUser;
    }
    
    try {
      // Updated endpoint to match our backend route
      const response = await api.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email === 'patient@example.com' || email === 'doctor@example.com' || email === 'admin@example.com') {
        return { success: true, message: 'Password reset link sent to your email' };
      } else {
        throw {
          response: {
            data: {
              error: { 
                message: 'Email not found' 
              }
            }
          }
        };
      }
    }
    
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      if (token && newPassword) {
        return { success: true, message: 'Password has been reset successfully' };
      } else {
        throw {
          response: {
            data: {
              error: { 
                message: 'Invalid token or password' 
              }
            }
          }
        };
      }
    }
    
    const response = await api.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  }

  async updateProfile(userData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
  }) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        ...mockUser,
        ...userData
      };
    }
    
    const response = await api.put('/api/auth/profile', userData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentPassword === 'password') {
        return { success: true, message: 'Password changed successfully' };
      } else {
        throw {
          response: {
            data: {
              error: { 
                message: 'Current password is incorrect' 
              }
            }
          }
        };
      }
    }
    
    const response = await api.post('/api/auth/change-password', { currentPassword, newPassword });
    return response.data;
  }
}

export const authApi = new AuthApiService(); 