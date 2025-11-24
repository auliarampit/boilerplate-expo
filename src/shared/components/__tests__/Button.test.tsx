import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Button from '../Button'

// Mock useButtonLogic hook
jest.mock('../../hooks/useButtonLogic', () => ({
  useButtonLogic: jest.fn(() => ({
    isDisabled: false,
    buttonClasses: 'mock-button-classes',
    textClasses: 'mock-text-classes',
    iconColor: '#000000',
    iconSize: 20,
  })),
}))

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, style, ...props }: any) => {
    const MockIcon = require('react-native').Text
    return (
      <MockIcon
        testID={`icon-${name}`}
        style={[{ fontSize: size, color }, style]}
        {...props}>
        {name}
      </MockIcon>
    )
  },
}))

const { useButtonLogic } = require('../../hooks/useButtonLogic')

describe('Button Component', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useButtonLogic.mockReturnValue({
      isDisabled: false,
      buttonClasses: 'mock-button-classes',
      textClasses: 'mock-text-classes',
      iconColor: '#000000',
      iconSize: 20,
    })
  })

  describe('Basic Rendering', () => {
    it('should render button with title', () => {
      const { getByText } = render(<Button {...defaultProps} />)
      expect(getByText('Test Button')).toBeTruthy()
    })

    it('should render with default testID', () => {
      const { getByTestId } = render(<Button {...defaultProps} />)
      expect(getByTestId('button')).toBeTruthy()
    })

    it('should render with custom testID', () => {
      const { getByTestId } = render(
        <Button {...defaultProps} testID="custom-button" />
      )
      expect(getByTestId('custom-button')).toBeTruthy()
    })

    it('should render button text with correct testID', () => {
      const { getByTestId } = render(<Button {...defaultProps} />)
      expect(getByTestId('button-text')).toBeTruthy()
    })
  })

  describe('Props and Variants', () => {
    it('should call useButtonLogic with correct props', () => {
      render(
        <Button
          {...defaultProps}
          variant="secondary"
          size="large"
          disabled={true}
          loading={false}
          fullWidth={true}
        />
      )

      expect(useButtonLogic).toHaveBeenCalledWith({
        variant: 'secondary',
        size: 'large',
        disabled: true,
        loading: false,
        fullWidth: true,
      })
    })

    it('should use default props when not provided', () => {
      render(<Button {...defaultProps} />)

      expect(useButtonLogic).toHaveBeenCalledWith({
        variant: 'primary',
        size: 'medium',
        disabled: false,
        loading: false,
        fullWidth: false,
      })
    })

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red' }
      const customTextStyle = { fontSize: 18 }
      
      const { getByTestId } = render(
        <Button
          {...defaultProps}
          style={customStyle}
          textStyle={customTextStyle}
        />
      )

      const button = getByTestId('button')
      const text = getByTestId('button-text')
      
      expect(button.props.style).toEqual(customStyle)
      expect(text.props.style).toEqual(customTextStyle)
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      const { getByTestId, queryByText } = render(
        <Button {...defaultProps} loading={true} />
      )

      expect(getByTestId('button-loading')).toBeTruthy()
      expect(queryByText('Test Button')).toBeNull()
    })

    it('should hide text and icon when loading', () => {
      const { queryByTestId, queryByText } = render(
        <Button {...defaultProps} loading={true} icon="home" />
      )

      expect(queryByText('Test Button')).toBeNull()
      expect(queryByTestId('icon-home')).toBeNull()
    })

    it('should use correct loading indicator size for small button', () => {
      const { getByTestId } = render(
        <Button {...defaultProps} loading={true} size="small" />
      )

      const loadingIndicator = getByTestId('button-loading')
      expect(loadingIndicator.props.size).toBe('small')
    })

    it('should use correct loading indicator size for medium/large button', () => {
      const { getByTestId } = render(
        <Button {...defaultProps} loading={true} size="large" />
      )

      const loadingIndicator = getByTestId('button-loading')
      expect(loadingIndicator.props.size).toBe('small')
    })
  })

  describe('Icon Rendering', () => {
    it('should render icon when provided', () => {
      const { getByTestId } = render(
        <Button {...defaultProps} icon="home" />
      )

      expect(getByTestId('icon-home')).toBeTruthy()
    })

    it('should not render icon when not provided', () => {
      const { queryByTestId } = render(<Button {...defaultProps} />)
      expect(queryByTestId(/^icon-/)).toBeNull()
    })

    it('should render icon on the left by default', () => {
      const { getByTestId } = render(
        <Button {...defaultProps} icon="home" />
      )

      const icon = getByTestId('icon-home')
      expect(icon.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ marginRight: 8, marginLeft: 0 }),
        ])
      )
    })

    it('should render icon on the right when iconPosition is right', () => {
      const { getByTestId } = render(
        <Button {...defaultProps} icon="home" iconPosition="right" />
      )

      const icon = getByTestId('icon-home')
      expect(icon.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ marginRight: 0, marginLeft: 8 }),
        ])
      )
    })

    it('should use correct icon size and color from useButtonLogic', () => {
      useButtonLogic.mockReturnValue({
        isDisabled: false,
        buttonClasses: 'mock-button-classes',
        textClasses: 'mock-text-classes',
        iconColor: '#ff0000',
        iconSize: 24,
      })

      const { getByTestId } = render(
        <Button {...defaultProps} icon="home" />
      )

      const icon = getByTestId('icon-home')
      expect(icon.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fontSize: 24, color: '#ff0000' }),
        ])
      )
    })
  })

  describe('Disabled State', () => {
    it('should be disabled when useButtonLogic returns isDisabled true', () => {
      useButtonLogic.mockReturnValue({
        isDisabled: true,
        buttonClasses: 'mock-button-classes',
        textClasses: 'mock-text-classes',
        iconColor: '#cccccc',
        iconSize: 20,
      })

      const { getByTestId } = render(<Button {...defaultProps} />)
      const button = getByTestId('button')
      
      expect(button.props.disabled).toBe(true)
    })

    it('should not be disabled when useButtonLogic returns isDisabled false', () => {
      const { getByTestId } = render(<Button {...defaultProps} />)
      const button = getByTestId('button')
      
      expect(button.props.disabled).toBe(false)
    })
  })

  describe('User Interactions', () => {
    it('should call onPress when button is pressed', () => {
      const onPressMock = jest.fn()
      const { getByTestId } = render(
        <Button {...defaultProps} onPress={onPressMock} />
      )

      fireEvent.press(getByTestId('button'))
      expect(onPressMock).toHaveBeenCalledTimes(1)
    })

    it('should not call onPress when button is disabled', () => {
      useButtonLogic.mockReturnValue({
        isDisabled: true,
        buttonClasses: 'mock-button-classes',
        textClasses: 'mock-text-classes',
        iconColor: '#cccccc',
        iconSize: 20,
      })

      const onPressMock = jest.fn()
      const { getByTestId } = render(
        <Button {...defaultProps} onPress={onPressMock} />
      )

      fireEvent.press(getByTestId('button'))
      expect(onPressMock).not.toHaveBeenCalled()
    })

    it('should have correct activeOpacity', () => {
      const { getByTestId } = render(<Button {...defaultProps} />)
      const button = getByTestId('button')
      
      expect(button.props.activeOpacity).toBe(0.8)
    })
  })

  describe('Component Memoization', () => {
    it('should have correct displayName', () => {
      expect(Button.displayName).toBe('Button')
    })

    it('should be memoized', () => {
      // Test that the component is wrapped with React.memo
      expect(Button.$$typeof).toBeDefined()
    })
  })

  describe('Complex Scenarios', () => {
    it('should render correctly with all props', () => {
      const { getByTestId, getByText } = render(
        <Button
          title="Complex Button"
          onPress={jest.fn()}
          variant="danger"
          size="large"
          disabled={false}
          loading={false}
          icon="warning"
          iconPosition="right"
          fullWidth={true}
          testID="complex-button"
          style={{ backgroundColor: 'blue' }}
          textStyle={{ fontWeight: 'bold' }}
        />
      )

      expect(getByTestId('complex-button')).toBeTruthy()
      expect(getByText('Complex Button')).toBeTruthy()
      expect(getByTestId('icon-warning')).toBeTruthy()
    })

    it('should prioritize loading state over icon rendering', () => {
      const { getByTestId, queryByTestId } = render(
        <Button
          {...defaultProps}
          loading={true}
          icon="home"
        />
      )

      expect(getByTestId('button-loading')).toBeTruthy()
      expect(queryByTestId('icon-home')).toBeNull()
    })
  })
})