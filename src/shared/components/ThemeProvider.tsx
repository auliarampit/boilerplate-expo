import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors } from '../constants/Colors'

type ThemeMode = 'light' | 'dark' | 'system'
type ColorScheme = 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  colorScheme: ColorScheme
  colors: typeof Colors.light
  isDark: boolean
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

const THEME_STORAGE_KEY = '@theme_mode'

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [isLoading, setIsLoading] = useState(true)

  // Determine the actual color scheme based on theme mode
  const colorScheme = useMemo((): ColorScheme => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light'
    }
    return themeMode === 'dark' ? 'dark' : 'light'
  }, [themeMode, systemColorScheme])

  const isDark = useMemo(() => colorScheme === 'dark', [colorScheme])
  const colors = useMemo(() => Colors[colorScheme], [colorScheme])

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode)
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadThemePreference()
  }, [])

  // Save theme preference to storage
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode)
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(newMode)
  }

  const contextValue: ThemeContextType = {
    themeMode,
    colorScheme,
    colors,
    isDark,
    setThemeMode,
    toggleTheme,
  }

  // Don't render children until theme is loaded
  if (isLoading) {
    return null
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeProvider
