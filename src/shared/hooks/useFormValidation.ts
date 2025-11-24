import { useForm, UseFormProps, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  getFieldError, 
  hasFieldError, 
  getFirstError, 
  formatValidationErrors
} from '../utils/validationUtils'

interface UseFormValidationProps<TFormData extends FieldValues = FieldValues> extends UseFormProps<TFormData> {
  schema: z.ZodType<TFormData, any, any>
  onSubmit?: (data: TFormData) => void | Promise<void>
  onError?: (errors: Record<string, string>) => void
}

export const useFormValidation = <TFormData extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  onError,
  ...formProps
}: UseFormValidationProps<TFormData>) => {
  const form = useForm<TFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...formProps,
  })

  const { handleSubmit, formState: { errors, isValid, isSubmitting } } = form

  const getError = (fieldName: string): string | undefined => {
    return getFieldError(errors, fieldName)
  }

  const hasError = (fieldName: string): boolean => {
    return hasFieldError(errors, fieldName)
  }

  const getFirstErrorMessage = (): string | undefined => {
    return getFirstError(errors)
  }

  const getAllErrors = (): Record<string, string> => {
    return formatValidationErrors(errors)
  }

  const handleFormSubmit = handleSubmit(
    async (data: TFormData) => {
      try {
        await onSubmit?.(data)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    },
    (errors) => {
      const formattedErrors = formatValidationErrors(errors)
      onError?.(formattedErrors)
    }
  )

  const isFieldValid = (fieldName: string): boolean => {
    return !hasError(fieldName)
  }

  const canSubmit = (): boolean => {
    return isValid && !isSubmitting
  }

  return {
    ...form,
    // Error handling utilities
    getError,
    hasError,
    getFirstErrorMessage,
    getAllErrors,
    isFieldValid,
    
    // Form state
    isValid,
    isSubmitting,
    canSubmit,
    
    // Submit handler
    handleFormSubmit,
  }
}

// Specialized hooks for common forms
import { 
  LoginFormData, 
  RegisterFormData, 
  ContactFormData 
} from '../schemas/validationSchemas'

export const useLoginForm = (onSubmit?: (data: LoginFormData) => void | Promise<void>) => {
  const { createLoginSchema } = require('../utils/validationUtils')
  return useFormValidation<LoginFormData>({
    schema: createLoginSchema(),
    onSubmit,
  })
}

export const useRegisterForm = (onSubmit?: (data: RegisterFormData) => void | Promise<void>) => {
  const { createRegisterSchema } = require('../utils/validationUtils')
  return useFormValidation<RegisterFormData>({
    schema: createRegisterSchema(),
    onSubmit,
  })
}

export const useContactForm = (onSubmit?: (data: ContactFormData) => void | Promise<void>) => {
  const { createContactSchema } = require('../utils/validationUtils')
  return useFormValidation<ContactFormData>({
    schema: createContactSchema(),
    onSubmit,
  })
}