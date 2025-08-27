import React, { useState, forwardRef } from 'react'
import {
  TextInput as RNTextInput,
  View,
  Text,
  TouchableOpacity,
  TextInputProps as RNTextInputProps,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useTextInputLogic } from '../hooks/useTextInputLogic'

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
    const [validationError, setValidationError] = useState<string | undefined>()

    const isPasswordInput = showPasswordToggle || secureTextEntry
    const currentError = error || validationError

    const {
      isPasswordVisible,
      isDark,
      handleFocus,
      handleBlur: hookHandleBlur,
      togglePasswordVisibility,
      getInputContainerClasses,
      getInputClasses,
      labelClasses,
      helperTextClasses,
      iconColor,
      iconSize,
    } = useTextInputLogic({
      variant,
      size,
      error: currentError,
      disabled,
    })

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
      hookHandleBlur()
      if (validateOnBlur) {
        validateInput(value)
      }
    }

    const getContainerClasses = () => {
      return 'w-full'
    }

    return (
      <View className={getContainerClasses()} testID={testID}>
        {label && (
          <Text className={labelClasses} testID={`${testID}-label`}>
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
              size={iconSize}
              color={iconColor}
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
                size={iconSize}
                color={iconColor}
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
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {(currentError || helperText) && (
          <Text className={helperTextClasses} testID={`${testID}-helper`}>
            {currentError || helperText}
          </Text>
        )}
      </View>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
