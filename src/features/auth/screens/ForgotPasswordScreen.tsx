import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AuthStackScreenProps } from '@/shared/types/navigation'
import { AUTH_ROUTES } from '@/shared/constants/navigation'
import { useColorScheme } from '@/shared/hooks/useColorScheme'

export function ForgotPasswordScreen({
  navigation,
}: AuthStackScreenProps<'ForgotPassword'>) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const handleResetPassword = () => {
    // TODO: Implement reset password logic
    console.log('Reset password pressed')
  }

  const navigateToLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN)
  }

  return (
    <View
      className={`flex-1 justify-center items-center p-5 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <Text
        className={`text-2xl font-bold mb-8 font-inter-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        Forgot Password
      </Text>

      <TouchableOpacity
        className="bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700"
        onPress={handleResetPassword}
      >
        <Text className="text-white text-base font-semibold font-inter-semibold">
          Reset Password
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
