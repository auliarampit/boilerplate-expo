import { getThemeClass } from '@/utils/themeClasses'
import { useTheme } from '@/components'
import { RegisterForm } from '../components/RegisterForm'
import { AUTH_ROUTES } from '@/utils/navigation'
import { useRegister } from '@/hooks/useSimpleAuth'
import { RegisterFormData } from '@/utils/validationSchemas'
import { AuthStackScreenProps } from '@/types/navigation'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

export const RegisterScreen = ({
  navigation,
}: AuthStackScreenProps<'Register'>) => {
  const { isDark } = useTheme()
  const { mutate: register, isPending } = useRegister()

  const handleRegister = (data: RegisterFormData) => {
    register(data)
  }

  const navigateToLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN)
  }

  return (
    <ScrollView
      className={`flex-1 p-5 ${getThemeClass(isDark, 'background.primary')}`}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      keyboardShouldPersistTaps="handled">
      <View className="max-w-md w-full mx-auto">
        <Text
          className={`text-3xl font-bold mb-8 text-center font-inter-bold ${getThemeClass(isDark, 'text.primary')}`}>
          Create Account
        </Text>

        <RegisterForm onSubmit={handleRegister} isLoading={isPending} />

        <View className="mt-6">
          <TouchableOpacity
            className="py-3"
            onPress={navigateToLogin}
            disabled={isPending}>
            <Text className={`text-center text-blue-600 text-sm underline font-inter ${isPending ? 'opacity-50' : ''}`}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
