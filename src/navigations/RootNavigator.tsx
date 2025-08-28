import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { ROOT_ROUTES } from '@/shared/constants/navigation'
import { useTheme } from '@/shared/components'
import { getThemeClass } from '../shared'
import { RootStackParamList } from '@/shared/types/navigation'
import { AuthState, User } from '@/shared/types'
import {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
} from '@/shared/utils/storage'
import { AppNavigator } from './AppNavigator'
import { AuthNavigator } from './AuthNavigator'

const Stack = createNativeStackNavigator<RootStackParamList>()

const AUTH_STORAGE_KEY = '@auth_state'
const USER_STORAGE_KEY = '@user_data'

interface AuthContextType extends AuthState {
  login: (user: User) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  })

  const checkAuthState = async () => {
    try {
      const [authData, userData] = await Promise.all([
        getFromStorage(AUTH_STORAGE_KEY, null),
        getFromStorage(USER_STORAGE_KEY, null),
      ])

      const isAuthenticated = authData === 'true'

      setAuthState({
        isAuthenticated,
        isLoading: false,
        user: userData,
      })
    } catch (error) {
      console.error('Error checking auth state:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      })
    }
  }

  const login = async (user: User) => {
    try {
      await Promise.all([
        saveToStorage(AUTH_STORAGE_KEY, 'true'),
        saveToStorage(USER_STORAGE_KEY, user),
      ])

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
      })
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await Promise.all([
        removeFromStorage(AUTH_STORAGE_KEY),
        removeFromStorage(USER_STORAGE_KEY),
      ])

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      })
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

function LoadingScreen() {
  const { isDark } = useTheme()

  return (
    <View
      className={`flex-1 justify-center items-center ${getThemeClass(isDark, 'background.primary')}`}>
      <ActivityIndicator size='large' color='#3B82F6' />
    </View>
  )
}

function RootNavigatorContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator
      screenOptions={
        {
          // headerShown: NAVIGATION_OPTIONS.HEADER_SHOWN,
        }
      }>
      {isAuthenticated ? (
        <Stack.Screen name={ROOT_ROUTES.APP} component={AppNavigator} />
      ) : (
        <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthNavigator} />
      )}
    </Stack.Navigator>
  )
}

export function RootNavigator() {
  return (
    <AuthProvider>
      <RootNavigatorContent />
    </AuthProvider>
  )
}

export { AuthProvider }
