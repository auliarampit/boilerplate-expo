import { useEffect, useRef, useCallback, useMemo } from 'react'
import { Animated } from 'react-native'
import { useTheme } from '../components/ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'

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
  const { isDark } = useTheme()

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

  const toastConfig = useMemo(() => {
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
  }, [type])

  const containerClasses = useMemo(() => {
    const baseClasses = 'absolute left-4 right-4 z-50'
    const positionClasses = position === 'top' ? 'top-12' : 'bottom-12'

    return `${baseClasses} ${positionClasses}`
  }, [position])

  const toastClasses = useMemo(() => {
    const baseClasses = 'flex-row items-center p-4 rounded-xl border-l-4'
    const backgroundClasses = getThemeClass(isDark, 'background.card')

    return `${baseClasses} ${backgroundClasses}`
  }, [isDark])

  const messageClasses = useMemo(() => {
    const baseClasses = 'flex-1 ml-3 font-inter'
    const colorClasses = getThemeClass(isDark, 'text.primary')

    return `${baseClasses} ${colorClasses}`
  }, [isDark])

  const actionClasses = useMemo(() => {
    return 'ml-3 font-inter-semibold'
  }, [])

  return {
    translateY,
    opacity,
    isDark,
    handlePress,
    hideToast,
    toastConfig,
    containerClasses,
    toastClasses,
    messageClasses,
    actionClasses,
  }
}
