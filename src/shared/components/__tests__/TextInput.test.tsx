import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { TextInput as RNTextInput } from 'react-native'
import TextInput from '../TextInput'
import { useTranslate } from '@/translate'
import { useTextInputLogic } from '../../hooks/useTextInputLogic'

// Mock dependencies
jest.mock('@/translate')
jest.mock('../../hooks/useTextInputLogic')
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}))

const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>
const mockUseTextInputLogic = useTextInputLogic as jest.MockedFunction<typeof useTextInputLogic>

const mockTranslate = {
  t: jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'validation.required': 'This field is required',
      'validation.minLength': 'Minimum length is {min} characters',
      'validation.maxLength': 'Maximum length is {max} characters',
      'validation.pattern': 'Invalid format',
      'validation.custom': 'Custom validation failed',
    }
    return translations[key] || key
  }),
  language: 'en' as const,
  setLanguage: jest.fn(),
}

const mockTextInputLogic = {
  isDark: false,
  hasError: false,
  isFocused: false,
  isPasswordVisible: false,
  togglePasswordVisibility: jest.fn(),
  handleFocus: jest.fn(),
  handleBlur: jest.fn(),
  getContainerClasses: jest.fn(() => 'container-class'),
  getInputContainerClasses: jest.fn(() => 'input-container-class'),
  getInputClasses: jest.fn(() => 'input-class'),
  getLabelClasses: jest.fn(() => 'label-class'),
  getHelperTextClasses: jest.fn(() => 'helper-text-class'),
  getIconColor: jest.fn(() => '#9CA3AF' as const),
  getIconSize: jest.fn(() => 20),
}

describe('TextInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslate.mockReturnValue(mockTranslate)
    mockUseTextInputLogic.mockReturnValue(mockTextInputLogic as any)
  })

  describe('Basic Rendering', () => {
    it('renders correctly with minimal props', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} />
      )

      expect(getByTestId('text-input')).toBeTruthy()
      expect(getByTestId('text-input-input')).toBeTruthy()
    })

    it('renders with label', () => {
      const onChangeText = jest.fn()
      const { getByTestId, getByText } = render(
        <TextInput value="" onChangeText={onChangeText} label="Email" />
      )

      expect(getByTestId('text-input-label')).toBeTruthy()
      expect(getByText('Email')).toBeTruthy()
    })

    it('renders with placeholder', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          placeholder="Enter email"
        />
      )

      const input = getByTestId('text-input-input')
      expect(input.props.placeholder).toBe('Enter email')
    })

    it('renders with helper text', () => {
      const onChangeText = jest.fn()
      const { getByTestId, getByText } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          helperText="This is helper text"
        />
      )

      expect(getByTestId('text-input-helper')).toBeTruthy()
      expect(getByText('This is helper text')).toBeTruthy()
    })

    it('renders with error message', () => {
      const onChangeText = jest.fn()
      const { getByTestId, getByText } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          error="This is an error"
        />
      )

      expect(getByTestId('text-input-helper')).toBeTruthy()
      expect(getByText('This is an error')).toBeTruthy()
    })
  })

  describe('Props and Variants', () => {
    it('passes variant to useTextInputLogic', () => {
      const onChangeText = jest.fn()
      render(
        <TextInput value="" onChangeText={onChangeText} variant="filled" />
      )

      expect(mockUseTextInputLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'filled',
        })
      )
    })

    it('passes size to useTextInputLogic', () => {
      const onChangeText = jest.fn()
      render(<TextInput value="" onChangeText={onChangeText} size="large" />)

      expect(mockUseTextInputLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 'large',
        })
      )
    })

    it('passes disabled state to useTextInputLogic', () => {
      const onChangeText = jest.fn()
      render(<TextInput value="" onChangeText={onChangeText} disabled />)

      expect(mockUseTextInputLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        })
      )
    })

    it('renders as disabled when disabled prop is true', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} disabled />
      )

      const input = getByTestId('text-input-input')
      expect(input.props.editable).toBe(false)
    })
  })

  describe('Icons', () => {
    it('renders left icon', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} leftIcon="mail" />
      )

      expect(getByTestId('text-input-container')).toBeTruthy()
    })

    it('renders right icon with onPress handler', () => {
      const onChangeText = jest.fn()
      const onRightIconPress = jest.fn()
      const { getByTestId } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          rightIcon="search"
          onRightIconPress={onRightIconPress}
        />
      )

      const rightIconButton = getByTestId('text-input-right-icon')
      fireEvent.press(rightIconButton)
      expect(onRightIconPress).toHaveBeenCalledTimes(1)
    })
  })

  describe('Password Toggle', () => {
    it('renders password toggle when showPasswordToggle is true', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} showPasswordToggle />
      )

      expect(getByTestId('text-input-password-toggle')).toBeTruthy()
    })

    it('renders password toggle when secureTextEntry is true', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} secureTextEntry />
      )

      expect(getByTestId('text-input-password-toggle')).toBeTruthy()
    })

    it('calls togglePasswordVisibility when password toggle is pressed', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} showPasswordToggle />
      )

      const toggleButton = getByTestId('text-input-password-toggle')
      fireEvent.press(toggleButton)
      expect(mockTextInputLogic.togglePasswordVisibility).toHaveBeenCalledTimes(1)
    })

    it('sets secureTextEntry based on password visibility', () => {
      const onChangeText = jest.fn()
      mockUseTextInputLogic.mockReturnValue({
        ...mockTextInputLogic,
        isPasswordVisible: false,
      } as any)

      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} showPasswordToggle />
      )

      const input = getByTestId('text-input-input')
      expect(input.props.secureTextEntry).toBe(true)
    })
  })

  describe('User Interactions', () => {
    it('calls onChangeText when text changes', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} />
      )

      const input = getByTestId('text-input-input')
      fireEvent.changeText(input, 'new text')
      expect(onChangeText).toHaveBeenCalledWith('new text')
    })

    it('calls handleFocus from useTextInputLogic on focus', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="" onChangeText={onChangeText} />
      )

      const input = getByTestId('text-input-input')
      fireEvent(input, 'focus')
      expect(mockTextInputLogic.handleFocus).toHaveBeenCalledTimes(1)
    })

    it('calls handleBlur from useTextInputLogic on blur', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput value="test" onChangeText={onChangeText} />
      )

      const input = getByTestId('text-input-input')
      fireEvent(input, 'blur')
      expect(mockTextInputLogic.handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('Validation', () => {
    it('validates required field on blur', async () => {
      const onChangeText = jest.fn()
      const { getByTestId, getByText } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          validation={{ required: true }}
          validateOnBlur
        />
      )

      const input = getByTestId('text-input-input')
      fireEvent(input, 'blur')

      await waitFor(() => {
        expect(getByText('This field is required')).toBeTruthy()
      })
    })

    it('validates minimum length', async () => {
      const onChangeText = jest.fn()
      const { getByTestId, getByText } = render(
        <TextInput
          value="ab"
          onChangeText={onChangeText}
          validation={{ minLength: 5 }}
          validateOnBlur
        />
      )

      const input = getByTestId('text-input-input')
      fireEvent(input, 'blur')

      await waitFor(() => {
        expect(getByText('Minimum length is 5 characters')).toBeTruthy()
      })
    })

    it('validates maximum length', async () => {
      const onChangeText = jest.fn()
      const { getByTestId, getByText } = render(
        <TextInput
          value="this is a very long text"
          onChangeText={onChangeText}
          validation={{ maxLength: 10 }}
          validateOnBlur
        />
      )

      const input = getByTestId('text-input-input')
      fireEvent(input, 'blur')

      await waitFor(() => {
        expect(getByText('Maximum length is 10 characters')).toBeTruthy()
      })
    })

    it('validates pattern', async () => {
      const onChangeText = jest.fn()
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const { getByTestId, getByText } = render(
        <TextInput
          value="invalid-email"
          onChangeText={onChangeText}
          validation={{ pattern: emailPattern }}
          validateOnBlur
        />
      )

      const input = getByTestId('text-input-input')
      fireEvent(input, 'blur')

      await waitFor(() => {
        expect(getByText('Invalid format')).toBeTruthy()
      })
    })

    it('validates custom validation', async () => {
      const onChangeText = jest.fn()
      const customValidation = (value: string) => value.includes('test')
      const { getByTestId, getByText } = render(
        <TextInput
          value="invalid"
          onChangeText={onChangeText}
          validation={{ custom: customValidation }}
          validateOnBlur
        />
      )

      const input = getByTestId('text-input-input')
      fireEvent(input, 'blur')

      await waitFor(() => {
        expect(getByText('Custom validation failed')).toBeTruthy()
      })
    })

    it('validates on change when validateOnBlur is false', async () => {
      const onChangeText = jest.fn()
      const { getByTestId, getByText } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          validation={{ required: true }}
          validateOnBlur={false}
        />
      )

      const input = getByTestId('text-input-input')
      fireEvent.changeText(input, '')

      await waitFor(() => {
        expect(getByText('This field is required')).toBeTruthy()
      })
    })

    it('prioritizes external error over validation error', () => {
      const onChangeText = jest.fn()
      const { getByText } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          error="External error"
          validation={{ required: true }}
        />
      )

      expect(getByText('External error')).toBeTruthy()
    })
  })

  describe('Ref Forwarding', () => {
    it('forwards ref to TextInput', () => {
      const onChangeText = jest.fn()
      const ref = React.createRef<RNTextInput>()
      render(<TextInput ref={ref} value="" onChangeText={onChangeText} />)

      expect(ref.current).toBeTruthy()
    })
  })

  describe('Custom TestID', () => {
    it('uses custom testID', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          testID="custom-input"
        />
      )

      expect(getByTestId('custom-input')).toBeTruthy()
      expect(getByTestId('custom-input-input')).toBeTruthy()
    })
  })

  describe('Additional Props', () => {
    it('passes additional props to TextInput', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput
          value=""
          onChangeText={onChangeText}
          maxLength={10}
          autoCapitalize="words"
        />
      )

      const input = getByTestId('text-input-input')
      expect(input.props.maxLength).toBe(10)
      expect(input.props.autoCapitalize).toBe('words')
    })
  })
})