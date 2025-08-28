import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { TextInputProps } from 'react-native'
import { useTextInputLogic } from './useTextInputLogic'
import { useTranslate } from '@/translate'

interface UseFormTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  name: TName
  control: Control<TFieldValues>
  variant?: 'default' | 'filled' | 'outline'
  size?: 'small' | 'medium' | 'large'
  label?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
}

export const useFormTextInput = <
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
  secureTextEntry = false,
  ...textInputProps
}: UseFormTextInputProps<TFieldValues, TName>) => {
  const { t } = useTranslate()
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? t('validation.fieldRequired') : false },
  })

  const textInputLogic = useTextInputLogic({
    variant,
    size,
    error: error?.message,
    disabled,
    secureTextEntry,
  })

  const handleChangeText = (text: string) => {
    onChange(text)
  }

  const handleBlur = () => {
    onBlur()
    textInputLogic.handleBlur()
  }

  const handleFocus = () => {
    textInputLogic.handleFocus()
  }

  return {
    value,
    onChangeText: handleChangeText,
    onBlur: handleBlur,
    onFocus: handleFocus,
    error: error?.message,
    label,
    helperText,
    required,
    disabled,
    secureTextEntry: secureTextEntry && !textInputLogic.isPasswordVisible,
    ...textInputLogic,
    ...textInputProps,
  }
}
