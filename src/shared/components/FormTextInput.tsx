import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Ionicons } from '@expo/vector-icons'
import { useFormTextInput } from '../hooks/useFormTextInput'

interface FormTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  variant?: 'default' | 'filled' | 'outline'
  size?: 'small' | 'medium' | 'large'
  label?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  secureTextEntry?: boolean
  multiline?: boolean
  numberOfLines?: number
  maxLength?: number
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoComplete?:
    | 'off'
    | 'username'
    | 'password'
    | 'email'
    | 'name'
    | 'tel'
    | 'street-address'
    | 'postal-code'
    | 'cc-number'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
  autoCorrect?: boolean
  leftIcon?: keyof typeof Ionicons.glyphMap
  rightIcon?: keyof typeof Ionicons.glyphMap
  onRightIconPress?: () => void
}

export const FormTextInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  variant = 'default',
  size = 'medium',
  label,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  autoCorrect = true,
  leftIcon,
  rightIcon,
  onRightIconPress,
}: FormTextInputProps<TFieldValues, TName>) => {
  const {
    value,
    onChangeText,
    onBlur,
    onFocus,
    error,
    getContainerClasses,
    getInputContainerClasses,
    getInputClasses,
    getLabelClasses,
    getHelperTextClasses,
    getIconColor,
    getIconSize,
    isPasswordVisible,
    togglePasswordVisibility,
  } = useFormTextInput({
    name,
    control,
    variant,
    size,
    label,
    helperText,
    required,
    disabled,
    secureTextEntry,
    placeholder,
    multiline,
    numberOfLines,
    maxLength,
    keyboardType,
    autoCapitalize,
    autoComplete,
    autoCorrect,
  })

  const showPasswordToggle = secureTextEntry && !multiline
  const finalRightIcon = showPasswordToggle
    ? isPasswordVisible
      ? 'eye-off'
      : 'eye'
    : rightIcon
  const finalOnRightIconPress = showPasswordToggle
    ? togglePasswordVisibility
    : onRightIconPress

  return (
    <View className={getContainerClasses()}>
      {label && (
        <Text className={getLabelClasses()}>
          {label}
          {required && <Text className='text-red-500 ml-1'>*</Text>}
        </Text>
      )}

      <View className={getInputContainerClasses()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={getIconSize()}
            color={getIconColor()}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          className={getInputClasses()}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          placeholderTextColor={getIconColor()}
        />

        {finalRightIcon && (
          <TouchableOpacity
            onPress={finalOnRightIconPress}
            disabled={disabled}
            style={{ marginLeft: 8 }}>
            <Ionicons
              name={finalRightIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <Text className={getHelperTextClasses()}>{error || helperText}</Text>
      )}
    </View>
  )
}

export default FormTextInput
