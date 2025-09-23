import { z } from 'zod'
import { FieldError, FieldErrors } from 'react-hook-form'

// Common validation patterns
export const createEmailValidation = (
  requiredMessage = 'validation.emailRequired',
  invalidMessage = 'validation.invalidEmail'
) => z.string().min(1, requiredMessage).email(invalidMessage)

export const createPasswordValidation = (
  requiredMessage = 'validation.passwordRequired',
  minLengthMessage = 'validation.passwordTooShort',
  minLength = 6
) => z.string().min(1, requiredMessage).min(minLength, minLengthMessage)

export const createNameValidation = (
  requiredMessage = 'validation.nameRequired',
  tooShortMessage = 'validation.nameTooShort',
  tooLongMessage = 'validation.nameTooLong',
  minLength = 2,
  maxLength = 50
) => z.string()
  .min(1, requiredMessage)
  .min(minLength, tooShortMessage)
  .max(maxLength, tooLongMessage)

export const createPhoneValidation = (
  requiredMessage = 'validation.phoneRequired',
  invalidMessage = 'validation.invalidPhone'
) => z.string()
  .min(1, requiredMessage)
  .regex(/^[+]?[0-9\s\-\(\)]+$/, invalidMessage)

export const createTextValidation = (
  requiredMessage: string,
  tooLongMessage?: string,
  maxLength?: number
) => {
  let schema = z.string().min(1, requiredMessage)
  if (maxLength && tooLongMessage) {
    schema = schema.max(maxLength, tooLongMessage)
  }
  return schema
}

export const createNumberValidation = (
  requiredMessage: string,
  min?: number,
  max?: number,
  minMessage?: string,
  maxMessage?: string
) => {
  let schema = z.number({ message: requiredMessage })
  if (min !== undefined && minMessage) {
    schema = schema.min(min, minMessage)
  }
  if (max !== undefined && maxMessage) {
    schema = schema.max(max, maxMessage)
  }
  return schema
}

// Password confirmation validation
export const createPasswordConfirmationValidation = (
  passwordField = 'password',
  confirmPasswordField = 'confirmPassword',
  mismatchMessage = 'validation.passwordMismatch'
) => z.object({
  [passwordField]: z.string(),
  [confirmPasswordField]: z.string(),
}).refine(
  (data) => data[passwordField as keyof typeof data] === data[confirmPasswordField as keyof typeof data],
  {
    message: mismatchMessage,
    path: [confirmPasswordField],
  }
)

// Form validation utilities
export const getFieldError = (
  errors: FieldErrors,
  fieldName: string
): string | undefined => {
  const error = errors[fieldName] as FieldError | undefined
  return error?.message
}

export const hasFieldError = (
  errors: FieldErrors,
  fieldName: string
): boolean => {
  return !!errors[fieldName]
}

export const getFirstError = (errors: FieldErrors): string | undefined => {
  const firstErrorKey = Object.keys(errors)[0]
  if (!firstErrorKey) return undefined
  return getFieldError(errors, firstErrorKey)
}

export const formatValidationErrors = (
  errors: FieldErrors
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {}
  
  Object.keys(errors).forEach(key => {
    const error = getFieldError(errors, key)
    if (error) {
      formattedErrors[key] = error
    }
  })
  
  return formattedErrors
}

// Schema composition utilities
export const createOptionalField = <T extends z.ZodTypeAny>(schema: T) => 
  schema.optional()

export const createRequiredField = <T extends z.ZodTypeAny>(
  schema: T,
  requiredMessage = 'validation.fieldRequired'
) => schema.refine(val => val !== undefined && val !== null && val !== '', {
  message: requiredMessage
})

// Common schema patterns
export const createLoginSchema = () => z.object({
  email: createEmailValidation(),
  password: createPasswordValidation(),
})

export const createRegisterSchema = () => z.object({
  name: createNameValidation(),
  email: createEmailValidation(),
  password: createPasswordValidation(),
  confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordMismatch',
  path: ['confirmPassword'],
})

export const createContactSchema = () => z.object({
  name: createNameValidation(),
  email: createEmailValidation(),
  subject: createTextValidation(
    'validation.subjectRequired',
    'validation.subjectTooLong',
    100
  ),
  message: createTextValidation(
    'validation.messageRequired',
    'validation.messageTooLong',
    1000
  ),
})

// Validation error handling
export interface ValidationResult<T = unknown> {
  success: boolean
  data?: T
  errors?: Record<string, string>
  message?: string
}

export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  try {
    const result = schema.parse(data)
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      
      return {
        success: false,
        errors,
        message: 'Validation failed',
      }
    }
    
    return {
      success: false,
      message: 'Unknown validation error',
    }
  }
}

export const createAsyncValidator = <T>(
  schema: z.ZodSchema<T>
) => async (data: unknown): Promise<ValidationResult<T>> => {
  return validateSchema(schema, data)
}