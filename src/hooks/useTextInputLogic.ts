import { useMemo } from 'react'
import { useTheme } from '../components/ThemeProvider'
import { createInputClasses } from '@/utils/classUtils'
import { usePasswordVisibility, useFocusState } from './useCommonStates'

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
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility()
  const { isFocused, onFocus: handleFocus, onBlur: handleBlur } = useFocusState()
  const { isDark } = useTheme()
  const hasError = Boolean(error)

  const inputClasses = useMemo(() => {
    // Map variant to match createInputClasses expected values
    const mappedVariant = variant === 'default' ? 'outline' : variant as 'outline' | 'filled'
    
    return createInputClasses(
      isDark,
      mappedVariant,
      size,
      hasError,
      isFocused,
      disabled
    )
  }, [isDark, variant, size, hasError, isFocused, disabled])

  const getContainerClasses = () => {
    return 'w-full'
  }

  const getInputContainerClasses = () => {
    return inputClasses.container
  }

  const getInputClasses = () => {
    return inputClasses.input
  }

  const labelClasses = useMemo(() => {
    return inputClasses.label
  }, [inputClasses.label])

  const helperTextClasses = useMemo(() => {
    return inputClasses.helperText
  }, [inputClasses.helperText])



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
    getLabelClasses: () => labelClasses,
    getHelperTextClasses: () => helperTextClasses,
    getIconColor: () => iconColor,
    getIconSize: () => iconSize,
  }
}
