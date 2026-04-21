import AsyncStorage from '@react-native-async-storage/async-storage'

// Storage keys
export const AUTH_STORAGE_KEY = '@auth_state'
export const USER_STORAGE_KEY = '@user_data'

export const STORAGE_KEYS = {
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NOTIFICATION_SETTINGS: 'notification_settings',
  BIOMETRIC_ENABLED: 'biometric_enabled',
} as const

export type StorageKey = keyof typeof STORAGE_KEYS

// Storage helpers
export const saveToStorage = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const getFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue
  } catch {
    return defaultValue
  }
}

export const removeFromStorage = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export const hasInStorage = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value !== null
  } catch {
    return false
  }
}

export const clearStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear()
    return true
  } catch {
    return false
  }
}

export const getAllStorageKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys()
  } catch {
    return []
  }
}
