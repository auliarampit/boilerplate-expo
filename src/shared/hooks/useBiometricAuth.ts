import * as LocalAuthentication from 'expo-local-authentication'
import { useEffect, useState } from 'react'
import { useTranslate } from '@/translate'

export interface BiometricAuthState {
  isAvailable: boolean
  supportedTypes: LocalAuthentication.AuthenticationType[]
  isEnrolled: boolean
  isLoading: boolean
}

export const useBiometricAuth = () => {
  const { t } = useTranslate()
  const [state, setState] = useState<BiometricAuthState>({
    isAvailable: false,
    supportedTypes: [],
    isEnrolled: false,
    isLoading: true,
  })

  useEffect(() => {
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync()
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()

      setState({
        isAvailable,
        supportedTypes,
        isEnrolled,
        isLoading: false,
      })
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }
  }

  const authenticate = async (options?: {
    promptMessage?: string
    cancelLabel?: string
    fallbackLabel?: string
  }): Promise<LocalAuthentication.LocalAuthenticationResult> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options?.promptMessage || t('biometric.promptMessage'),
        cancelLabel: options?.cancelLabel || t('common.cancel'),
        fallbackLabel: options?.fallbackLabel || t('biometric.fallbackLabel'),
        disableDeviceFallback: false,
      })

      return result
    } catch {
      return {
        success: false,
        error: 'authentication_failed',
      }
    }
  }

  const getBiometricType = (): string => {
    if (
      state.supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      return t('biometric.faceId')
    }
    if (
      state.supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      return t('biometric.touchId')
    }
    if (
      state.supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
    ) {
      return t('biometric.iris')
    }
    return t('biometric.title')
  }

  return {
    ...state,
    authenticate,
    getBiometricType,
    checkBiometricSupport,
  }
}
