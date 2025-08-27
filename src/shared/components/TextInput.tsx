import React, { useState, forwardRef } from 'react'
import {
  TextInput as RNTextInput,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  TextInputProps as RNTextInputProps,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

type InputVariant = 'default' | 'filled' | 'outline'
type InputSize = 'small' | 'medium' | 'large'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
}

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  variant?: InputVariant
  size?: InputSize
  error?: string
  helperText?: string
  disabled?: boolean
  leftIcon?: keyof typeof Ionicons.glyphMap
  rightIcon?: keyof typeof Ionicons.glyphMap
  onRightIconPress?: () => void
  showPasswordToggle?: boolean
  validation?: ValidationRule
  validateOnBlur?: boolean
  testID?: string
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      variant = 'outline',
      size = 'medium',
      error,
      helperText,
      disabled = false,
      leftIcon,
      rightIcon,
      onRightIconPress,
      showPasswordToggle = false,
      validation,
      validateOnBlur = true,
      testID = 'text-input',
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'

    const [isFocused, setIsFocused] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [validationError, setValidationError] = useState<string | undefined>()

    const isPasswordInput = showPasswordToggle || secureTextEntry
    const currentError = error || validationError
    const hasError = Boolean(currentError)

    const validateInput = (inputValue: string) => {
      if (!validation) return

      let errorMessage: string | undefined

      if (validation.required && !inputValue.trim()) {
        errorMessage = t('validation.required')
      } else if (
        validation.minLength &&
        inputValue.length < validation.minLength
      ) {
        errorMessage = t('validation.minLength', { min: validation.minLength })
      } else if (
        validation.maxLength &&
        inputValue.length > validation.maxLength
      ) {
        errorMessage = t('validation.maxLength', { max: validation.maxLength })
      } else if (validation.pattern && !validation.pattern.test(inputValue)) {
        errorMessage = t('validation.pattern')
      } else if (validation.custom && !validation.custom(inputValue)) {
        errorMessage = t('validation.custom')
      }

      setValidationError(errorMessage)
    }

    const handleChangeText = (text: string) => {
      onChangeText(text)
      if (!validateOnBlur) {
        validateInput(text)
      }
    }

    const handleBlur = () => {
      setIsFocused(false)
      if (validateOnBlur) {
        validateInput(value)
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible)
    }

    const getContainerClasses = () => {
      const baseClasses = 'w-full'
      return baseClasses
    }

    const getInputContainerClasses = () => {
      const baseClasses = 'flex-row items-center'

      // Size classes
      const sizeClasses = {
        small: 'min-h-[36px] px-3',
        medium: 'min-h-[44px] px-4',
        large: 'min-h-[52px] px-4',
      }

      // Variant classes
      const variantClasses = {
        default: '',
        filled: isDark ? 'bg-gray-800' : 'bg-gray-100',
        outline: `border ${
          hasError
            ? 'border-red-500'
            : isFocused
              ? 'border-blue-500'
              : isDark
                ? 'border-gray-600'
                : 'border-gray-300'
        }`,
      }

      // Focus and error states
      const stateClasses = variant === 'outline' ? 'rounded-lg' : 'rounded-lg'

      // Disabled classes
      const disabledClasses = disabled
        ? isDark
          ? 'bg-gray-800 opacity-50'
          : 'bg-gray-200 opacity-50'
        : ''

      return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses} ${disabledClasses}`
    }

    const getInputClasses = () => {
      const baseClasses = 'flex-1 font-inter'

      // Size classes
      const sizeClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
      }

      // Color classes
      const colorClasses = isDark ? 'text-white' : 'text-gray-900'

      return `${baseClasses} ${sizeClasses[size]} ${colorClasses}`
    }

    const getLabelClasses = () => {
      const baseClasses = 'font-inter-medium mb-2'
      const colorClasses = hasError
        ? 'text-red-500'
        : isDark
          ? 'text-gray-300'
          : 'text-gray-700'

      return `${baseClasses} ${colorClasses}`
    }

    const getHelperTextClasses = () => {
      const baseClasses = 'text-sm font-inter mt-1'
      const colorClasses = hasError
        ? 'text-red-500'
        : isDark
          ? 'text-gray-400'
          : 'text-gray-600'

      return `${baseClasses} ${colorClasses}`
    }

    const getIconSize = () => {
      switch (size) {
        case 'small':
          return 16
        case 'medium':
          return 20
        case 'large':
          return 24
        default:
          return 20
      }
    }

    const getIconColor = () => {
      if (hasError) return '#EF4444'
      if (isFocused) return '#3B82F6'
      return isDark ? '#9CA3AF' : '#6B7280'
    }

    return (
      <View className={getContainerClasses()} testID={testID}>
        {label && (
          <Text className={getLabelClasses()} testID={`${testID}-label`}>
            {label}
          </Text>
        )}

        <View
          className={getInputContainerClasses()}
          testID={`${testID}-container`}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={getIconSize()}
              color={getIconColor()}
              style={{ marginRight: 8 }}
            />
          )}

          <RNTextInput
            ref={ref}
            className={getInputClasses()}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            editable={!disabled}
            secureTextEntry={isPasswordInput && !isPasswordVisible}
            testID={`${testID}-input`}
            {...props}
          />

          {isPasswordInput && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{ marginLeft: 8 }}
              testID={`${testID}-password-toggle`}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={getIconSize()}
                color={getIconColor()}
              />
            </TouchableOpacity>
          )}

          {rightIcon && !isPasswordInput && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={{ marginLeft: 8 }}
              testID={`${testID}-right-icon`}
            >
              <Ionicons
                name={rightIcon}
                size={getIconSize()}
                color={getIconColor()}
              />
            </TouchableOpacity>
          )}
        </View>

        {(currentError || helperText) && (
          <Text className={getHelperTextClasses()} testID={`${testID}-helper`}>
            {currentError || helperText}
          </Text>
        )}
      </View>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
