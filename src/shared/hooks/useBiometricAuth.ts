import * as LocalAuthentication from 'expo-local-authentication'
import { useEffect, useState } from 'react'

export interface BiometricAuthState {
  isAvailable: boolean
  supportedTypes: LocalAuthentication.AuthenticationType[]
  isEnrolled: boolean
  isLoading: boolean
}

export const useBiometricAuth = () => {
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
      setState(prev => ({
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
        promptMessage: options?.promptMessage || 'Authenticate with biometrics',
        cancelLabel: options?.cancelLabel || 'Cancel',
        fallbackLabel: options?.fallbackLabel || 'Use Passcode',
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
      return 'Face ID'
    }
    if (
      state.supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      return 'Touch ID'
    }
    if (
      state.supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
    ) {
      return 'Iris'
    }
    return 'Biometric'
  }

  return {
    ...state,
    authenticate,
    getBiometricType,
    checkBiometricSupport,
  }
}
