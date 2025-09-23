import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import BottomSheet from '../BottomSheet'
import { useTheme } from '../ThemeProvider'
import { getThemeClass } from '../../constants/themeClasses'
import { useBottomSheetLogic } from '../../hooks/useBottomSheetLogic'

// Mock dependencies
jest.mock('../ThemeProvider')
jest.mock('../../constants/themeClasses')
jest.mock('../../hooks/useBottomSheetLogic')
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}))
jest.mock('react-native-gesture-handler', () => ({
  GestureDetector: ({ children }: { children: React.ReactNode }) => children,
}))

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
const mockGetThemeClass = getThemeClass as jest.MockedFunction<typeof getThemeClass>
const mockUseBottomSheetLogic = useBottomSheetLogic as jest.MockedFunction<typeof useBottomSheetLogic>

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

const mockBottomSheetLogic = {
  translateY: { _value: 0 },
  backdropOpacity: { _value: 0.5 },
  panGesture: {},
  showBottomSheet: jest.fn(),
  hideBottomSheet: jest.fn(),
  getSheetHeight: jest.fn(() => 400),
}

const TestContent = () => <Text testID="test-content">Test Content</Text>

describe('BottomSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue(mockTheme as any)
    mockGetThemeClass.mockImplementation((isDark, className) => `theme-${className}`)
    mockUseBottomSheetLogic.mockReturnValue(mockBottomSheetLogic as any)
  })

  describe('Visibility', () => {
    it('does not render when visible is false', () => {
      const { queryByTestId } = render(
        <BottomSheet visible={false} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(queryByTestId('bottom-sheet')).toBeFalsy()
    })

    it('renders when visible is true', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet')).toBeTruthy()
      expect(getByTestId('bottom-sheet-content')).toBeTruthy()
      expect(getByTestId('bottom-sheet-backdrop')).toBeTruthy()
    })

    it('calls showBottomSheet when visible becomes true', () => {
      const { rerender } = render(
        <BottomSheet visible={false} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      rerender(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockBottomSheetLogic.showBottomSheet).toHaveBeenCalled()
    })

    it('calls hideBottomSheet when visible becomes false', () => {
      const { rerender } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      rerender(
        <BottomSheet visible={false} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockBottomSheetLogic.hideBottomSheet).toHaveBeenCalled()
    })
  })

  describe('Basic Rendering', () => {
    it('renders children content', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('test-content')).toBeTruthy()
    })

    it('renders with default props', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet-handle')).toBeTruthy()
      expect(getByTestId('bottom-sheet-close')).toBeTruthy()
    })

    it('uses custom testID', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()} testID="custom-sheet">
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('custom-sheet')).toBeTruthy()
      expect(getByTestId('custom-sheet-content')).toBeTruthy()
      expect(getByTestId('custom-sheet-backdrop')).toBeTruthy()
      expect(getByTestId('custom-sheet-handle')).toBeTruthy()
      expect(getByTestId('custom-sheet-close')).toBeTruthy()
    })
  })

  describe('Title', () => {
    it('does not render title when not provided', () => {
      const { queryByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(queryByTestId('bottom-sheet-title')).toBeFalsy()
    })

    it('renders title when provided', () => {
      const { getByTestId, getByText } = render(
        <BottomSheet visible={true} onClose={jest.fn()} title="Test Title">
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet-title')).toBeTruthy()
      expect(getByText('Test Title')).toBeTruthy()
    })

    it('applies correct title classes', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()} title="Test Title">
          <TestContent />
        </BottomSheet>
      )

      const titleElement = getByTestId('bottom-sheet-title')
      expect(titleElement.props.className).toContain('text-lg')
      expect(titleElement.props.className).toContain('font-inter-semibold')
      expect(titleElement.props.className).toContain('theme-text.primary')
    })
  })

  describe('Handle', () => {
    it('renders handle by default', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet-handle')).toBeTruthy()
    })

    it('does not render handle when showHandle is false', () => {
      const { queryByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()} showHandle={false}>
          <TestContent />
        </BottomSheet>
      )

      expect(queryByTestId('bottom-sheet-handle')).toBeFalsy()
    })

    it('applies correct handle classes', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      const handleElement = getByTestId('bottom-sheet-handle')
      expect(handleElement.props.className).toContain('w-12')
      expect(handleElement.props.className).toContain('h-1')
      expect(handleElement.props.className).toContain('rounded-full')
      expect(handleElement.props.className).toContain('mx-auto')
      expect(handleElement.props.className).toContain('mb-2')
    })
  })

  describe('Close Button', () => {
    it('renders close button by default', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet-close')).toBeTruthy()
    })

    it('does not render close button when showCloseButton is false', () => {
      const { queryByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()} showCloseButton={false}>
          <TestContent />
        </BottomSheet>
      )

      expect(queryByTestId('bottom-sheet-close')).toBeFalsy()
    })

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={onClose}>
          <TestContent />
        </BottomSheet>
      )

      const closeButton = getByTestId('bottom-sheet-close')
      fireEvent.press(closeButton)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('uses correct icon color based on theme', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      const closeButton = getByTestId('bottom-sheet-close')
      const icon = closeButton.props.children
      expect(icon.props.name).toBe('close')
      expect(icon.props.size).toBe(24)
      expect(icon.props.color).toBe('#6B7280') // Light theme color
    })

    it('uses dark theme icon color when isDark is true', () => {
      mockUseTheme.mockReturnValue({
        ...mockTheme,
        isDark: true,
      } as any)

      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      const closeButton = getByTestId('bottom-sheet-close')
      const icon = closeButton.props.children
      expect(icon.props.color).toBe('#9CA3AF') // Dark theme color
    })
  })

  describe('Backdrop', () => {
    it('renders backdrop', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet-backdrop')).toBeTruthy()
    })

    it('calls onClose when backdrop is pressed by default', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={onClose}>
          <TestContent />
        </BottomSheet>
      )

      const backdrop = getByTestId('bottom-sheet-backdrop')
      fireEvent.press(backdrop)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when closeOnBackdrop is false', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={onClose} closeOnBackdrop={false}>
          <TestContent />
        </BottomSheet>
      )

      const backdrop = getByTestId('bottom-sheet-backdrop')
      fireEvent.press(backdrop)
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('Size Variants', () => {
    it('uses medium size by default', () => {
      render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockUseBottomSheetLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 'medium',
        })
      )
    })

    it('uses custom size when provided', () => {
      render(
        <BottomSheet visible={true} onClose={jest.fn()} size="large">
          <TestContent />
        </BottomSheet>
      )

      expect(mockUseBottomSheetLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 'large',
        })
      )
    })

    it('applies correct height from getSheetHeight', () => {
      mockBottomSheetLogic.getSheetHeight.mockReturnValue(600)
      
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()} size="large">
          <TestContent />
        </BottomSheet>
      )

      const content = getByTestId('bottom-sheet-content')
      expect(content.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            height: 600,
          }),
        ])
      )
    })
  })

  describe('Gesture Handling', () => {
    it('enables gesture by default', () => {
      render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockUseBottomSheetLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          enableGesture: true,
        })
      )
    })

    it('disables gesture when enableGesture is false', () => {
      render(
        <BottomSheet visible={true} onClose={jest.fn()} enableGesture={false}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockUseBottomSheetLogic).toHaveBeenCalledWith(
        expect.objectContaining({
          enableGesture: false,
        })
      )
    })
  })

  describe('Theme Integration', () => {
    it('uses light theme classes', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'background.modal')
      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'text.primary')
      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'background.divider')
    })

    it('uses dark theme classes when isDark is true', () => {
      mockUseTheme.mockReturnValue({
        ...mockTheme,
        isDark: true,
      } as any)

      render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockGetThemeClass).toHaveBeenCalledWith(true, 'background.modal')
      expect(mockGetThemeClass).toHaveBeenCalledWith(true, 'text.primary')
      expect(mockGetThemeClass).toHaveBeenCalledWith(true, 'background.divider')
    })

    it('applies correct sheet classes', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      const content = getByTestId('bottom-sheet-content')
      expect(content.props.className).toContain('rounded-t-3xl')
      expect(content.props.className).toContain('shadow-2xl')
      expect(content.props.className).toContain('theme-background.modal')
    })
  })

  describe('Animation Integration', () => {
    it('applies translateY animation to content', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      const content = getByTestId('bottom-sheet-content')
      expect(content.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            transform: [{ translateY: mockBottomSheetLogic.translateY }],
          }),
        ])
      )
    })

    it('applies backdrop opacity animation', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      // The backdrop is wrapped in an Animated.View
      const backdrop = getByTestId('bottom-sheet-backdrop')
      expect(backdrop.parent.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: mockBottomSheetLogic.backdropOpacity,
          }),
        ])
      )
    })
  })

  describe('Complex Scenarios', () => {
    it('renders bottom sheet with all features enabled', () => {
      const onClose = jest.fn()
      const { getByTestId, getByText } = render(
        <BottomSheet
          visible={true}
          onClose={onClose}
          title="Complex Sheet"
          size="large"
          showHandle={true}
          showCloseButton={true}
          closeOnBackdrop={true}
          enableGesture={true}
          testID="complex-sheet"
        >
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('complex-sheet')).toBeTruthy()
      expect(getByTestId('complex-sheet-content')).toBeTruthy()
      expect(getByTestId('complex-sheet-backdrop')).toBeTruthy()
      expect(getByTestId('complex-sheet-handle')).toBeTruthy()
      expect(getByTestId('complex-sheet-close')).toBeTruthy()
      expect(getByTestId('complex-sheet-title')).toBeTruthy()
      expect(getByText('Complex Sheet')).toBeTruthy()
      expect(getByTestId('test-content')).toBeTruthy()
    })

    it('renders minimal bottom sheet', () => {
      const { getByTestId, queryByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={jest.fn()}
          showHandle={false}
          showCloseButton={false}
        >
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet')).toBeTruthy()
      expect(getByTestId('test-content')).toBeTruthy()
      expect(queryByTestId('bottom-sheet-handle')).toBeFalsy()
      expect(queryByTestId('bottom-sheet-close')).toBeFalsy()
      expect(queryByTestId('bottom-sheet-title')).toBeFalsy()
    })

    it('handles multiple interactions correctly', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={onClose}>
          <TestContent />
        </BottomSheet>
      )

      // Test close button
      fireEvent.press(getByTestId('bottom-sheet-close'))
      expect(onClose).toHaveBeenCalledTimes(1)

      // Test backdrop
      fireEvent.press(getByTestId('bottom-sheet-backdrop'))
      expect(onClose).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('handles missing children gracefully', () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          {null}
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet')).toBeTruthy()
    })

    it('handles theme changes correctly', () => {
      const { rerender } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      // Change to dark theme
      mockUseTheme.mockReturnValue({
        ...mockTheme,
        isDark: true,
      } as any)

      rerender(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(mockGetThemeClass).toHaveBeenCalledWith(true, 'background.modal')
    })

    it('handles logic hook errors gracefully', () => {
      mockUseBottomSheetLogic.mockReturnValue({
        ...mockBottomSheetLogic,
        getSheetHeight: jest.fn(() => 0),
      } as any)

      const { getByTestId } = render(
        <BottomSheet visible={true} onClose={jest.fn()}>
          <TestContent />
        </BottomSheet>
      )

      expect(getByTestId('bottom-sheet')).toBeTruthy()
    })
  })
})