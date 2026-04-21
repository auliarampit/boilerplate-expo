import { getThemeClass } from '@/shared'
import { useTheme } from '@/shared/components'
import { LoginForm } from '../components/LoginForm'
import { AUTH_ROUTES } from '@/shared/constants/navigation'
import { useLogin } from '@/shared/hooks/useSimpleAuth'
import { LoginFormData } from '@/shared/schemas/validationSchemas'
import { AuthStackScreenProps } from '@/shared/types/navigation'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

export const LoginScreen = ({ navigation }: AuthStackScreenProps<'Login'>) => {
  const { isDark } = useTheme()
  const { mutate: login, isPending } = useLogin()

  const handleLogin = (data: LoginFormData) => {
    login({ email: data.email, password: data.password })
  }

  const navigateToRegister = () => {
    navigation.navigate(AUTH_ROUTES.REGISTER)
  }

  const navigateToForgotPassword = () => {
    navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD)
  }

  return (
    <ScrollView
      className={`flex-1 p-5 ${getThemeClass(isDark, 'background.primary')}`}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      keyboardShouldPersistTaps="handled">
      <View className="max-w-md w-full mx-auto">
        <Text
          className={`text-3xl font-bold mb-8 text-center font-inter-bold ${getThemeClass(isDark, 'text.primary')}`}>
          Welcome Back
        </Text>

        <LoginForm onSubmit={handleLogin} isLoading={isPending} />

        <View className="mt-6 space-y-4">
          <TouchableOpacity
            className="py-3"
            onPress={navigateToRegister}
            disabled={isPending}>
            <Text className={`text-center text-blue-600 text-sm underline font-inter ${isPending ? 'opacity-50' : ''}`}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3"
            onPress={navigateToForgotPassword}
            disabled={isPending}>
            <Text className={`text-center text-blue-600 text-sm underline font-inter ${isPending ? 'opacity-50' : ''}`}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
