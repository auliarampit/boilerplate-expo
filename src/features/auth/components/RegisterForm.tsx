import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/Button'
import { FormTextInput } from '@/components/FormTextInput'
import { registerSchema, type RegisterFormData } from '@/utils/validationSchemas'
import { useTranslate } from '@/i18n'
import React from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading?: boolean
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading = false }) => {
  const { t } = useTranslate()
  const { control, handleSubmit, formState: { isValid } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  return (
    <View className='w-full space-y-4'>
      <FormTextInput
        name='name'
        control={control}
        label={t('auth.name')}
        placeholder={t('auth.name')}
        autoCapitalize='words'
        autoComplete='name'
        leftIcon='person'
        required
      />
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
      <FormTextInput
        name='confirmPassword'
        control={control}
        label={t('auth.confirmPassword')}
        placeholder={t('auth.confirmPassword')}
        secureTextEntry
        autoCapitalize='none'
        autoComplete='password'
        leftIcon='lock-closed'
        required
      />
      <Button
        title={t('auth.register')}
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

export default RegisterForm
