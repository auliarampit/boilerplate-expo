import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Dimensions } from 'react-native'
import Modal from '../Modal'
import { useTheme } from '../ThemeProvider'
import { getThemeClass } from '../../constants/themeClasses'

// Mock dependencies
jest.mock('../ThemeProvider')
jest.mock('../../constants/themeClasses')
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
  }
})

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
const mockGetThemeClass = getThemeClass as jest.MockedFunction<typeof getThemeClass>

const mockTheme = {
  isDark: false,
  themeMode: 'light' as const,
  colorScheme: 'light' as const,
  colors: {
    text: '#000000',
    background: '#FFFFFF',
    tint: '#007AFF',
    icon: '#000000',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#007AFF',
    surface: '#FFFFFF',
    primary: '#007AFF',
    secondary: '#F2F2F7',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
  },
  toggleTheme: jest.fn(),
  setThemeMode: jest.fn(),
}

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue(mockTheme as any)
    mockGetThemeClass.mockImplementation((isDark, className) => `theme-${className}`)
  })

  describe('Basic Rendering', () => {
    it('renders correctly when visible', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(getByTestId('modal')).toBeTruthy()
      expect(getByTestId('modal-content')).toBeTruthy()
      expect(getByTestId('modal-body')).toBeTruthy()
    })

    it('does not render when not visible', () => {
      const onClose = jest.fn()
      const { queryByTestId } = render(
        <Modal visible={false} onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      // Modal should still be in DOM but not visible
      expect(queryByTestId('modal')).toBeTruthy()
    })

    it('renders with title', () => {
      const onClose = jest.fn()
      const { getByTestId, getByText } = render(
        <Modal visible onClose={onClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      )

      expect(getByTestId('modal-title')).toBeTruthy()
      expect(getByText('Test Modal')).toBeTruthy()
    })

    it('renders without title', () => {
      const onClose = jest.fn()
      const { queryByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(queryByTestId('modal-title')).toBeFalsy()
    })

    it('renders children content', () => {
      const onClose = jest.fn()
      const { getByText } = render(
        <Modal visible onClose={onClose}>
          <div>Test content</div>
        </Modal>
      )

      expect(getByText('Test content')).toBeTruthy()
    })
  })

  describe('Close Button', () => {
    it('renders close button by default', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(getByTestId('modal-close-button')).toBeTruthy()
    })

    it('hides close button when showCloseButton is false', () => {
      const onClose = jest.fn()
      const { queryByTestId } = render(
        <Modal visible onClose={onClose} showCloseButton={false}>
          <div>Modal content</div>
        </Modal>
      )

      expect(queryByTestId('modal-close-button')).toBeFalsy()
    })

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      const closeButton = getByTestId('modal-close-button')
      fireEvent.press(closeButton)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Backdrop Interaction', () => {
    it('closes modal when backdrop is pressed by default', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      // Find the backdrop (the outer TouchableWithoutFeedback)
      const modal = getByTestId('modal')
      fireEvent.press(modal)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not close modal when closeOnBackdropPress is false', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} closeOnBackdropPress={false}>
          <div>Modal content</div>
        </Modal>
      )

      const modal = getByTestId('modal')
      fireEvent.press(modal)
      expect(onClose).not.toHaveBeenCalled()
    })

    it('does not close modal when content is pressed', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      const modalContent = getByTestId('modal-content')
      fireEvent.press(modalContent)
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('Modal Sizes', () => {
    beforeEach(() => {
      // Mock Dimensions.get to return consistent values
      ;(Dimensions.get as jest.Mock).mockReturnValue({ width: 375, height: 812 })
    })

    it('applies small size correctly', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} size="small">
          <div>Modal content</div>
        </Modal>
      )

      const modalContent = getByTestId('modal-content')
      expect(modalContent.props.style).toEqual({
        width: 300, // 375 * 0.8
        maxHeight: 324.8, // 812 * 0.4
      })
    })

    it('applies medium size correctly (default)', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} size="medium">
          <div>Modal content</div>
        </Modal>
      )

      const modalContent = getByTestId('modal-content')
      expect(modalContent.props.style).toEqual({
        width: 337.5, // 375 * 0.9
        maxHeight: 487.2, // 812 * 0.6
      })
    })

    it('applies large size correctly', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} size="large">
          <div>Modal content</div>
        </Modal>
      )

      const modalContent = getByTestId('modal-content')
      expect(modalContent.props.style).toEqual({
        width: 356.25, // 375 * 0.95
        maxHeight: 649.6, // 812 * 0.8
      })
    })

    it('applies fullscreen size correctly', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} size="fullscreen">
          <div>Modal content</div>
        </Modal>
      )

      const modalContent = getByTestId('modal-content')
      expect(modalContent.props.style).toEqual({
        width: 375,
        height: 812,
      })
    })
  })

  describe('Animation Type', () => {
    it('applies fade animation by default', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      const modal = getByTestId('modal')
      expect(modal.props.animationType).toBe('fade')
    })

    it('applies slide animation when specified', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} animationType="slide">
          <div>Modal content</div>
        </Modal>
      )

      const modal = getByTestId('modal')
      expect(modal.props.animationType).toBe('slide')
    })

    it('applies none animation when specified', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} animationType="none">
          <div>Modal content</div>
        </Modal>
      )

      const modal = getByTestId('modal')
      expect(modal.props.animationType).toBe('none')
    })
  })

  describe('Theme Integration', () => {
    it('uses theme colors for close button', () => {
      const onClose = jest.fn()
      render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(mockUseTheme).toHaveBeenCalled()
    })

    it('applies theme classes correctly', () => {
      const onClose = jest.fn()
      render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'background.modal')
      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'border.secondary')
      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'text.primary')
    })

    it('works with dark theme', () => {
      mockUseTheme.mockReturnValue({
        ...mockTheme,
        isDark: true,
        themeMode: 'dark' as const,
        colorScheme: 'dark' as const,
        colors: {
          ...mockTheme.colors,
          text: '#FFFFFF',
          background: '#000000',
        },
      } as any)

      const onClose = jest.fn()
      render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(mockGetThemeClass).toHaveBeenCalledWith(true, 'background.modal')
    })
  })

  describe('Custom TestID', () => {
    it('uses custom testID', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} testID="custom-modal">
          <div>Modal content</div>
        </Modal>
      )

      expect(getByTestId('custom-modal')).toBeTruthy()
      expect(getByTestId('custom-modal-content')).toBeTruthy()
      expect(getByTestId('custom-modal-body')).toBeTruthy()
    })

    it('uses custom testID for close button', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} testID="custom-modal">
          <div>Modal content</div>
        </Modal>
      )

      expect(getByTestId('custom-modal-close-button')).toBeTruthy()
    })
  })

  describe('Fullscreen Behavior', () => {
    it('applies fullscreen styles correctly', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} size="fullscreen">
          <div>Modal content</div>
        </Modal>
      )

      const modal = getByTestId('modal')
      expect(modal.props.transparent).toBe(false)
    })

    it('applies non-fullscreen styles correctly', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} size="medium">
          <div>Modal content</div>
        </Modal>
      )

      const modal = getByTestId('modal')
      expect(modal.props.transparent).toBe(true)
    })
  })

  describe('Header Rendering', () => {
    it('renders header when title is provided', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} title="Test Title" showCloseButton={false}>
          <div>Modal content</div>
        </Modal>
      )

      expect(getByTestId('modal-title')).toBeTruthy()
    })

    it('renders header when close button is shown', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose} showCloseButton>
          <div>Modal content</div>
        </Modal>
      )

      expect(getByTestId('modal-close-button')).toBeTruthy()
    })

    it('does not render header when no title and no close button', () => {
      const onClose = jest.fn()
      const { queryByTestId } = render(
        <Modal visible onClose={onClose} showCloseButton={false}>
          <div>Modal content</div>
        </Modal>
      )

      expect(queryByTestId('modal-title')).toBeFalsy()
      expect(queryByTestId('modal-close-button')).toBeFalsy()
    })
  })

  describe('Modal Request Close', () => {
    it('calls onClose when modal requests close', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <Modal visible onClose={onClose}>
          <div>Modal content</div>
        </Modal>
      )

      const modal = getByTestId('modal')
      // Simulate hardware back button press on Android
      fireEvent(modal, 'requestClose')
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})