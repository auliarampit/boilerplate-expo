import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AuthStackScreenProps } from '@/shared/types/navigation'
import { AUTH_ROUTES } from '@/shared/constants/navigation'
import { useTheme } from '@/shared/components'
import { getThemeClass } from '@/shared'

export const LoginScreen = ({ navigation }: AuthStackScreenProps<'Login'>) => {
  const { isDark } = useTheme()

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login pressed')
  }

  const navigateToRegister = () => {
    navigation.navigate(AUTH_ROUTES.REGISTER)
  }

  const navigateToForgotPassword = () => {
    navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD)
  }

  return (
    <View
      className={`flex-1 justify-center items-center p-5 ${getThemeClass(isDark, 'background.primary')}`}>
      <Text
        className={`text-2xl font-bold mb-8 font-inter-bold ${getThemeClass(isDark, 'text.primary')}`}>
        Login
      </Text>

      <TouchableOpacity
        className='bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700'
        onPress={handleLogin}>
        <Text className='text-white text-base font-semibold font-inter-semibold'>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className='py-3' onPress={navigateToRegister}>
        <Text className='text-blue-600 text-sm underline font-inter'>
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className='py-3' onPress={navigateToForgotPassword}>
        <Text className='text-blue-600 text-sm underline font-inter'>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  )
}
