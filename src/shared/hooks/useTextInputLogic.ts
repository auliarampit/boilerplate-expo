import { useState, useMemo } from 'react'
import { useColorScheme } from 'react-native'

type InputVariant = 'default' | 'filled' | 'outline'
type InputSize = 'small' | 'medium' | 'large'

interface UseTextInputLogicProps {
  variant: InputVariant
  size: InputSize
  error?: string
  disabled?: boolean
  secureTextEntry?: boolean
}

export const useTextInputLogic = ({
  variant,
  size,
  error,
  disabled = false,
  secureTextEntry = false,
}: UseTextInputLogicProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const hasError = Boolean(error)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const getContainerClasses = () => {
    const baseClasses = 'w-full'
    return baseClasses
  }

  const getInputContainerClasses = () => {
    const baseClasses = 'flex-row items-center rounded-lg'
    const sizeClasses = getSizeClasses()
    const variantClasses = getVariantClasses()
    const stateClasses = getStateClasses()

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${stateClasses}`.trim()
  }

  const getInputClasses = () => {
    const baseClasses = 'flex-1 font-inter'
    const textColorClasses = isDark ? 'text-white' : 'text-gray-900'
    const placeholderClasses = 'placeholder:text-gray-500'

    return `${baseClasses} ${textColorClasses} ${placeholderClasses}`.trim()
  }

  const labelClasses = useMemo(() => {
    const baseClasses = 'font-inter-medium mb-2'
    const colorClasses = hasError
      ? 'text-red-600'
      : isDark
        ? 'text-gray-300'
        : 'text-gray-700'
    const sizeClasses = size === 'small' ? 'text-sm' : 'text-base'

    return `${baseClasses} ${colorClasses} ${sizeClasses}`.trim()
  }, [hasError, isDark, size])

  const helperTextClasses = useMemo(() => {
    const baseClasses = 'font-inter mt-1'
    const colorClasses = hasError
      ? 'text-red-600'
      : isDark
        ? 'text-gray-400'
        : 'text-gray-600'
    const sizeClasses = 'text-sm'

    return `${baseClasses} ${colorClasses} ${sizeClasses}`.trim()
  }, [hasError, isDark])

  const getSizeClasses = () => {
    const sizeMap = {
      small: 'px-3 py-2 min-h-[36px]',
      medium: 'px-4 py-3 min-h-[44px]',
      large: 'px-4 py-4 min-h-[52px]',
    }
    return sizeMap[size]
  }

  const getVariantClasses = () => {
    const variantMap = {
      default: isDark
        ? 'border border-gray-600 bg-gray-800'
        : 'border border-gray-300 bg-white',
      filled: isDark ? 'bg-gray-700 border-0' : 'bg-gray-100 border-0',
      outline: isDark
        ? 'border-2 border-gray-600 bg-transparent'
        : 'border-2 border-gray-300 bg-transparent',
    }
    return variantMap[variant]
  }

  const getStateClasses = () => {
    if (disabled) {
      return 'opacity-50'
    }

    if (hasError) {
      return variant === 'outline' ? 'border-red-500' : 'border border-red-500'
    }

    if (isFocused) {
      return variant === 'outline'
        ? isDark
          ? 'border-blue-500'
          : 'border-blue-500'
        : isDark
          ? 'border-blue-500'
          : 'border-blue-500'
    }

    return ''
  }

  const iconColor = useMemo(() => {
    if (hasError) return '#EF4444'
    if (disabled) return isDark ? '#6B7280' : '#9CA3AF'
    return isDark ? '#9CA3AF' : '#6B7280'
  }, [hasError, disabled, isDark])

  const iconSize = useMemo(() => {
    const sizeMap = {
      small: 18,
      medium: 20,
      large: 22,
    }
    return sizeMap[size]
  }, [size])

  return {
    isDark,
    hasError,
    isFocused,
    isPasswordVisible,
    togglePasswordVisibility,
    handleFocus,
    handleBlur,
    getContainerClasses,
    getInputContainerClasses,
    getInputClasses,
    labelClasses,
    helperTextClasses,
    iconColor,
    iconSize,
  }
}
