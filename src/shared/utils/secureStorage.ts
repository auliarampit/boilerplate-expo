import * as SecureStore from 'expo-secure-store'

/**
 * Secure storage utility for sensitive data
 * Uses expo-secure-store for encrypted storage
 */

export const SecureStorage = {
  /**
   * Save a value to secure storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value)
    } catch (error) {
      console.error('SecureStorage setItem error:', error)
      throw new Error('Failed to save secure data')
    }
  },

  /**
   * Get a value from secure storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (error) {
      console.error('SecureStorage getItem error:', error)
      return null
    }
  },

  /**
   * Delete a value from secure storage
   */
  async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch (error) {
      console.error('SecureStorage deleteItem error:', error)
    }
  },

  /**
   * Check if secure storage is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Test if secure storage is available by trying to store and retrieve a test value
      const testKey = '@secure_storage_test'
      const testValue = 'test_value'
      
      await SecureStore.setItemAsync(testKey, testValue)
      const retrievedValue = await SecureStore.getItemAsync(testKey)
      await SecureStore.deleteItemAsync(testKey)
      
      return retrievedValue === testValue
    } catch (error) {
      console.warn('Secure storage not available:', error)
      return false
    }
  }
}

/**
 * Secure storage keys for different types of sensitive data
 */
export const SECURE_STORAGE_KEYS = {
  ACCESS_TOKEN: '@secure_access_token',
  REFRESH_TOKEN: '@secure_refresh_token',
  BIOMETRIC_CREDENTIALS: '@secure_biometric_credentials',
  ENCRYPTION_KEY: '@secure_encryption_key',
  PRIVATE_DATA: '@secure_private_data'
} as const

/**
 * Fallback to regular storage if secure storage is not available
 * This is useful for development or when secure storage fails
 */
export const getSecureStorageWithFallback = () => {
  return {
    async setItem(key: string, value: string): Promise<void> {
      try {
        const isSecureAvailable = await SecureStorage.isAvailable()
        if (isSecureAvailable) {
          await SecureStorage.setItem(key, value)
        } else {
          // Fallback to AsyncStorage (for development only)
          const { saveToStorage } = await import('./storage')
          await saveToStorage(key, value)
          console.warn('Using fallback storage (not secure) for:', key)
        }
      } catch (error) {
        console.error('Secure storage with fallback error:', error)
      }
    },

    async getItem(key: string): Promise<string | null> {
      try {
        const isSecureAvailable = await SecureStorage.isAvailable()
        if (isSecureAvailable) {
          return await SecureStorage.getItem(key)
        } else {
          // Fallback to AsyncStorage (for development only)
          const { getFromStorage } = await import('./storage')
          return await getFromStorage(key, null)
        }
      } catch (error) {
        console.error('Secure storage with fallback error:', error)
        return null
      }
    },

    async deleteItem(key: string): Promise<void> {
      try {
        const isSecureAvailable = await SecureStorage.isAvailable()
        if (isSecureAvailable) {
          await SecureStorage.deleteItem(key)
        } else {
          // Fallback to AsyncStorage (for development only)
          const { removeFromStorage } = await import('./storage')
          await removeFromStorage(key)
        }
      } catch (error) {
        console.error('Secure storage with fallback error:', error)
      }
    }
  }
}