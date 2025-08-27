import { useEffect, useRef, useCallback } from 'react'
import { Animated, useColorScheme } from 'react-native'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type ToastPosition = 'top' | 'bottom'

interface ToastAction {
  label: string
  onPress: () => void
}

interface UseToastLogicProps {
  visible: boolean
  type: ToastType
  position: ToastPosition
  duration: number
  onHide: () => void
  action?: ToastAction
}

export const useToastLogic = ({
  visible,
  type,
  position,
  duration,
  onHide,
  action,
}: UseToastLogicProps) => {
  const translateY = useRef(
    new Animated.Value(position === 'top' ? -100 : 100)
  ).current
  const opacity = useRef(new Animated.Value(0)).current
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const showToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [translateY, opacity])

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide()
    })
  }, [translateY, opacity, position, onHide])

  useEffect(() => {
    if (visible) {
      showToast()
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          hideToast()
        }, duration)
      }
    } else {
      hideToast()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [visible, duration, showToast, hideToast])

  const handlePress = () => {
    if (action) {
      action.onPress()
    }
    hideToast()
  }

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: 'checkmark-circle' as const,
        backgroundColor: '#10B981',
        borderColor: '#059669',
      },
      error: {
        icon: 'close-circle' as const,
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
      },
      warning: {
        icon: 'warning' as const,
        backgroundColor: '#F59E0B',
        borderColor: '#D97706',
      },
      info: {
        icon: 'information-circle' as const,
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
      },
    }
    return configs[type]
  }

  const getContainerClasses = () => {
    const baseClasses = 'absolute left-4 right-4 z-50'
    const positionClasses = position === 'top' ? 'top-12' : 'bottom-12'

    return `${baseClasses} ${positionClasses}`
  }

  const getToastClasses = () => {
    const baseClasses = 'flex-row items-center p-4 rounded-xl border-l-4'
    const backgroundClasses = isDark ? 'bg-gray-800' : 'bg-white'

    return `${baseClasses} ${backgroundClasses}`
  }

  const getMessageClasses = () => {
    const baseClasses = 'flex-1 ml-3 font-inter'
    const colorClasses = isDark ? 'text-white' : 'text-gray-900'

    return `${baseClasses} ${colorClasses}`
  }

  const getActionClasses = () => {
    const baseClasses = 'ml-3 font-inter-semibold'

    return baseClasses
  }

  return {
    translateY,
    opacity,
    isDark,
    handlePress,
    hideToast,
    getToastConfig,
    getContainerClasses,
    getToastClasses,
    getMessageClasses,
    getActionClasses,
  }
}
