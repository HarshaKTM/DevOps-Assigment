import authReducer, { 
  login, 
  register, 
  getCurrentUser, 
  logout, 
  clearError 
} from '../authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../../../services/authService';

// Mock the authApi
jest.mock('../../../services/authService', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
  }
}));

describe('Auth Slice', () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  const mockUser = {
    id: 101,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'patient',
  };

  const mockToken = 'mock-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error message',
    };

    expect(authReducer(stateWithError, clearError())).toEqual({
      ...stateWithError,
      error: null,
    });
  });

  describe('login async thunk', () => {
    test('should handle login.pending', () => {
      const action = { type: login.pending.type };
      const state = authReducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('should handle login.fulfilled', () => {
      const action = {
        type: login.fulfilled.type,
        payload: {
          user: mockUser,
          token: mockToken,
        },
      };
      
      const state = authReducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        isAuthenticated: true,
        user: mockUser,
        token: mockToken,
        loading: false,
        error: null,
      });
    });

    test('should handle login.rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: login.rejected.type,
        payload: errorMessage,
      };
      
      const state = authReducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage,
      });
    });
  });

  describe('logout async thunk', () => {
    test('should handle logout.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        isAuthenticated: true,
        user: mockUser,
        token: mockToken,
      };
      
      const action = { type: logout.fulfilled.type };
      const state = authReducer(stateWithUser, action);
      
      expect(state).toEqual({
        ...initialState,
        isAuthenticated: false,
        user: null,
        token: null,
      });
    });
  });

  // Testing actual thunk behavior
  describe('thunk actions', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: { auth: authReducer },
      });
    });

    test('should dispatch login.fulfilled on successful login', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = { user: mockUser, token: mockToken };
      
      (authApi.login as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      await store.dispatch(login(credentials));
      
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toEqual(mockToken);
    });

    test('should dispatch login.rejected on login failure', async () => {
      const credentials = { email: 'wrong@example.com', password: 'wrong' };
      const errorMessage = 'Invalid email or password';
      
      (authApi.login as jest.Mock).mockRejectedValueOnce({
        response: { data: { error: { message: errorMessage } } }
      });
      
      await store.dispatch(login(credentials));
      
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toEqual(errorMessage);
    });
  });
}); 