import AsyncStorage from '@react-native-async-storage/async-storage'
import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook } from '@testing-library/react-native'
import React from 'react'
import { Provider } from 'react-redux'
import { STORAGE_KEYS } from '../../constants/storage'
import { apiClient } from '../../services/simpleApiClient'
import authSlice from '../../store/slices/authSlice'
import { User } from '../../types'
import { removeFromStorage, saveToStorage } from '../../utils/storage'
import { useAuth } from '../useAuth'

jest.mock('../../services/simpleApiClient')
jest.mock('../../utils/storage')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>
const mockSaveToStorage = saveToStorage as jest.MockedFunction<typeof saveToStorage>
const mockRemoveFromStorage = removeFromStorage as jest.MockedFunction<typeof removeFromStorage>
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
}

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}

const mockLoginResponse = {
  success: true,
  data: {
    user: mockUser,
    tokens: mockTokens,
  },
}

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: { auth: authSlice },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        ...initialState,
      },
    },
  })
}

const renderUseAuth = (initialState = {}) => {
  const store = createTestStore(initialState)
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children })
  return { ...renderHook(() => useAuth(), { wrapper }), store }
}

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  describe('initial state', () => {
    it('should return initial auth state', () => {
      const { result } = renderUseAuth()

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(typeof result.current.login).toBe('function')
      expect(typeof result.current.logout).toBe('function')
      expect(typeof result.current.updateUserProfile).toBe('function')
    })

    it('should return custom initial state', () => {
      const customState = {
        isAuthenticated: true,
        user: mockUser,
        token: 'existing-token',
      }
      const { result } = renderUseAuth(customState)

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.token).toBe('existing-token')
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      mockApiClient.login.mockResolvedValue(mockLoginResponse)
      mockSaveToStorage.mockResolvedValue(true)
      mockAsyncStorage.setItem.mockResolvedValue()

      const { result } = renderUseAuth()

      await act(async () => {
        const response = await result.current.login('test@example.com', 'password')
        expect(response).toEqual({ success: true })
      })

      expect(mockApiClient.login).toHaveBeenCalledWith('test@example.com', 'password')
      expect(mockSaveToStorage).toHaveBeenCalledWith('@auth_state', 'true')
      expect(mockSaveToStorage).toHaveBeenCalledWith('@user_data', mockUser)
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ACCESS_TOKEN,
        mockTokens.accessToken
      )
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.REFRESH_TOKEN,
        mockTokens.refreshToken
      )
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.token).toBe(mockTokens.accessToken)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle login failure', async () => {
      const error = new Error('Login failed')
      mockApiClient.login.mockRejectedValue(error)

      const { result } = renderUseAuth()

      await act(async () => {
        await expect(result.current.login('test@example.com', 'wrong-password'))
          .rejects.toThrow('Login failed')
      })

      expect(mockConsoleError).toHaveBeenCalledWith('Login error:', error)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should handle unsuccessful login response', async () => {
      mockApiClient.login.mockResolvedValue({ success: false, error: 'Invalid credentials' })

      const { result } = renderUseAuth()

      await act(async () => {
        const response = await result.current.login('test@example.com', 'password')
        expect(response).toBeUndefined()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(false)
    })

    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void
      const loginPromise = new Promise((resolve) => { resolveLogin = resolve })
      mockApiClient.login.mockReturnValue(loginPromise)

      const { result } = renderUseAuth()

      act(() => { result.current.login('test@example.com', 'password') })

      expect(result.current.isLoading).toBe(true)

      await act(async () => {
        resolveLogin!(mockLoginResponse)
        await loginPromise
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockApiClient.logout.mockResolvedValue({ success: true })
      mockRemoveFromStorage.mockResolvedValue(true)
      mockAsyncStorage.removeItem.mockResolvedValue()

      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      }
      const { result } = renderUseAuth(initialState)

      await act(async () => { await result.current.logout() })

      expect(mockApiClient.logout).toHaveBeenCalled()
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@auth_state')
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@user_data')
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN)
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle logout API error but still cleanup', async () => {
      const error = new Error('Logout API failed')
      mockApiClient.logout.mockRejectedValue(error)
      mockRemoveFromStorage.mockResolvedValue(true)
      mockAsyncStorage.removeItem.mockResolvedValue()

      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      }
      const { result } = renderUseAuth(initialState)

      await act(async () => { await result.current.logout() })

      expect(mockConsoleError).toHaveBeenCalledWith('Logout error:', error)
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@auth_state')
      expect(mockRemoveFromStorage).toHaveBeenCalledWith('@user_data')
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
    })

    it('should set loading state during logout', async () => {
      let resolveLogout: (value: any) => void
      const logoutPromise = new Promise((resolve) => { resolveLogout = resolve })
      mockApiClient.logout.mockReturnValue(logoutPromise as any)
      mockRemoveFromStorage.mockResolvedValue(true)
      mockAsyncStorage.removeItem.mockResolvedValue()

      const initialState = {
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      }
      const { result } = renderUseAuth(initialState)

      act(() => { result.current.logout() })

      expect(result.current.isLoading).toBe(true)

      await act(async () => {
        resolveLogout!({ success: true })
        await logoutPromise
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('updateUserProfile', () => {
    it('should update user profile', () => {
      const { result } = renderUseAuth({
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      })

      act(() => { result.current.updateUserProfile({ name: 'Updated Name' }) })

      expect(result.current.user).toEqual({ ...mockUser, name: 'Updated Name' })
    })

    it('should handle partial user updates', () => {
      const { result } = renderUseAuth({
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      })

      act(() => { result.current.updateUserProfile({ name: 'Only Name Updated' }) })

      expect(result.current.user).toEqual({ ...mockUser, name: 'Only Name Updated' })
    })

    it('should handle empty update', () => {
      const { result } = renderUseAuth({
        isAuthenticated: true,
        user: mockUser,
        token: mockTokens.accessToken,
      })

      act(() => { result.current.updateUserProfile({}) })

      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('memoization', () => {
    it('should memoize functions', () => {
      const { result, rerender } = renderUseAuth()

      const firstLogin = result.current.login
      const firstLogout = result.current.logout
      const firstUpdateUserProfile = result.current.updateUserProfile

      rerender(undefined)

      expect(result.current.login).toBe(firstLogin)
      expect(result.current.logout).toBe(firstLogout)
      expect(result.current.updateUserProfile).toBe(firstUpdateUserProfile)
    })
  })
})
