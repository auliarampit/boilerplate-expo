import React from 'react'
import { View, Text } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/validationSchemas'
import { FormTextInput } from './FormTextInput'
import Button from './Button'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const handleFormSubmit = (data: LoginFormData) => {
    onSubmit(data)
  }

  return (
    <View className="w-full space-y-4">
      <Text className="text-2xl font-inter-bold text-center mb-6 dark:text-white">
        Login
      </Text>

      <FormTextInput
        name="email"
        control={control}
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        leftIcon="mail"
        required
      />

      <FormTextInput
        name="password"
        control={control}
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        leftIcon="lock-closed"
        required
      />

      <Button
        title="Login"
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        disabled={!isValid || isLoading}
        variant="primary"
        size="large"
        fullWidth
      />
    </View>
  )
}

export default LoginForm
