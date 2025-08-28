import React, { createContext, useContext, ReactNode } from 'react'
import {
  usePushNotifications,
  PushNotificationState,
} from '../hooks/usePushNotifications'

interface NotificationContextType extends PushNotificationState {
  sendPushNotification: (params: {
    title: string
    body: string
    data?: Record<string, any>
    sound?: string | null
    badge?: number
  }) => Promise<void>
  clearNotifications: () => Promise<void>
  setBadgeCount: (count: number) => Promise<void>
  registerForPushNotificationsAsync: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const notificationState = usePushNotifications()

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}

export default NotificationProvider
