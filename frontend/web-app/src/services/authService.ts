import api from './api';

// Development mode with mock data
const isDevEnvironment = true;

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
    
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
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
            phoneNumber: userData.phoneNumber || mockUser.phoneNumber
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
    
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  }

  async getCurrentUser() {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockUser;
    }
    
    const response = await api.get('/api/auth/me');
    return response.data.data;
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
      
      // Update mock user
      Object.assign(mockUser, userData);
      
      return mockUser;
    }
    
    const response = await api.put('/api/auth/profile', userData);
    return response.data.data;
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Basic validation for development
      if (data.newPassword !== data.confirmPassword) {
        throw {
          response: {
            data: {
              error: { 
                message: 'New password and confirmation do not match' 
              }
            }
          }
        };
      }
      
      if (data.currentPassword !== 'password') {
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
      
      return { success: true };
    }
    
    const response = await api.put('/api/auth/password', data);
    return response.data;
  }

  async forgotPassword(email: string) {
    if (isDevEnvironment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: 'Password reset instructions sent to your email' };
    }
    
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  }
}

export const authApi = new AuthApiService(); 