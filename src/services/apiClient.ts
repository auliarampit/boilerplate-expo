import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG } from '@/utils/api'
import { STORAGE_KEYS } from '@/utils/storage'
import {
  ApiResponse,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  User,
  UserPreferences,
} from '@/types/api'

class ApiClient {
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

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.instance.post<ApiResponse<LoginResponse>>('/auth/login', { email, password })
    return response.data
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await this.instance.post<ApiResponse<RegisterResponse>>('/auth/register', userData)
    return response.data
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.instance.get<ApiResponse<User>>('/auth/profile')
    return response.data
  }

  async updateProfile(userData: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await this.instance.put<ApiResponse<User>>('/user/profile', userData)
    return response.data
  }

  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    const response = await this.instance.get<ApiResponse<UserPreferences>>('/settings/preferences')
    return response.data
  }

  async updatePreferences(preferences: UpdatePreferencesRequest): Promise<ApiResponse<UserPreferences>> {
    const response = await this.instance.put<ApiResponse<UserPreferences>>('/settings/preferences', preferences)
    return response.data
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await this.instance.post<ApiResponse<void>>('/auth/forgot-password', { email })
    return response.data
  }

  // Token cleanup is handled by useAuth — not the API client's responsibility
  async logout(): Promise<void> {
    await this.instance.post('/auth/logout')
  }
}

export const apiClient = new ApiClient()
