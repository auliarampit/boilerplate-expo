import { zodResolver } from '@hookform/resolvers/zod'
import { getThemeClass } from '@/shared'
import Button from '@/shared/components/Button'
import { FormTextInput } from '@/shared/components/FormTextInput'
import { useTheme } from '@/shared/components/ThemeProvider'
import { AUTH_ROUTES } from '@/shared/constants/navigation'
import { AuthStackScreenProps } from '@/shared/types/navigation'
import { useTranslate } from '@/translate'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordScreen({
  navigation,
}: AuthStackScreenProps<'ForgotPassword'>) {
  const { isDark } = useTheme()
  const { t } = useTranslate()
  const { control, handleSubmit, formState: { isValid, isSubmitting } } =
    useForm<ForgotPasswordFormData>({
      resolver: zodResolver(forgotPasswordSchema),
      mode: 'onChange',
    })

  const handleResetPassword = (_data: ForgotPasswordFormData) => {
    // TODO: wire to your real API — e.g. apiClient.forgotPassword(data.email)
  }

  return (
    <ScrollView
      className={`flex-1 p-5 ${getThemeClass(isDark, 'background.primary')}`}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      keyboardShouldPersistTaps='handled'>
      <View className='max-w-md w-full mx-auto'>
        <Text
          className={`text-3xl font-bold mb-2 text-center font-inter-bold ${getThemeClass(isDark, 'text.primary')}`}>
          {t('auth.forgotPassword')}
        </Text>
        <Text
          className={`text-sm mb-8 text-center font-inter ${getThemeClass(isDark, 'text.secondary')}`}>
          {t('auth.forgotPasswordDescription')}
        </Text>

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

        <View className='mt-4'>
          <Button
            title={t('auth.resetPassword')}
            onPress={handleSubmit(handleResetPassword)}
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            variant='primary'
            size='large'
            fullWidth
          />
        </View>

        <TouchableOpacity className='py-3 mt-2' onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}>
          <Text className='text-blue-600 text-sm text-center underline font-inter'>
            {t('auth.backToLogin')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
