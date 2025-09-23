import { API_CONFIG } from '@/shared/constants/api'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import mockUsers from '@/temporary/mockData/users.json'
import { getTranslation } from '@/translate/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { apiClient } from '../simpleApiClient'

// Mock dependencies
jest.mock('axios')
jest.mock('@react-native-async-storage/async-storage')
jest.mock('@/translate/utils')
jest.mock('@/temporary/mockData/users.json', () => ({
  users: [
    {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      avatar: null,
      emailVerified: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          push: true,
          email: true,
          marketing: false,
        },
        privacy: {
          profileVisible: true,
          activityVisible: false,
        },
      },
    },
  ],
  credentials: [
    {
      email: 'test@example.com',
      password: 'password123',
    },
  ],
}))

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>
const mockedGetTranslation = getTranslation as jest.MockedFunction<typeof getTranslation>

describe('SimpleApiClient', () => {
  let mockAxiosInstance: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock axios instance
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    }
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance)
    mockedGetTranslation.mockResolvedValue('Translated message')
    mockedAsyncStorage.getItem.mockResolvedValue(null)
    mockedAsyncStorage.setItem.mockResolvedValue()
    mockedAsyncStorage.removeItem.mockResolvedValue()
    
    // Reset the instance's axios instance to our mock
    ;(apiClient as any).instance = mockAxiosInstance
  })

  describe('Constructor and Setup', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
      })
    })

    it('should setup request interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
    })
  })

  describe('Request Interceptor', () => {
    it('should add authorization header when token exists', async () => {
      const mockToken = 'test-token'
      mockedAsyncStorage.getItem.mockResolvedValueOnce(mockToken)
      
      const config = { headers: {} }
      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0]
      
      const result = await interceptor(config)
      
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN)
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
    })

    it('should not add authorization header when token does not exist', async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce(null)
      
      const config = { headers: {} }
      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0]
      
      const result = await interceptor(config)
      
      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('Login', () => {
    const email = 'test@example.com'
    const password = 'password123'

    it('should login successfully with API', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { user: mockUsers.users[0], tokens: { accessToken: 'api-token' } },
        },
      }
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

      const result = await apiClient.login(email, password)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email,
        password,
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should fallback to mock data when API fails', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      
      const result = await apiClient.login(email, password)

      expect(result.success).toBe(true)
      expect(result.data.user.email).toBe(email)
      expect(result.data.tokens.accessToken).toContain('mock-access-token')
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ACCESS_TOKEN,
        expect.stringContaining('mock-access-token')
      )
    })

    it('should throw error for invalid credentials', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      mockedGetTranslation.mockResolvedValueOnce('Invalid credentials')
      
      await expect(apiClient.login('wrong@email.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials')
      
      expect(mockedGetTranslation).toHaveBeenCalledWith('api.invalidCredentials')
    })

    it('should throw error when user not found', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      mockedGetTranslation.mockResolvedValueOnce('User not found')
      
      // Mock credentials exist but user doesn't
      const mockCredentials = [{ email: 'nonexistent@email.com', password: 'password123' }]
      jest.doMock('@/temporary/mockData/users.json', () => ({
        users: [],
        credentials: mockCredentials,
      }))
      
      await expect(apiClient.login('nonexistent@email.com', 'password123'))
        .rejects.toThrow('User not found')
    })
  })

  describe('Register', () => {
    const userData = {
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      password: 'password123',
    }

    it('should register successfully with API', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { user: { ...userData, id: '2' } },
        },
      }
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

      const result = await apiClient.register({
        ...userData,
        confirmPassword: userData.password,
        acceptTerms: true
      })

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should fallback to mock data when API fails', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      
      const result = await apiClient.register({
        ...userData,
        confirmPassword: userData.password,
        acceptTerms: true
      })

      expect(result.success).toBe(true)
      expect(result.data.user.email).toBe(userData.email)
      expect(result.data.user.firstName).toBe(userData.firstName)
      expect(result.data.tokens.accessToken).toContain('mock-access-token')
    })

    it('should throw error for existing email', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      mockedGetTranslation.mockResolvedValueOnce('Email already exists')
      
      await expect(apiClient.register({
        ...userData, email: 'test@example.com',
        confirmPassword: '',
        acceptTerms: false
      }))
        .rejects.toThrow('Email already exists')
      
      expect(mockedGetTranslation).toHaveBeenCalledWith('api.emailAlreadyExists')
    })
  })

  describe('Get Profile', () => {
    it('should get profile successfully with API', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: mockUsers.users[0],
        },
      }
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await apiClient.getProfile()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/profile')
      expect(result).toEqual(mockResponse.data)
    })

    it('should fallback to mock data when API fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('API Error'))
      mockedAsyncStorage.getItem.mockResolvedValueOnce('mock-token')
      
      const result = await apiClient.getProfile()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUsers.users[0])
    })

    it('should throw error when token not found', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('API Error'))
      mockedAsyncStorage.getItem.mockResolvedValueOnce(null)
      mockedGetTranslation.mockResolvedValueOnce('Token not found')
      
      await expect(apiClient.getProfile()).rejects.toThrow('Token not found')
      
      expect(mockedGetTranslation).toHaveBeenCalledWith('api.tokenNotFound')
    })
  })

  describe('Update Profile', () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
    }

    it('should update profile successfully with API', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { ...mockUsers.users[0], ...updateData },
        },
      }
      mockAxiosInstance.put.mockResolvedValueOnce(mockResponse)

      const result = await apiClient.updateProfile(updateData)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/user/profile', updateData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should fallback to mock data when API fails', async () => {
      mockAxiosInstance.put.mockRejectedValueOnce(new Error('API Error'))
      
      const result = await apiClient.updateProfile(updateData)

      expect(result.success).toBe(true)
      expect(result.data.firstName).toBe(updateData.firstName)
      expect(result.data.lastName).toBe(updateData.lastName)
      expect(result.data.updatedAt).toBeDefined()
    })
  })

  describe('Get Preferences', () => {
    it('should get preferences successfully with API', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: mockUsers.users[0].preferences,
        },
      }
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse)

      const result = await apiClient.getPreferences()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/settings/preferences')
      expect(result).toEqual(mockResponse.data)
    })

    it('should fallback to mock data when API fails', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('API Error'))
      
      const result = await apiClient.getPreferences()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUsers.users[0].preferences)
    })
  })

  describe('Update Preferences', () => {
    const preferencesData = {
      theme: 'dark' as const,
      language: 'id' as const,
    }

    it('should update preferences successfully with API', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { ...mockUsers.users[0].preferences, ...preferencesData },
        },
      }
      mockAxiosInstance.put.mockResolvedValueOnce(mockResponse)

      const result = await apiClient.updatePreferences(preferencesData)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/settings/preferences', preferencesData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should fallback to mock data when API fails', async () => {
      mockAxiosInstance.put.mockRejectedValueOnce(new Error('API Error'))
      
      const result = await apiClient.updatePreferences(preferencesData)

      expect(result.success).toBe(true)
      expect(result.data.theme).toBe(preferencesData.theme)
      expect(result.data.language).toBe(preferencesData.language)
    })
  })

  describe('Logout', () => {
    it('should logout successfully with API', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({})
      
      const result = await apiClient.logout()

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout')
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN)
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN)
      expect(result.success).toBe(true)
    })

    it('should clear storage even when API fails', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      
      const result = await apiClient.logout()

      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN)
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN)
      expect(result.success).toBe(true)
    })
  })

  describe('Private Methods', () => {
    it('should find mock user by email', () => {
      const user = (apiClient as any).getMockUser('test@example.com')
      expect(user).toEqual(mockUsers.users[0])
    })

    it('should return undefined for non-existent user', () => {
      const user = (apiClient as any).getMockUser('nonexistent@example.com')
      expect(user).toBeUndefined()
    })

    it('should validate credentials correctly', () => {
      const credentials = (apiClient as any).validateCredentials('test@example.com', 'password123')
      expect(credentials).toEqual(mockUsers.credentials[0])
    })

    it('should return undefined for invalid credentials', () => {
      const credentials = (apiClient as any).validateCredentials('test@example.com', 'wrongpassword')
      expect(credentials).toBeUndefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error')
      mockAxiosInstance.post.mockRejectedValueOnce(networkError)
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      const result = await apiClient.login('test@example.com', 'password123')
      
      expect(consoleSpy).toHaveBeenCalledWith('API login failed, using mock data')
      expect(result.success).toBe(true)
      
      consoleSpy.mockRestore()
    })

    it('should handle AsyncStorage errors', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      mockedAsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage Error'))
      
      await expect(apiClient.login('test@example.com', 'password123'))
        .rejects.toThrow('Storage Error')
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete authentication flow', async () => {
      // Login
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      const loginResult = await apiClient.login('test@example.com', 'password123')
      expect(loginResult.success).toBe(true)
      
      // Get Profile
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('API Error'))
      mockedAsyncStorage.getItem.mockResolvedValueOnce('mock-token')
      const profileResult = await apiClient.getProfile()
      expect(profileResult.success).toBe(true)
      
      // Logout
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'))
      const logoutResult = await apiClient.logout()
      expect(logoutResult.success).toBe(true)
    })
  })
})