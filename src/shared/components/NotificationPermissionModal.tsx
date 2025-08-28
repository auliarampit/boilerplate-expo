import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { useTranslate } from '@/translate'
import { useTheme } from './ThemeProvider'
import { saveToStorage } from '@/shared/utils/storage'
import ConfirmationModal from './ConfirmationModal'

interface NotificationPermissionModalProps {
  visible: boolean
  onPermissionGranted: () => void
  onPermissionDenied: () => void
}

const NOTIFICATION_PERMISSION_KEY = 'notification_permission_requested'

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  visible,
  onPermissionGranted,
  onPermissionDenied,
}) => {
  const { t } = useTranslate()
  const { colors } = useTheme()
  const [isRequesting, setIsRequesting] = useState(false)
  const [showDeviceError, setShowDeviceError] = useState(false)
  const [showPermissionError, setShowPermissionError] = useState(false)
  const [showGeneralError, setShowGeneralError] = useState(false)
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false)

  const handleRequestPermission = async () => {
    if (!Device.isDevice) {
      setShowDeviceError(true)
      return
    }

    setIsRequesting(true)

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      
      if (existingStatus === 'granted') {
        await saveToStorage(NOTIFICATION_PERMISSION_KEY, 'granted')
        onPermissionGranted()
        return
      }

      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      })

      await saveToStorage(NOTIFICATION_PERMISSION_KEY, status)

      if (status === 'granted') {
        onPermissionGranted()
      } else {
        setShowPermissionError(true)
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      setShowGeneralError(true)
    } finally {
      setIsRequesting(false)
    }
  }

  const handleSkip = () => {
    setShowSkipConfirmation(true)
  }

  const handleSkipConfirm = async () => {
    await saveToStorage(NOTIFICATION_PERMISSION_KEY, 'denied')
    setShowSkipConfirmation(false)
    onPermissionDenied()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View 
          className="bg-white rounded-2xl p-6 w-full max-w-sm"
          style={{ backgroundColor: colors.background }}
        >
          <View className="items-center mb-6">
            <View 
              className="w-16 h-16 rounded-full mb-4 items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-2xl">🔔</Text>
            </View>
            
            <Text 
              className="text-xl font-bold text-center mb-2"
              style={{ color: colors.text }}
            >
              {t('notifications.permissionTitle')}
            </Text>
            
            <Text 
              className="text-base text-center leading-6"
              style={{ color: colors.textSecondary }}
            >
              {t('notifications.permissionMessage')}
            </Text>
          </View>

          <View className="space-y-3">
            <TouchableOpacity
              className="py-4 px-6 rounded-xl items-center"
              style={{ 
                backgroundColor: colors.primary,
                opacity: isRequesting ? 0.7 : 1 
              }}
              onPress={handleRequestPermission}
              disabled={isRequesting}
            >
              <Text className="text-white font-semibold text-base">
                {isRequesting 
                  ? t('notifications.requesting') 
                  : t('notifications.allowNotifications')
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 px-6 rounded-xl items-center border"
              style={{ 
                borderColor: colors.border,
                backgroundColor: 'transparent'
              }}
              onPress={handleSkip}
              disabled={isRequesting}
            >
              <Text 
                className="font-semibold text-base"
                style={{ color: colors.textSecondary }}
              >
                {t('notifications.skipForNow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ConfirmationModal
        visible={showDeviceError}
        title={t('notifications.error.deviceRequired')}
        message={t('notifications.error.deviceRequiredMessage')}
        confirmText={t('common.ok')}
        onConfirm={() => {
          setShowDeviceError(false)
          onPermissionDenied()
        }}
        onCancel={() => {
          setShowDeviceError(false)
          onPermissionDenied()
        }}
      />

      <ConfirmationModal
        visible={showPermissionError}
        title={t('notifications.error.permissionDenied')}
        message={t('notifications.error.permissionDeniedMessage')}
        confirmText={t('common.ok')}
        onConfirm={() => {
          setShowPermissionError(false)
          onPermissionDenied()
        }}
        onCancel={() => {
          setShowPermissionError(false)
          onPermissionDenied()
        }}
      />

      <ConfirmationModal
        visible={showGeneralError}
        title={t('notifications.error.general')}
        message={t('notifications.error.generalMessage')}
        confirmText={t('common.ok')}
        onConfirm={() => {
          setShowGeneralError(false)
          onPermissionDenied()
        }}
        onCancel={() => {
          setShowGeneralError(false)
          onPermissionDenied()
        }}
      />

      <ConfirmationModal
        visible={showSkipConfirmation}
        title={t('notifications.skipTitle')}
        message={t('notifications.skipMessage')}
        confirmText={t('notifications.skipConfirm')}
        cancelText={t('notifications.skipCancel')}
        confirmStyle="destructive"
        onConfirm={handleSkipConfirm}
        onCancel={() => setShowSkipConfirmation(false)}
      />
    </Modal>
  )
}

export default NotificationPermissionModal

export const checkNotificationPermissionStatus = async (): Promise<boolean> => {
  try {
    const { hasInStorage } = await import('@/shared/utils/storage')
    return await hasInStorage(NOTIFICATION_PERMISSION_KEY)
  } catch (error) {
    console.error('Error checking notification permission status:', error)
    return false
  }
}

export const getNotificationPermissionStatus = async (): Promise<string | null> => {
  try {
    const { getFromStorage } = await import('@/shared/utils/storage')
    return await getFromStorage(NOTIFICATION_PERMISSION_KEY, null)
  } catch (error) {
    console.error('Error getting notification permission status:', error)
    return null
  }
}