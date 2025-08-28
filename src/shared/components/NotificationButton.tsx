import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useNotification } from './NotificationProvider'
import { useTranslate } from '../../translate'
import { useTheme } from './ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'
import Button from './Button'
import Loading from './Loading'
import ConfirmationModal from './ConfirmationModal'

interface NotificationButtonProps {
  onPermissionGranted?: () => void
  onPermissionDenied?: () => void
  showTestButton?: boolean
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  showTestButton = true,
}) => {
  const { t } = useTranslate()
  const { isDark } = useTheme()
  const {
    expoPushToken,
    notification,
    isLoading,
    error,
    registerForPushNotificationsAsync,
    sendPushNotification,
  } = useNotification()

  const [isSendingTest, setIsSendingTest] = useState(false)
  const [showTokenErrorModal, setShowTokenErrorModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleRegisterNotifications = async () => {
    try {
      await registerForPushNotificationsAsync()
      if (onPermissionGranted) {
        onPermissionGranted()
      }
    } catch {
      if (onPermissionDenied) {
        onPermissionDenied()
      }
    }
  }

  const handleSendTestNotification = async () => {
    if (!expoPushToken) {
      setShowTokenErrorModal(true)
      return
    }

    setIsSendingTest(true)
    try {
      await sendPushNotification({
        title: t('notifications.testTitle'),
        body: t('notifications.testBody'),
        data: { test: true },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : t('notifications.tokenError')
      setErrorMessage(message)
      setShowErrorModal(true)
    } finally {
      setIsSendingTest(false)
    }
  }

  // Tailwind CSS classes will be used instead of StyleSheet

  if (isLoading) {
    return (
      <View className={`p-4 rounded-lg my-2 ${getThemeClass(isDark, 'background.card')}`}>
        <Text className={`text-lg font-bold mb-2 ${getThemeClass(isDark, 'text.primary')}`}>{t('notifications.title')}</Text>
        <Loading />
      </View>
    )
  }

  return (
    <View className={`p-4 rounded-lg my-2 ${getThemeClass(isDark, 'background.card')}`}>
      <Text className={`text-lg font-bold mb-2 ${getThemeClass(isDark, 'text.primary')}`}>{t('notifications.title')}</Text>
      
      {error && (
        <Text className="text-red-500 text-sm mb-3">{error}</Text>
      )}
      
      {expoPushToken ? (
        <>
          <Text className={`text-sm mb-3 opacity-70 ${getThemeClass(isDark, 'text.primary')}`}>
            {t('notifications.enableNotifications')}
          </Text>
          
          <View className={`p-2 rounded mb-3 border ${getThemeClass(isDark, 'combined.inputField')}`}>
            <Text className={`text-xs font-mono ${getThemeClass(isDark, 'text.primary')}`} numberOfLines={3}>
              {expoPushToken}
            </Text>
          </View>
          
          {showTestButton && (
            <View className="gap-2">
              <Button
                title={t('notifications.testNotification')}
                onPress={handleSendTestNotification}
                disabled={isSendingTest}
                loading={isSendingTest}
              />
            </View>
          )}
        </>
      ) : (
        <>
          <Text className={`text-sm mb-3 opacity-70 ${getThemeClass(isDark, 'text.primary')}`}>
            {t('notifications.permissionDenied')}
          </Text>
          
          <View className="gap-2">
            <Button
              title={t('notifications.enableNotifications')}
              onPress={handleRegisterNotifications}
            />
          </View>
        </>
      )}
      
      {notification && (
        <View className={`p-2 rounded mb-3 border ${getThemeClass(isDark, 'combined.inputField')}`}>
          <Text className={`text-sm mb-3 opacity-70 ${getThemeClass(isDark, 'text.primary')}`}>Last notification:</Text>
          <Text className={`text-xs font-mono ${getThemeClass(isDark, 'text.primary')}`}>
            {JSON.stringify(notification, null, 2)}
          </Text>
        </View>
      )}
      
      <ConfirmationModal
        visible={showTokenErrorModal}
        title={t('notifications.tokenError')}
        message={t('notifications.deviceRequired')}
        confirmText={t('common.ok')}
        onConfirm={() => setShowTokenErrorModal(false)}
        onCancel={() => setShowTokenErrorModal(false)}
      />
      
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

export default NotificationButton