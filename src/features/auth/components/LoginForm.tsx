import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/Button'
import { FormTextInput } from '@/components/FormTextInput'
import { loginSchema, type LoginFormData } from '@/utils/validationSchemas'
import { useTranslate } from '@/i18n'
import React from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const { t } = useTranslate()
  const { control, handleSubmit, formState: { isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  return (
    <View className='w-full space-y-4'>
      <FormTextInput
        name='email'
        control={control}
        label={t('auth.email')}
        placeholder={t('auth.email')}
        keyboardType='email-address'
        autoCapitalize='none'
        autoComplete='email'
        leftIcon='mail'
        required
      />
      <FormTextInput
        name='password'
        control={control}
        label={t('auth.password')}
        placeholder={t('auth.password')}
        secureTextEntry
        autoCapitalize='none'
        autoComplete='password'
        leftIcon='lock-closed'
        required
      />
      <Button
        title={t('auth.login')}
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={!isValid || isLoading}
        variant='primary'
        size='large'
        fullWidth
      />
    </View>
  )
}

export default LoginForm
