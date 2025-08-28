import React, { useState } from 'react'
import { View, Text } from 'react-native'
import useSocialAuth, { SocialAuthUser } from '../hooks/useSocialAuth'
import { useTranslate } from '../../translate'
import { useTheme } from './ThemeProvider'
import Button from './Button'
import Loading from './Loading'
import ConfirmationModal from './ConfirmationModal'
import { SocialAuthConfig } from '../types/navigation'
import { getThemeClass } from '../constants/themeClasses'



interface SocialLoginButtonsProps {
  config?: SocialAuthConfig
  onLoginSuccess?: (user: SocialAuthUser) => void
  onLoginError?: (error: string) => void
  onLogout?: () => void
  showTitle?: boolean
  buttonStyle?: 'primary' | 'secondary'
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  config,
  onLoginSuccess,
  onLoginError,
  onLogout,
  showTitle = true,
  buttonStyle = 'primary',
}) => {
  const { t } = useTranslate()
  const { isDark } = useTheme()
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const {
    user,
    isLoading,
    error,
    isGoogleAvailable,
    isAppleAvailable,
    isFacebookAvailable,
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook,
    signOut,
  } = useSocialAuth(config)

  const showError = (message: string) => {
    setErrorMessage(message)
    setShowErrorModal(true)
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle()
      if (result && onLoginSuccess) {
        onLoginSuccess(result)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('socialAuth.signInFailed')
      if (onLoginError) {
        onLoginError(message)
      } else {
        showError(message)
      }
    }
  }

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithApple()
      if (result && onLoginSuccess) {
        onLoginSuccess(result)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('socialAuth.signInFailed')
      if (onLoginError) {
        onLoginError(message)
      } else {
        showError(message)
      }
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithFacebook()
      if (result && onLoginSuccess) {
        onLoginSuccess(result)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('socialAuth.signInFailed')
      if (onLoginError) {
        onLoginError(message)
      } else {
        showError(message)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      if (onLogout) {
        onLogout()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('socialAuth.signOutFailed')
      if (onLoginError) {
        onLoginError(message)
      } else {
        showError(message)
      }
    }
  }

  // Tailwind CSS classes will be used instead of StyleSheet

  if (isLoading) {
    return (
      <View className="p-4">
        {showTitle && <Text className={`text-lg font-bold mb-4 text-center ${getThemeClass(isDark, 'text.primary')}`}>{t('socialAuth.title')}</Text>}
        <View className="items-center justify-center p-5">
          <Loading />
        </View>
      </View>
    )
  }

  return (
    <View className="p-4">
      {showTitle && <Text className={`text-lg font-bold mb-4 text-center ${getThemeClass(isDark, 'text.primary')}`}>{t('socialAuth.title')}</Text>}
      
      {error && <Text className="text-red-500 text-sm mb-3 text-center">{error}</Text>}
      
      {user ? (
        <View>
          <View className={`p-4 rounded-lg mb-4 border ${getThemeClass(isDark, 'combined.inputField')}`}>
            <Text className={`text-base font-bold mb-1 ${getThemeClass(isDark, 'text.primary')}`}>{user.name || 'Unknown User'}</Text>
            <Text className={`text-sm mb-1 opacity-70 ${getThemeClass(isDark, 'text.primary')}`}>{user.email || 'No email'}</Text>
            <Text className="text-xs text-blue-500 capitalize">{user.provider}</Text>
          </View>
          
          <Button
            title={t('socialAuth.signOut')}
            onPress={handleSignOut}
            variant={buttonStyle}
          />
        </View>
      ) : (
        <View className="gap-3">
          {isGoogleAvailable && (
            <Button
              title={t('socialAuth.signInWithGoogle')}
              onPress={handleGoogleSignIn}
              variant={buttonStyle}
            />
          )}
          
          {isAppleAvailable && (
            <Button
              title={t('socialAuth.signInWithApple')}
              onPress={handleAppleSignIn}
              variant={buttonStyle}
            />
          )}
          
          {isFacebookAvailable && (
            <Button
              title={t('socialAuth.signInWithFacebook')}
              onPress={handleFacebookSignIn}
              variant={buttonStyle}
            />
          )}
        </View>
      )}
      
      <ConfirmationModal
        visible={showErrorModal}
        title={t('common.error')}
        message={errorMessage}
        confirmText={t('common.ok')}
        onConfirm={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
      />
    </View>
  )
}

export default SocialLoginButtons