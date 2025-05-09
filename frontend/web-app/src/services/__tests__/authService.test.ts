import { authApi } from '../authService';
import { server } from '../../mocks/server';
import { rest } from 'msw';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuthService', () => {
  describe('login', () => {
    test('should return user and token for valid credentials', async () => {
      const response = await authApi.login('patient@example.com', 'password');
      
      expect(response).toHaveProperty('user');
      expect(response).toHaveProperty('token');
      expect(response.user.email).toBe('patient@example.com');
    });
    
    test('should throw error for invalid credentials', async () => {
      await expect(authApi.login('invalid@example.com', 'wrongpassword')).rejects.toThrow();
    });
  });
  
  describe('register', () => {
    test('should register a new user and return user and token', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '+1234567890'
      };
      
      const response = await authApi.register(userData);
      
      expect(response).toHaveProperty('user');
      expect(response).toHaveProperty('token');
      expect(response.user.email).toBe(userData.email);
      expect(response.user.firstName).toBe(userData.firstName);
      expect(response.user.lastName).toBe(userData.lastName);
    });
    
    test('should throw error for incomplete data', async () => {
      const incompleteData = {
        email: 'incomplete@example.com',
        password: 'password123'
      };
      
      // @ts-ignore: Testing invalid input
      await expect(authApi.register(incompleteData)).rejects.toThrow();
    });
  });
  
  describe('getCurrentUser', () => {
    test('should return user when authenticated', async () => {
      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'mock-jwt-token-for-testing');
      
      const user = await authApi.getCurrentUser();
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user.email).toBe('patient@example.com');
    });
    
    test('should return null when not authenticated', async () => {
      // Mock server to return 401
      server.use(
        rest.get('/api/auth/me', (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              error: { message: 'Unauthorized' }
            })
          );
        })
      );
      
      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => null);
      
      const result = await authApi.getCurrentUser();
      expect(result).toBeNull();
    });
  });
  
  describe('forgotPassword', () => {
    test('should send password reset email for valid user', async () => {
      const response = await authApi.forgotPassword('patient@example.com');
      
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('message');
    });
    
    test('should throw error for invalid email', async () => {
      await expect(authApi.forgotPassword('nonexistent@example.com')).rejects.toThrow();
    });
  });
}); 