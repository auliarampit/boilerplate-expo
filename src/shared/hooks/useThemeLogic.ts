import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type ThemeMode = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = '@theme_mode'

export const useThemeLogic = () => {
  const systemColorScheme = useColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [isLoading, setIsLoading] = useState(true)

  const currentTheme = themeMode === 'system' ? systemColorScheme : themeMode
  const isDark = currentTheme === 'dark'

  useEffect(() => {
    loadThemeMode()
  }, [])

  const loadThemeMode = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode)
      }
    } catch (error) {
      console.warn('Failed to load theme mode:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode)
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch (error) {
      console.warn('Failed to save theme mode:', error)
    }
  }

  const toggleTheme = () => {
    const nextMode = currentTheme === 'dark' ? 'light' : 'dark'
    setThemeMode(nextMode)
  }

  const getThemeColors = () => {
    return {
      background: isDark ? '#000000' : '#FFFFFF',
      surface: isDark ? '#1F1F1F' : '#F5F5F5',
      primary: isDark ? '#3B82F6' : '#2563EB',
      secondary: isDark ? '#6B7280' : '#9CA3AF',
      text: isDark ? '#FFFFFF' : '#000000',
      textSecondary: isDark ? '#D1D5DB' : '#6B7280',
      border: isDark ? '#374151' : '#E5E7EB',
      error: isDark ? '#EF4444' : '#DC2626',
      success: isDark ? '#10B981' : '#059669',
      warning: isDark ? '#F59E0B' : '#D97706',
      info: isDark ? '#3B82F6' : '#2563EB',
    }
  }

  const getStatusBarStyle = () => {
    return isDark ? 'light-content' : 'dark-content'
  }

  const getNavigationBarStyle = () => {
    return {
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      barStyle: isDark ? 'light-content' : 'dark-content',
    }
  }

  return {
    themeMode,
    currentTheme,
    isDark,
    isLoading,
    setThemeMode,
    toggleTheme,
    getThemeColors,
    getStatusBarStyle,
    getNavigationBarStyle,
  }
}
