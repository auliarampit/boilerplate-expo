export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ApiError {
  success: false
  message: string
  code?: string
  details?: any
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  acceptTerms: boolean
}

export interface RegisterResponse {
  user: User
  tokens: AuthTokens
  emailVerificationRequired?: boolean
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'id'
  notifications: {
    push: boolean
    email: boolean
    marketing: boolean
  }
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
  }
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  avatar?: string
}

export interface UpdatePreferencesRequest {
  theme?: 'light' | 'dark' | 'system'
  language?: 'en' | 'id'
  notifications?: {
    push?: boolean
    email?: boolean
    marketing?: boolean
  }
  privacy?: {
    profileVisible?: boolean
    activityVisible?: boolean
  }
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  expiresIn: number
}

export interface VerifyEmailRequest {
  token: string
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequestConfig {
  method: ApiMethod
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
}
