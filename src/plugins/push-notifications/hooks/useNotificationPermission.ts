import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import { hasInStorage, saveToStorage } from '@/utils/storage'

const NOTIFICATION_PERMISSION_KEY = '@notification_permission_requested'
const NOTIFICATION_PERMISSION_SKIPPED_KEY = '@notification_permission_skipped'

export const useNotificationPermission = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkPermissionStatus()
  }, [])

  const checkPermissionStatus = async () => {
    try {
      const hasRequested = await hasInStorage(NOTIFICATION_PERMISSION_KEY)
      const hasSkipped = await hasInStorage(NOTIFICATION_PERMISSION_SKIPPED_KEY)
      if (!hasRequested && !hasSkipped) {
        const { status } = await Notifications.getPermissionsAsync()
        if (status !== 'granted') setShouldShowModal(true)
      }
    } catch (error) {
      console.error('Error checking notification permission status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionGranted = async () => {
    await saveToStorage(NOTIFICATION_PERMISSION_KEY, true)
    setShouldShowModal(false)
  }

  const handlePermissionDenied = async () => {
    await saveToStorage(NOTIFICATION_PERMISSION_KEY, true)
    setShouldShowModal(false)
  }

  const handlePermissionSkipped = async () => {
    await saveToStorage(NOTIFICATION_PERMISSION_SKIPPED_KEY, true)
    setShouldShowModal(false)
  }

  return {
    shouldShowModal,
    isLoading,
    handlePermissionGranted,
    handlePermissionDenied,
    handlePermissionSkipped,
  }
}
