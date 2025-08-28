import axios, { AxiosInstance, AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_CONFIG } from '@/shared/constants/api'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import mockUsers from '@/temporary/mockData/users.json'

class SimpleApiClient {
  private instance: AxiosInstance
  private mockData = mockUsers

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor untuk menambahkan token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  // Helper untuk mendapatkan mock data
  private getMockUser(email: string) {
    return this.mockData.users.find((user) => user.email === email)
  }

  private validateCredentials(email: string, password: string) {
    return this.mockData.credentials.find(
      (cred) => cred.email === email && cred.password === password
    )
  }

  // Auth methods
  async login(email: string, password: string) {
    try {
      // Coba API real terlebih dahulu
      const response = await this.instance.post('/auth/login', {
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.log('API login failed, using mock data')

      // Fallback ke mock data
      const credentials = this.validateCredentials(email, password)
      if (!credentials) {
        throw new Error('Email atau password salah')
      }

      const user = this.getMockUser(email)
      if (!user) {
        throw new Error('User tidak ditemukan')
      }

      // Simulate token
      const mockTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      }

      // Save token to storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        mockTokens.accessToken
      )
      await AsyncStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        mockTokens.refreshToken
      )

      return {
        success: true,
        data: {
          user,
          tokens: mockTokens,
        },
      }
    }
  }

  async register(userData: any) {
    try {
      const response = await this.instance.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.log('API register failed, using mock data')

      // Check if email already exists
      const existingUser = this.getMockUser(userData.email)
      if (existingUser) {
        throw new Error('Email sudah terdaftar')
      }

      // Create new mock user
      const newUser = {
        id: String(Date.now()),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: null,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      }

      const mockTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        mockTokens.accessToken
      )
      await AsyncStorage.setItem(
        STORAGE_KEYS.REFRESH_TOKEN,
        mockTokens.refreshToken
      )

      return {
        success: true,
        data: {
          user: newUser,
          tokens: mockTokens,
        },
      }
    }
  }

  async getProfile() {
    try {
      const response = await this.instance.get('/auth/profile')
      return response.data
    } catch (error) {
      console.log('API getProfile failed, using mock data')

      // Get current user from token (simplified)
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (!token) {
        throw new Error('Token tidak ditemukan')
      }

      // Return first user as default (in real app, decode token)
      const user = this.mockData.users[0]
      return {
        success: true,
        data: user,
      }
    }
  }

  async updateProfile(userData: any) {
    try {
      const response = await this.instance.put('/user/profile', userData)
      return response.data
    } catch (error) {
      console.log('API updateProfile failed, using mock data')

      const user = this.mockData.users[0]
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      }

      return {
        success: true,
        data: updatedUser,
      }
    }
  }

  async getPreferences() {
    try {
      const response = await this.instance.get('/settings/preferences')
      return response.data
    } catch (error) {
      console.log('API getPreferences failed, using mock data')

      const user = this.mockData.users[0]
      return {
        success: true,
        data: user.preferences,
      }
    }
  }

  async updatePreferences(preferences: any) {
    try {
      const response = await this.instance.put(
        '/settings/preferences',
        preferences
      )
      return response.data
    } catch (error) {
      console.log('API updatePreferences failed, using mock data')

      const user = this.mockData.users[0]
      const updatedPreferences = {
        ...user.preferences,
        ...preferences,
      }

      return {
        success: true,
        data: updatedPreferences,
      }
    }
  }

  async logout() {
    try {
      await this.instance.post('/auth/logout')
    } catch (error) {
      console.log('API logout failed, clearing local storage')
    } finally {
      // Always clear local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    }

    return {
      success: true,
    }
  }
}

export const apiClient = new SimpleApiClient()
