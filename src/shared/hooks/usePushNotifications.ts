import { useState, useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

export interface PushNotificationState {
  expoPushToken: string | null
  notification: Notifications.Notification | null
  isLoading: boolean
  error: string | null
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    expoPushToken: null,
    notification: null,
    isLoading: true,
    error: null,
  })

  const notificationListener = useRef<Notifications.Subscription | null>(null)
  const responseListener = useRef<Notifications.Subscription | null>(null)

  useEffect(() => {
    registerForPushNotificationsAsync()

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setState(prev => ({ ...prev, notification }))
    })

    // Listen for notification responses (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle notification response here
      console.log('Notification response:', response)
    })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  const registerForPushNotificationsAsync = async () => {
    try {
      if (!Device.isDevice) {
        setState(prev => ({
          ...prev,
          error: 'Must use physical device for Push Notifications',
          isLoading: false,
        }))
        return
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        setState(prev => ({
          ...prev,
          error: 'Failed to get push token for push notification!',
          isLoading: false,
        }))
        return
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      })

      setState(prev => ({
        ...prev,
        expoPushToken: token.data,
        isLoading: false,
      }))

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        })
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
      }))
    }
  }

  const sendPushNotification = async ({
    title,
    body,
    data = {},
    sound = 'default',
    badge,
  }: {
    title: string
    body: string
    data?: Record<string, any>
    sound?: string | null
    badge?: number
  }) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: sound === 'default' ? true : sound || undefined,
          badge,
        },
        trigger: null, // Send immediately
      })
    } catch (error) {
      console.error('Error sending push notification:', error)
    }
  }

  const clearNotifications = async () => {
    await Notifications.dismissAllNotificationsAsync()
    setState(prev => ({ ...prev, notification: null }))
  }

  const setBadgeCount = async (count: number) => {
    await Notifications.setBadgeCountAsync(count)
  }

  return {
    ...state,
    sendPushNotification,
    clearNotifications,
    setBadgeCount,
    registerForPushNotificationsAsync,
  }
}