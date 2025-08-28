import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useBiometricAuth } from '../hooks/useBiometricAuth'
import { useTranslate } from '../../translate'
import { useTheme } from './ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'
import Loading from './Loading'

interface BiometricButtonProps {
  onSuccess: () => void
  onError?: (error: string) => void
  disabled?: boolean
}

export const BiometricButton: React.FC<BiometricButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
}) => {
  const { isDark } = useTheme()
  const { t } = useTranslate()
  const { isAvailable, isEnrolled, isLoading, authenticate, getBiometricType } =
    useBiometricAuth()

  const getButtonBackgroundClass = () => {
    if (disabled) {
      return `${getThemeClass(isDark, 'background.primary')} opacity-60`
    }
    return 'bg-blue-600'
  }

  const getButtonTextClass = () => {
    if (disabled) {
      return getThemeClass(isDark, 'text.primary')
    }
    return 'text-white'
  }

  const getContainerClass = () => {
    return getThemeClass(isDark, 'background.card')
  }

  const getBorderClass = () => {
    return getThemeClass(isDark, 'combined.inputField')
  }

  const getTextClass = () => {
    return getThemeClass(isDark, 'text.primary')
  }

  const handleBiometricAuth = async () => {
    if (!isAvailable || !isEnrolled || disabled) {
      return
    }

    try {
      const result = await authenticate({
        promptMessage: t('biometric.promptMessage'),
        fallbackLabel: t('biometric.fallbackLabel'),
      })

      if (result.success) {
        onSuccess()
      } else {
        onError?.(t('biometric.authenticationFailed'))
      }
    } catch {
      onError?.(t('biometric.authenticationFailed'))
    }
  }

  if (isLoading) {
    return (
      <View
        className={`py-4 px-5 rounded-xl items-center justify-center min-h-14 ${getContainerClass()}`}
      >
        <Loading size="small" />
      </View>
    )
  }

  if (!isAvailable) {
    return (
      <View
        className={`py-4 px-5 rounded-xl items-center justify-center min-h-14 border border-dashed ${getBorderClass()}`}
      >
        <Text className={`text-sm text-center ${getTextClass()}`}>
          {t('biometric.notAvailable')}
        </Text>
      </View>
    )
  }

  if (!isEnrolled) {
    return (
      <View
        className={`py-4 px-5 rounded-xl items-center justify-center min-h-14 border border-dashed ${getBorderClass()}`}
      >
        <Text className={`text-sm text-center ${getTextClass()}`}>
          {t('biometric.notEnrolled')}
        </Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      className={`py-4 px-5 rounded-xl items-center justify-center min-h-14 shadow-sm ${getButtonBackgroundClass()}`}
      onPress={handleBiometricAuth}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        className={`text-base font-semibold text-center ${getButtonTextClass()}`}
      >
        {t('biometric.title')} ({getBiometricType()})
      </Text>
    </TouchableOpacity>
  )
}
