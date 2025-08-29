import { API_BASE_URL } from '@/shared/utils/env'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    PROFILE: '/auth/profile',
  },
  USER: {
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete',
    UPLOAD_AVATAR: '/user/avatar',
  },
  SETTINGS: {
    GET_PREFERENCES: '/settings/preferences',
    UPDATE_PREFERENCES: '/settings/preferences',
    GET_NOTIFICATIONS: '/settings/notifications',
    UPDATE_NOTIFICATIONS: '/settings/notifications',
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
} as const

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const

export const QUERY_KEYS = {
  AUTH: {
    PROFILE: ['auth', 'profile'],
    REFRESH: ['auth', 'refresh'],
  },
  USER: {
    PROFILE: ['user', 'profile'],
    PREFERENCES: ['user', 'preferences'],
  },
  SETTINGS: {
    PREFERENCES: ['settings', 'preferences'],
    NOTIFICATIONS: ['settings', 'notifications'],
  },
} as const
