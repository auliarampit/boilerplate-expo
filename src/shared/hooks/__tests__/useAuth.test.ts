import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { apiClient } from '../../services/simpleApiClient';
import authSlice from '../../store/slices/authSlice';
import { User } from '../../types';
import { getSecureStorageWithFallback, SECURE_STORAGE_KEYS } from '../../utils/secureStorage';
import { removeFromStorage, saveToStorage } from '../../utils/storage';
import { useAuth } from '../useAuth';

// Mock dependencies
jest.mock('../../services/simpleApiClient');
jest.mock('../../utils/storage');
jest.mock('../../utils/secureStorage');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockSaveToStorage = saveToStorage as jest.MockedFunction<typeof saveToStorage>;
const mockRemoveFromStorage = removeFromStorage as jest.MockedFunction<typeof removeFromStorage>;
const mockGetSecureStorageWithFallback = getSecureStorageWithFallback as jest.MockedFunction<typeof getSecureStorageWithFallback>;

const mockSecureStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  deleteItem: jest.fn(),
};

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

// Test data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
};

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

const mockLoginResponse = {
  success: true,
  data: {
    user: mockUser,
    tokens: mockTokens,
  },
};

// Helper function to create store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        ...initialState,
      },
    },
  });
};

// Helper function to render hook with provider
const renderUseAuth = (initialState = {}) => {
  const store = createTestStore(initialState);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(Provider, { store, children })
  );
  return {
    ...renderHook(() => useAuth(), { wrapper }),
    store,
  };
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError.mockClear();
    mockGetSecureStorageWithFallback.mockReturnValue(mockSecureStorage);
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('initial state', () => {
    it('should return initial auth state', () => {
      const { result } = renderUseAuth();

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);

      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.updateUserProfile).toBe('function');
    });

    it('should return custom initial state', () => {
      const customState = {
        isAuthenticated: true,
        user: mockUser,
        token: 'existing-token',
      };
      const { result } = renderUseAuth(customState);

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('existing-token');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      mockApiClient.login.mockResolvedValue(mockLoginResponse);
      mockSaveToStorage.mockResolvedValue(true);
      mockSecureStorage.setItem.mockResolvedValue(undefined);

      const { result } = renderUseAuth();

      await act(async () => {
        const response = await result.current.login('test@example.com', 'password');
        expect(response).toEqual({ success: true });
      });

      // Verify API call
      expect(mockApiClient.login).toHaveBeenCalledWith('test@example.com', 'password');

      // Verify storage calls
      expect(mockSaveToStorage).toHaveBeenCalledWith('@auth_state', 'true');
      expect(mockSaveToStorage).toHaveBeenCalledWith('@user_data', mockUser);
      expect(mockSecureStorage.setItem).toHaveBeenCalledWith(
        SECURE_STORAGE_KEYS.ACCESS_TOKEN,
        mockTokens.accessToken
      );
      expect(mockSecureStorage.setItem).toHaveBeenCalledWith(
        SECURE_STORAGE_KEYS.REFRESH_TOKEN,
        mockTokens.refreshToken
      );

      // Verify state updates
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockTokens.accessToken);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle login failure', async () => {
      const error = new Error('Login failed');
      mockApiClient.login.mockRejectedValue(error);

      const { result } = renderUseAuth();

      await act(async () => {
        await expect(result.current.login('test@example.com', 'wrong-password'))
          .rejects.toThrow('Login failed');
      });

      expect(mockConsoleError).toHaveBeenCalledWith('Login error:', error);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle unsuccessful login response', async () => {
      const unsuccessfulResponse = {
        success: false,
        error: 'Invalid credentials',
      };
      mockApiClient.login.mockResolvedValue(unsuccessfulResponse);

      const { result } = renderUseAuth();

      await act(async () => {
        const response = await result.current.login('test@example.com', 'password');
        expect(response).toBeUndefined();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      mockApiClient.login.mockReturnValue(loginPromise);

      const { result } = renderUseAuth();

      act(() => {
        result.current.login('test@example.com', 'password');
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveLogin!(mockLoginResponse);
        await loginPromise;
      });

      // Should not be loading after completion
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockApiClient.logout.mockResolvedValue({ success: true });
      mockRemoveFromStorage.mockResolvedValue(true);
      mockSecureStorage.deleteItem.mockResolvedValue(undefined);

      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      };
      const { result } = renderUseAuth(initialState);

      await act(async () => {
        await result.current.logout();
      });

      // Verify API call
      expect(mockApiClient.logout).toHaveBeenCalled();

      // Verify storage cleanup
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@auth_state');
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@user_data');
      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith(SECURE_STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith(SECURE_STORAGE_KEYS.REFRESH_TOKEN);

      // Verify state reset
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle logout API error but still cleanup', async () => {
      const error = new Error('Logout API failed');
      mockApiClient.logout.mockRejectedValue(error);
      mockRemoveFromStorage.mockResolvedValue(true);
      mockSecureStorage.deleteItem.mockResolvedValue(undefined);

      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      };
      const { result } = renderUseAuth(initialState);

      await act(async () => {
        await result.current.logout();
      });

      expect(mockConsoleError).toHaveBeenCalledWith('Logout error:', error);

      // Should still cleanup storage and reset state
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@auth_state');
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@user_data');
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should set loading state during logout', async () => {
      let resolveLogout: (value: any) => void;
      const logoutPromise = new Promise((resolve) => {
        resolveLogout = resolve;
      });
      mockApiClient.logout.mockReturnValue(logoutPromise as any);
      mockRemoveFromStorage.mockResolvedValue(true);
      mockSecureStorage.deleteItem.mockResolvedValue(undefined);

      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      };
      const { result } = renderUseAuth(initialState);

      act(() => {
        result.current.logout();
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveLogout!({ success: true });
        await logoutPromise;
      });

      // Should not be loading after completion
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', () => {
      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      };
      const { result } = renderUseAuth(initialState);

      const updatedData = {
        name: 'Updated Name',
      };

      act(() => {
        result.current.updateUserProfile(updatedData);
      });

      expect(result.current.user).toEqual({
        ...mockUser,
        ...updatedData,
      });
    });

    it('should handle partial user updates', () => {
      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      };
      const { result } = renderUseAuth(initialState);

      act(() => {
        result.current.updateUserProfile({ name: 'Only Name Updated' });
      });

      expect(result.current.user).toEqual({
        ...mockUser,
        name: 'Only Name Updated',
      });
    });

    it('should handle empty update', () => {
      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      };
      const { result } = renderUseAuth(initialState);

      act(() => {
        result.current.updateUserProfile({});
      });

      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('memoization', () => {
    it('should memoize functions', () => {
      const { result, rerender } = renderUseAuth();

      const firstLogin = result.current.login;
      const firstLogout = result.current.logout;
      const firstUpdateUserProfile = result.current.updateUserProfile;

      rerender(undefined);

      expect(result.current.login).toBe(firstLogin);
      expect(result.current.logout).toBe(firstLogout);
      expect(result.current.updateUserProfile).toBe(firstUpdateUserProfile);
    });
  });
});