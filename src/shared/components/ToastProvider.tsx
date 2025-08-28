import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from './Toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type ToastPosition = 'top' | 'bottom'

interface ToastConfig {
  message: string
  type?: ToastType
  position?: ToastPosition
  duration?: number
  action?: {
    label: string
    onPress: () => void
  }
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

interface ToastState extends ToastConfig {
  visible: boolean
  id: string
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    position: 'top',
    duration: 4000,
    id: '',
  })

  const showToast = (config: ToastConfig) => {
    const id = Date.now().toString()
    setToastState({
      ...config,
      visible: true,
      id,
    })
  }

  const hideToast = () => {
    setToastState((prev) => ({
      ...prev,
      visible: false,
    }))
  }

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        position={toastState.position}
        duration={toastState.duration}
        action={toastState.action}
        onHide={hideToast}
        testID='global-toast'
      />
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastProvider
