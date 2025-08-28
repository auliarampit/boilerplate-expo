import AsyncStorage from '@react-native-async-storage/async-storage'
import { store } from '@/shared/store'
import { setTheme, setLanguage } from '@/shared/store/slices/appSlice'
import { STORAGE_KEYS } from '../constants/storage'

type ThemeType = 'light' | 'dark' | 'system'
type LanguageType = 'en' | 'id'

class SettingsManager {
  static async updateTheme(theme: ThemeType): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme)
      store.dispatch(setTheme(theme))
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  static async updateLanguage(language: LanguageType): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
      store.dispatch(setLanguage(language))
    } catch (error) {
      console.error('Failed to save language:', error)
    }
  }

  static async loadSettings(): Promise<void> {
    try {
      const [theme, language] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
      ])

      if (theme && this.isValidTheme(theme)) {
        store.dispatch(setTheme(theme as ThemeType))
      }

      if (language && this.isValidLanguage(language)) {
        store.dispatch(setLanguage(language as LanguageType))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  static async clearSettings(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.THEME),
        AsyncStorage.removeItem(STORAGE_KEYS.LANGUAGE),
      ])
    } catch (error) {
      console.error('Failed to clear settings:', error)
    }
  }

  private static isValidTheme(theme: string): boolean {
    return ['light', 'dark', 'system'].includes(theme)
  }

  private static isValidLanguage(language: string): boolean {
    return ['en', 'id'].includes(language)
  }

  static async getTheme(): Promise<ThemeType | null> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME)
      return this.isValidTheme(theme || '') ? (theme as ThemeType) : null
    } catch (error) {
      console.error('Failed to get theme:', error)
      return null
    }
  }

  static async getLanguage(): Promise<LanguageType | null> {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE)
      return this.isValidLanguage(language || '')
        ? (language as LanguageType)
        : null
    } catch (error) {
      console.error('Failed to get language:', error)
      return null
    }
  }
}

export default SettingsManager
export type { ThemeType, LanguageType }
