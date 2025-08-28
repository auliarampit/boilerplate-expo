import { useMemo } from 'react'
import { useTheme } from '../components/ThemeProvider'
import { getThemeClass } from '../constants/themeClasses'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'small' | 'medium' | 'large'

interface UseButtonLogicProps {
  variant: ButtonVariant
  size: ButtonSize
  disabled: boolean
  loading: boolean
  fullWidth: boolean
}

export const useButtonLogic = ({
  variant,
  size,
  disabled,
  loading,
  fullWidth,
}: UseButtonLogicProps) => {
  const { isDark } = useTheme()
  const isDisabled = disabled || loading

  const buttonClasses = useMemo(() => {
    const getSizeClasses = () => {
      const sizeMap = {
        small: 'px-3 py-2 min-h-[32px]',
        medium: 'px-4 py-3 min-h-[40px]',
        large: 'px-6 py-4 min-h-[48px]',
      }
      return sizeMap[size]
    }

    const getVariantClasses = () => {
      const variantMap = {
        primary: getThemeClass(isDark, 'background.button.primary'),
        secondary: getThemeClass(isDark, 'background.button.secondary'),
        outline: isDark
          ? 'border border-gray-600 bg-transparent'
          : 'border border-gray-300 bg-transparent',
        ghost: 'bg-transparent',
        danger: getThemeClass(isDark, 'background.button.danger'),
      }
      return variantMap[variant]
    }

    const baseClasses =
      'flex-row items-center justify-center rounded-lg active:opacity-80'
    const sizeClasses = getSizeClasses()
    const variantClasses = getVariantClasses()
    const widthClasses = fullWidth ? 'w-full' : ''
    const disabledClasses = isDisabled ? 'opacity-50' : ''

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${widthClasses} ${disabledClasses}`.trim()
  }, [variant, size, fullWidth, isDark, isDisabled])

  const textClasses = useMemo(() => {
    const getTextSizeClasses = () => {
      const sizeMap = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
      }
      return sizeMap[size]
    }

    const getTextVariantClasses = () => {
      const variantMap = {
        primary: 'text-white',
        secondary: getThemeClass(isDark, 'text.button.secondary'),
        outline: getThemeClass(isDark, 'text.secondary'),
        ghost: getThemeClass(isDark, 'text.button.ghost'),
        danger: 'text-white',
      }
      return variantMap[variant]
    }

    const baseClasses = 'font-inter-medium text-center'
    const sizeClasses = getTextSizeClasses()
    const variantClasses = getTextVariantClasses()

    return `${baseClasses} ${sizeClasses} ${variantClasses}`.trim()
  }, [variant, size, isDark])



  const iconColor = useMemo(() => {
    const colorMap = {
      primary: '#FFFFFF',
      secondary: isDark ? '#FFFFFF' : '#111827',
      outline: isDark ? '#D1D5DB' : '#374151',
      ghost: isDark ? '#60A5FA' : '#2563EB',
      danger: '#FFFFFF',
    }
    return colorMap[variant]
  }, [variant, isDark])

  const iconSize = useMemo(() => {
    const sizeMap = {
      small: 16,
      medium: 20,
      large: 24,
    }
    return sizeMap[size]
  }, [size])

  return {
    isDark,
    isDisabled,
    buttonClasses,
    textClasses,
    iconColor,
    iconSize,
  }
}
