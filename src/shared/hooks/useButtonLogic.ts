import { useMemo } from 'react'
import { useTheme } from '../components/ThemeProvider'
import { createButtonClasses } from '../utils/classUtils'

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

  const { container: buttonClasses, text: textClasses } = useMemo(() => {
    const classes = createButtonClasses(isDark, variant, size, isDisabled)
    
    const containerClasses = `${classes.container} flex-row active:opacity-80 ${fullWidth ? 'w-full' : ''}`.trim()
    const textClassesWithFont = `${classes.text} font-inter-medium text-center`.trim()
    
    return {
      container: containerClasses,
      text: textClassesWithFont,
    }
  }, [variant, size, fullWidth, isDark, isDisabled])

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
