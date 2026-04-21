import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG } from '@/utils/api'
import { STORAGE_KEYS } from '@/utils/storage'
import { RegisterRequest, UpdateProfileRequest, UpdatePreferencesRequest } from '@/types/api'

class SimpleApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    })

    this.instance.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          'An unexpected error occurred'
        throw new Error(message)
      }
    )
  }

  async login(email: string, password: string) {
    const response = await this.instance.post('/auth/login', { email, password })
    return response.data
  }

  async register(userData: RegisterRequest) {
    const response = await this.instance.post('/auth/register', userData)
    return response.data
  }

  async getProfile() {
    const response = await this.instance.get('/auth/profile')
    return response.data
  }

  async updateProfile(userData: UpdateProfileRequest) {
    const response = await this.instance.put('/user/profile', userData)
    return response.data
  }

  async getPreferences() {
    const response = await this.instance.get('/settings/preferences')
    return response.data
  }

  async updatePreferences(preferences: UpdatePreferencesRequest) {
    const response = await this.instance.put('/settings/preferences', preferences)
    return response.data
  }

  async logout() {
    try {
      await this.instance.post('/auth/logout')
    } finally {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    }
    return { success: true }
  }
}

export const apiClient = new SimpleApiClient()
