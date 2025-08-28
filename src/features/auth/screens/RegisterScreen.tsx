import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AuthStackScreenProps } from '@/shared/types/navigation'
import { AUTH_ROUTES } from '@/shared/constants/navigation'
import { useTheme } from '@/shared/components'
import { getThemeClass } from '@/shared'

export const RegisterScreen = ({ navigation }: AuthStackScreenProps<'Register'>) => {
  const { isDark } = useTheme()

  const handleRegister = () => {
    // TODO: Implement register logic
    console.log('Register pressed')
  }

  const navigateToLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN)
  }

  return (
    <View
      className={`flex-1 justify-center items-center p-5 ${getThemeClass(isDark, 'background.primary')}`}
    >
      <Text
        className={`text-2xl font-bold mb-8 font-inter-bold ${getThemeClass(isDark, 'text.primary')}`}
      >
        Register
      </Text>

      <TouchableOpacity
        className="bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700"
        onPress={handleRegister}
      >
        <Text className="text-white text-base font-semibold font-inter-semibold">
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="py-3" onPress={navigateToLogin}>
        <Text className="text-blue-600 text-sm underline font-inter">
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  )
}
