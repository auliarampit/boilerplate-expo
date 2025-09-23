import { renderHook, act } from '@testing-library/react-native'
import { z } from 'zod'
import {
  useFormValidation,
  useLoginForm,
  useRegisterForm,
  useContactForm,
} from '../useFormValidation'
import {
  getFieldError,
  hasFieldError,
  getFirstError,
  formatValidationErrors,
} from '../../utils/validationUtils'

// Mock validation utils
jest.mock('../../utils/validationUtils')
const mockGetFieldError = getFieldError as jest.MockedFunction<typeof getFieldError>
const mockHasFieldError = hasFieldError as jest.MockedFunction<typeof hasFieldError>
const mockGetFirstError = getFirstError as jest.MockedFunction<typeof getFirstError>
const mockFormatValidationErrors = formatValidationErrors as jest.MockedFunction<typeof formatValidationErrors>

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}))

// Mock zodResolver
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}))

// Mock validation schemas
jest.mock('../../utils/validationUtils', () => ({
  ...jest.requireActual('../../utils/validationUtils'),
  createLoginSchema: jest.fn(),
  createRegisterSchema: jest.fn(),
  createContactSchema: jest.fn(),
}))

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const mockUseForm = useForm as jest.MockedFunction<typeof useForm>
const mockZodResolver = zodResolver as jest.MockedFunction<typeof zodResolver>

describe('useFormValidation', () => {
  const mockHandleSubmit = jest.fn()
  const mockRegister = jest.fn()
  const mockSetValue = jest.fn()
  const mockGetValues = jest.fn()
  const mockReset = jest.fn()
  const mockTrigger = jest.fn()
  const mockClearErrors = jest.fn()
  const mockSetError = jest.fn()
  const mockWatch = jest.fn()
  const mockUnregister = jest.fn()
  const mockSetFocus = jest.fn()
  const mockGetFieldState = jest.fn()
  const mockResetField = jest.fn()

  const mockFormReturn = {
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    setValue: mockSetValue,
    getValues: mockGetValues,
    reset: mockReset,
    trigger: mockTrigger,
    clearErrors: mockClearErrors,
    setError: mockSetError,
    watch: mockWatch,
    unregister: mockUnregister,
    setFocus: mockSetFocus,
    getFieldState: mockGetFieldState,
    resetField: mockResetField,
    subscribe: jest.fn(),
    formState: {
      errors: {},
      isValid: true,
      isSubmitting: false,
      isDirty: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      isLoading: false,
      isValidating: false,
      submitCount: 0,
      dirtyFields: {},
      touchedFields: {},
      defaultValues: {},
      disabled: false,
      validatingFields: {},
      isReady: true,
    },
    control: {} as any,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseForm.mockReturnValue(mockFormReturn)
    mockZodResolver.mockReturnValue(jest.fn())
    mockGetFieldError.mockReturnValue(undefined)
    mockHasFieldError.mockReturnValue(false)
    mockGetFirstError.mockReturnValue(undefined)
    mockFormatValidationErrors.mockReturnValue({})
  })

  describe('useFormValidation', () => {
    const testSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    it('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      expect(result.current.isValid).toBe(true)
      expect(result.current.isSubmitting).toBe(false)
      expect(result.current.canSubmit()).toBe(true)
    })

    it('should call useForm with correct parameters', () => {
      renderHook(() =>
        useFormValidation({
          schema: testSchema,
          mode: 'onBlur',
        })
      )

      expect(mockUseForm).toHaveBeenCalledWith({
        resolver: expect.any(Function),
        mode: 'onChange',
      })
      expect(mockZodResolver).toHaveBeenCalledWith(testSchema)
    })

    it('should get field error correctly', () => {
      mockGetFieldError.mockReturnValue('Email is required')
      
      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      const error = result.current.getError('email')
      expect(error).toBe('Email is required')
      expect(mockGetFieldError).toHaveBeenCalledWith({}, 'email')
    })

    it('should check if field has error correctly', () => {
      mockHasFieldError.mockReturnValue(true)
      
      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      const hasError = result.current.hasError('email')
      expect(hasError).toBe(true)
      expect(mockHasFieldError).toHaveBeenCalledWith({}, 'email')
    })

    it('should get first error message correctly', () => {
      mockGetFirstError.mockReturnValue('First error message')
      
      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      const firstError = result.current.getFirstErrorMessage()
      expect(firstError).toBe('First error message')
      expect(mockGetFirstError).toHaveBeenCalledWith({})
    })

    it('should get all errors correctly', () => {
      const mockErrors = { email: 'Email error', password: 'Password error' }
      mockFormatValidationErrors.mockReturnValue(mockErrors)
      
      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      const allErrors = result.current.getAllErrors()
      expect(allErrors).toEqual(mockErrors)
      expect(mockFormatValidationErrors).toHaveBeenCalledWith({})
    })

    it('should check if field is valid correctly', () => {
      mockHasFieldError.mockReturnValue(false)
      
      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      const isValid = result.current.isFieldValid('email')
      expect(isValid).toBe(true)
    })

    it('should check canSubmit correctly when form is valid and not submitting', () => {
      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      expect(result.current.canSubmit()).toBe(true)
    })

    it('should check canSubmit correctly when form is invalid', () => {
      mockUseForm.mockReturnValue({
        ...mockFormReturn,
        formState: {
          ...mockFormReturn.formState,
          isValid: false,
        },
      } as any)

      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      expect(result.current.canSubmit()).toBe(false)
    })

    it('should check canSubmit correctly when form is submitting', () => {
      mockUseForm.mockReturnValue({
        ...mockFormReturn,
        formState: {
          ...mockFormReturn.formState,
          isSubmitting: true,
        },
      } as any)

      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
        })
      )

      expect(result.current.canSubmit()).toBe(false)
    })

    it('should handle form submission successfully', async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
      const mockSubmitHandler = jest.fn((successCallback) => {
        return jest.fn(async () => {
          await successCallback({ email: 'test@test.com', password: 'password123' })
        })
      })
      
      mockHandleSubmit.mockImplementation(mockSubmitHandler)

      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
          onSubmit: mockOnSubmit,
        })
      )

      await act(async () => {
        await result.current.handleFormSubmit()
      })

      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })

    it('should handle form submission error', async () => {
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'))
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockSubmitHandler = jest.fn((successCallback) => {
        return jest.fn(async () => {
          await successCallback({ email: 'test@test.com', password: 'password123' })
        })
      })
      
      mockHandleSubmit.mockImplementation(mockSubmitHandler)

      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
          onSubmit: mockOnSubmit,
        })
      )

      await act(async () => {
        await result.current.handleFormSubmit()
      })

      expect(consoleSpy).toHaveBeenCalledWith('Form submission error:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('should handle validation errors', async () => {
      const mockOnError = jest.fn()
      const mockErrors = { email: 'Email error', password: 'Password error' }
      mockFormatValidationErrors.mockReturnValue(mockErrors)
      
      const mockSubmitHandler = jest.fn((successCallback, errorCallback) => {
        return jest.fn(async () => {
          errorCallback({ email: { message: 'Email error' }, password: { message: 'Password error' } })
        })
      })
      
      mockHandleSubmit.mockImplementation(mockSubmitHandler)

      const { result } = renderHook(() =>
        useFormValidation({
          schema: testSchema,
          onError: mockOnError,
        })
      )

      await act(async () => {
        await result.current.handleFormSubmit()
      })

      expect(mockOnError).toHaveBeenCalledWith(mockErrors)
    })
  })

  describe('useLoginForm', () => {
    const mockCreateLoginSchema = require('../../utils/validationUtils').createLoginSchema
    const mockLoginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    beforeEach(() => {
      mockCreateLoginSchema.mockReturnValue(mockLoginSchema)
    })

    it('should initialize login form correctly', () => {
      const mockOnSubmit = jest.fn()
      
      renderHook(() => useLoginForm(mockOnSubmit))

      expect(mockCreateLoginSchema).toHaveBeenCalled()
      expect(mockZodResolver).toHaveBeenCalledWith(mockLoginSchema)
    })

    it('should work without onSubmit callback', () => {
      renderHook(() => useLoginForm())

      expect(mockCreateLoginSchema).toHaveBeenCalled()
    })
  })

  describe('useRegisterForm', () => {
    const mockCreateRegisterSchema = require('../../utils/validationUtils').createRegisterSchema
    const mockRegisterSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string(),
    })

    beforeEach(() => {
      mockCreateRegisterSchema.mockReturnValue(mockRegisterSchema)
    })

    it('should initialize register form correctly', () => {
      const mockOnSubmit = jest.fn()
      
      renderHook(() => useRegisterForm(mockOnSubmit))

      expect(mockCreateRegisterSchema).toHaveBeenCalled()
      expect(mockZodResolver).toHaveBeenCalledWith(mockRegisterSchema)
    })

    it('should work without onSubmit callback', () => {
      renderHook(() => useRegisterForm())

      expect(mockCreateRegisterSchema).toHaveBeenCalled()
    })
  })

  describe('useContactForm', () => {
    const mockCreateContactSchema = require('../../utils/validationUtils').createContactSchema
    const mockContactSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      message: z.string().min(10),
    })

    beforeEach(() => {
      mockCreateContactSchema.mockReturnValue(mockContactSchema)
    })

    it('should initialize contact form correctly', () => {
      const mockOnSubmit = jest.fn()
      
      renderHook(() => useContactForm(mockOnSubmit))

      expect(mockCreateContactSchema).toHaveBeenCalled()
      expect(mockZodResolver).toHaveBeenCalledWith(mockContactSchema)
    })

    it('should work without onSubmit callback', () => {
      renderHook(() => useContactForm())

      expect(mockCreateContactSchema).toHaveBeenCalled()
    })
  })
})