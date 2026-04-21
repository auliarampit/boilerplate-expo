import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Dimensions } from 'react-native'
import Toast from '../Toast'
import { useToastLogic } from '@/hooks/useToastLogic'

// Mock dependencies
jest.mock('@/hooks/useToastLogic')
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}))
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Animated: {
      ...RN.Animated,
      View: 'Animated.View',
    },
  }
})

const mockUseToastLogic = useToastLogic as jest.MockedFunction<typeof useToastLogic>

const mockToastLogic = {
  translateY: { _value: 0 },
  opacity: { _value: 1 },
  isDark: false,
  handlePress: jest.fn(),
  toastConfig: {
    icon: 'information-circle' as const,
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  containerClasses: 'absolute z-50 left-4 right-4',
  toastClasses: 'flex-row items-center p-4 bg-white rounded-lg border-l-4',
  messageClasses: 'flex-1 text-gray-800 text-sm font-medium mx-3',
  actionClasses: 'text-sm font-semibold',
}

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseToastLogic.mockReturnValue(mockToastLogic as any)
  })

  describe('Basic Rendering', () => {
    it('renders correctly when visible', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      expect(getByTestId('toast')).toBeTruthy()
      expect(getByTestId('toast-container')).toBeTruthy()
      expect(getByTestId('toast-message')).toBeTruthy()
      expect(getByTestId('toast-icon')).toBeTruthy()
      expect(getByTestId('toast-close')).toBeTruthy()
    })

    it('does not render when not visible', () => {
      const onHide = jest.fn()
      const { queryByTestId } = render(
        <Toast visible={false} message="Test message" onHide={onHide} />
      )

      expect(queryByTestId('toast')).toBeFalsy()
    })

    it('renders message correctly', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test toast message" onHide={onHide} />
      )

      const messageElement = getByTestId('toast-message')
      expect(messageElement.props.children).toBe('Test toast message')
    })

    it('limits message to 3 lines', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Very long message" onHide={onHide} />
      )

      const messageElement = getByTestId('toast-message')
      expect(messageElement.props.numberOfLines).toBe(3)
    })
  })

  describe('Toast Types', () => {
    it('renders info toast by default', () => {
      const onHide = jest.fn()
      render(<Toast visible message="Info message" onHide={onHide} />)

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
        })
      )
    })

    it('renders success toast', () => {
      const onHide = jest.fn()
      render(
        <Toast visible message="Success message" type="success" onHide={onHide} />
      )

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        })
      )
    })

    it('renders error toast', () => {
      const onHide = jest.fn()
      render(
        <Toast visible message="Error message" type="error" onHide={onHide} />
      )

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        })
      )
    })

    it('renders warning toast', () => {
      const onHide = jest.fn()
      render(
        <Toast visible message="Warning message" type="warning" onHide={onHide} />
      )

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'warning',
        })
      )
    })
  })

  describe('Toast Position', () => {
    it('uses top position by default', () => {
      const onHide = jest.fn()
      render(<Toast visible message="Test message" onHide={onHide} />)

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'top',
        })
      )
    })

    it('uses bottom position when specified', () => {
      const onHide = jest.fn()
      render(
        <Toast
          visible
          message="Test message"
          position="bottom"
          onHide={onHide}
        />
      )

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 'bottom',
        })
      )
    })
  })

  describe('Toast Duration', () => {
    it('uses default duration of 4000ms', () => {
      const onHide = jest.fn()
      render(<Toast visible message="Test message" onHide={onHide} />)

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 4000,
        })
      )
    })

    it('uses custom duration when specified', () => {
      const onHide = jest.fn()
      render(
        <Toast visible message="Test message" duration={2000} onHide={onHide} />
      )

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 2000,
        })
      )
    })
  })

  describe('Toast Actions', () => {
    it('renders action button when action is provided', () => {
      const onHide = jest.fn()
      const actionPress = jest.fn()
      const { getByTestId } = render(
        <Toast
          visible
          message="Test message"
          action={{ label: 'Retry', onPress: actionPress }}
          onHide={onHide}
        />
      )

      expect(getByTestId('toast-action')).toBeTruthy()
    })

    it('does not render action button when no action is provided', () => {
      const onHide = jest.fn()
      const { queryByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      expect(queryByTestId('toast-action')).toBeFalsy()
    })

    it('calls action onPress when action button is pressed', () => {
      const onHide = jest.fn()
      const actionPress = jest.fn()
      const { getByTestId } = render(
        <Toast
          visible
          message="Test message"
          action={{ label: 'Retry', onPress: actionPress }}
          onHide={onHide}
        />
      )

      const actionButton = getByTestId('toast-action')
      fireEvent.press(actionButton)
      expect(actionPress).toHaveBeenCalledTimes(1)
    })

    it('passes action to useToastLogic', () => {
      const onHide = jest.fn()
      const actionPress = jest.fn()
      const action = { label: 'Retry', onPress: actionPress }
      render(
        <Toast visible message="Test message" action={action} onHide={onHide} />
      )

      expect(mockUseToastLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          action,
        })
      )
    })
  })

  describe('User Interactions', () => {
    it('calls handlePress when toast container is pressed', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const container = getByTestId('toast-container')
      fireEvent.press(container)
      expect(mockToastLogic.handlePress).toHaveBeenCalledTimes(1)
    })

    it('calls handlePress when close button is pressed', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const closeButton = getByTestId('toast-close')
      fireEvent.press(closeButton)
      expect(mockToastLogic.handlePress).toHaveBeenCalledTimes(1)
    })
  })

  describe('Styling and Animation', () => {
    it('applies correct max width based on screen width', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const toast = getByTestId('toast')
      expect(toast.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            maxWidth: 343, // 375 - 32
          }),
        ])
      )
    })

    it('applies animation values from useToastLogic', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const toast = getByTestId('toast')
      expect(toast.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            transform: [{ translateY: mockToastLogic.translateY }],
            opacity: mockToastLogic.opacity,
          }),
        ])
      )
    })

    it('applies container classes from useToastLogic', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const toast = getByTestId('toast')
      expect(toast.props.className).toBe(mockToastLogic.containerClasses)
    })

    it('applies toast classes from useToastLogic', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const container = getByTestId('toast-container')
      const toastView = container.props.children
      expect(toastView.props.className).toBe(mockToastLogic.toastClasses)
    })

    it('applies shadow styles correctly', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const container = getByTestId('toast-container')
      const toastView = container.props.children
      expect(toastView.props.style).toEqual(
        expect.objectContaining({
          borderLeftColor: mockToastLogic.toastConfig.borderColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        })
      )
    })
  })

  describe('Icon Configuration', () => {
    it('uses icon from toastConfig', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const icon = getByTestId('toast-icon')
      expect(icon.props.name).toBe(mockToastLogic.toastConfig.icon)
      expect(icon.props.color).toBe(mockToastLogic.toastConfig.backgroundColor)
      expect(icon.props.size).toBe(20)
    })

    it('uses correct close icon color based on theme', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const closeIcon = getByTestId('toast-close').props.children
      expect(closeIcon.props.name).toBe('close')
      expect(closeIcon.props.size).toBe(16)
      expect(closeIcon.props.color).toBe('#6B7280') // light theme color
    })

    it('uses dark theme close icon color when isDark is true', () => {
      mockUseToastLogic.mockReturnValue({
        ...mockToastLogic,
        isDark: true,
      } as any)

      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const closeIcon = getByTestId('toast-close').props.children
      expect(closeIcon.props.color).toBe('#9CA3AF') // dark theme color
    })
  })

  describe('Custom TestID', () => {
    it('uses custom testID', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast
          visible
          message="Test message"
          testID="custom-toast"
          onHide={onHide}
        />
      )

      expect(getByTestId('custom-toast')).toBeTruthy()
      expect(getByTestId('custom-toast-container')).toBeTruthy()
      expect(getByTestId('custom-toast-message')).toBeTruthy()
      expect(getByTestId('custom-toast-icon')).toBeTruthy()
      expect(getByTestId('custom-toast-close')).toBeTruthy()
    })
  })

  describe('Props Passing to useToastLogic', () => {
    it('passes all props correctly to useToastLogic', () => {
      const onHide = jest.fn()
      const action = { label: 'Action', onPress: jest.fn() }
      render(
        <Toast
          visible
          message="Test message"
          type="success"
          position="bottom"
          duration={3000}
          action={action}
          onHide={onHide}
        />
      )

      expect(mockUseToastLogic).toHaveBeenCalledWith({
        visible: true,
        type: 'success',
        position: 'bottom',
        duration: 3000,
        onHide,
        action,
      })
    })
  })

  describe('Touch Feedback', () => {
    it('applies correct activeOpacity to container', () => {
      const onHide = jest.fn()
      const { getByTestId } = render(
        <Toast visible message="Test message" onHide={onHide} />
      )

      const container = getByTestId('toast-container')
      expect(container.props.activeOpacity).toBe(0.9)
    })
  })
})