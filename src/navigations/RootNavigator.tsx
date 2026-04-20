import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '@/shared/components'
import { ROOT_ROUTES } from '@/shared/constants/navigation'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { RootState } from '@/shared/store'
import { loginSuccess, setLoading } from '@/shared/store/slices/authSlice'
import { RootStackParamList } from '@/shared/types/navigation'
import { getFromStorage } from '@/shared/utils/storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getThemeClass } from '../shared'
import { AppNavigator } from './AppNavigator'
import { AuthNavigator } from './AuthNavigator'

const Stack = createNativeStackNavigator<RootStackParamList>()

const AUTH_STORAGE_KEY = '@auth_state'
const USER_STORAGE_KEY = '@user_data'

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
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

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
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        dispatch(setLoading(true))
        
        const [authData, userData, token] = await Promise.all([
          getFromStorage(AUTH_STORAGE_KEY, null),
          getFromStorage(USER_STORAGE_KEY, null),
          AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        ])

        const isAuthenticated = authData === 'true'

        if (isAuthenticated && userData && token) {
          dispatch(loginSuccess({ user: userData, token }))
        } else {
          dispatch(setLoading(false))
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        dispatch(setLoading(false))
      }
    }

    checkAuthState()
  }, [dispatch])

  return <RootNavigatorContent />
}
