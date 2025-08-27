import React from 'react'
import { View, Text } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/validationSchemas'
import { FormTextInput } from './FormTextInput'
import Button from './Button'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading?: boolean
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const handleFormSubmit = (data: RegisterFormData) => {
    onSubmit(data)
  }

  return (
    <View className="w-full space-y-4">
      <Text className="text-2xl font-inter-bold text-center mb-6 dark:text-white">
        Register
      </Text>

      <FormTextInput
        name="name"
        control={control}
        label="Full Name"
        placeholder="Enter your full name"
        autoCapitalize="words"
        autoComplete="name"
        leftIcon="person"
        required
      />

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

      <FormTextInput
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        placeholder="Confirm your password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        leftIcon="lock-closed"
        required
      />

      <Button
        title="Register"
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

export default RegisterForm
