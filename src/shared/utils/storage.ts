import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Save data to local storage
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @returns Promise<boolean> - Success status
 */
export const saveToStorage = async <T>(
  key: string,
  value: T
): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
    return true
  } catch (error) {
    console.error('Error saving to storage:', error)
    return false
  }
}

/**
 * Get data from local storage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Promise<T> - Retrieved value or default value
 */
export const getFromStorage = async <T>(
  key: string,
  defaultValue: T
): Promise<T> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue
  } catch (error) {
    console.error('Error getting from storage:', error)
    return defaultValue
  }
}

/**
 * Remove data from local storage
 * @param key - Storage key
 * @returns Promise<boolean> - Success status
 */
export const removeFromStorage = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from storage:', error)
    return false
  }
}

/**
 * Check if key exists in local storage
 * @param key - Storage key
 * @returns Promise<boolean> - Whether key exists
 */
export const hasInStorage = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value !== null
  } catch (error) {
    console.error('Error checking storage:', error)
    return false
  }
}

/**
 * Clear all data from local storage
 * @returns Promise<boolean> - Success status
 */
export const clearStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing storage:', error)
    return false
  }
}

/**
 * Get all keys from local storage
 * @returns Promise<readonly string[]> - Array of all keys
 */
export const getAllStorageKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys()
  } catch (error) {
    console.error('Error getting all keys:', error)
    return []
  }
}
