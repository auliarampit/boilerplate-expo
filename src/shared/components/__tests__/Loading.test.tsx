import React from 'react'
import { render } from '@testing-library/react-native'
import Loading from '../Loading'
import { useTheme } from '../ThemeProvider'

// Mock dependencies
jest.mock('../ThemeProvider')

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

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

describe('Loading', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue(mockTheme as any)
  })

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByTestId } = render(<Loading />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator).toBeTruthy()
      expect(activityIndicator.props.size).toBe('large')
      expect(activityIndicator.props.color).toBe('#000000')
    })

    it('renders with custom size', () => {
      const { getByTestId } = render(<Loading size="small" />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.size).toBe('small')
    })

    it('renders with custom color', () => {
      const customColor = '#FF0000'
      const { getByTestId } = render(<Loading color={customColor} />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe(customColor)
    })

    it('uses theme text color when no custom color provided', () => {
      const { getByTestId } = render(<Loading />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe(mockTheme.colors.text)
    })
  })

  describe('Overlay Mode', () => {
    it('renders without overlay by default', () => {
      const { getByTestId } = render(<Loading />)

      const container = getByTestId('loading-container')
      expect(container.props.className).toContain('flex-1')
      expect(container.props.className).toContain('justify-center')
      expect(container.props.className).toContain('items-center')
      expect(container.props.className).not.toContain('absolute')
      expect(container.props.className).not.toContain('inset-0')
      expect(container.props.className).not.toContain('bg-black/50')
      expect(container.props.className).not.toContain('z-50')
    })

    it('renders with overlay when overlay prop is true', () => {
      const { getByTestId } = render(<Loading overlay />)

      const container = getByTestId('loading-container')
      expect(container.props.className).toContain('absolute')
      expect(container.props.className).toContain('inset-0')
      expect(container.props.className).toContain('bg-black/50')
      expect(container.props.className).toContain('dark:bg-white/20')
      expect(container.props.className).toContain('flex-1')
      expect(container.props.className).toContain('justify-center')
      expect(container.props.className).toContain('items-center')
      expect(container.props.className).toContain('z-50')
    })

    it('applies custom className correctly without overlay', () => {
      const customClass = 'custom-loading-class'
      const { getByTestId } = render(<Loading className={customClass} />)

      const container = getByTestId('loading-container')
      expect(container.props.className).toContain(customClass)
      expect(container.props.className).toContain('flex-1 justify-center items-center')
    })

    it('applies custom className correctly with overlay', () => {
      const customClass = 'custom-overlay-class'
      const { getByTestId } = render(<Loading overlay className={customClass} />)

      const container = getByTestId('loading-container')
      expect(container.props.className).toContain(customClass)
      expect(container.props.className).toContain('absolute inset-0 bg-black/50')
    })
  })

  describe('Theme Integration', () => {
    it('uses light theme colors', () => {
      const { getByTestId } = render(<Loading />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe(mockTheme.colors.text)
      expect(mockUseTheme).toHaveBeenCalled()
    })

    it('uses dark theme colors', () => {
      const darkTheme = {
        ...mockTheme,
        isDark: true,
        colors: {
          ...mockTheme.colors,
          text: '#FFFFFF',
        },
      }
      mockUseTheme.mockReturnValue(darkTheme as any)

      const { getByTestId } = render(<Loading />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe('#FFFFFF')
    })

    it('prioritizes custom color over theme color', () => {
      const customColor = '#FF0000'
      const { getByTestId } = render(<Loading color={customColor} />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe(customColor)
      expect(activityIndicator.props.color).not.toBe(mockTheme.colors.text)
    })
  })

  describe('Size Variants', () => {
    it('renders with small size', () => {
      const { getByTestId } = render(<Loading size="small" />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.size).toBe('small')
    })

    it('renders with large size', () => {
      const { getByTestId } = render(<Loading size="large" />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.size).toBe('large')
    })

    it('defaults to large size when not specified', () => {
      const { getByTestId } = render(<Loading />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.size).toBe('large')
    })
  })

  describe('Color Handling', () => {
    it('uses custom color when provided', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']
      
      colors.forEach(color => {
        const { getByTestId } = render(<Loading color={color} />)
        const activityIndicator = getByTestId('activity-indicator')
        expect(activityIndicator.props.color).toBe(color)
      })
    })

    it('falls back to theme text color when no color provided', () => {
      const { getByTestId } = render(<Loading />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe(mockTheme.colors.text)
    })

    it('handles empty string color', () => {
      const { getByTestId } = render(<Loading color="" />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe(mockTheme.colors.text)
    })

    it('handles undefined color', () => {
      const { getByTestId } = render(<Loading color={undefined} />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe(mockTheme.colors.text)
    })
  })

  describe('Complex Scenarios', () => {
    it('renders overlay loading with custom size and color', () => {
      const customColor = '#FF6B35'
      const { getByTestId } = render(
        <Loading overlay size="small" color={customColor} className="custom-class" />
      )

      const container = getByTestId('loading-container')
      const activityIndicator = getByTestId('activity-indicator')

      // Container should have overlay styles
      expect(container.props.className).toContain('absolute')
      expect(container.props.className).toContain('inset-0')
      expect(container.props.className).toContain('bg-black/50')
      expect(container.props.className).toContain('custom-class')

      // ActivityIndicator should have custom props
      expect(activityIndicator.props.size).toBe('small')
      expect(activityIndicator.props.color).toBe(customColor)
    })

    it('renders non-overlay loading with all custom props', () => {
      const customColor = '#8A2BE2'
      const { getByTestId } = render(
        <Loading size="large" color={customColor} className="non-overlay-class" />
      )

      const container = getByTestId('loading-container')
      const activityIndicator = getByTestId('activity-indicator')

      // Container should not have overlay styles
      expect(container.props.className).not.toContain('absolute')
      expect(container.props.className).not.toContain('bg-black/50')
      expect(container.props.className).toContain('flex-1')
      expect(container.props.className).toContain('non-overlay-class')

      // ActivityIndicator should have custom props
      expect(activityIndicator.props.size).toBe('large')
      expect(activityIndicator.props.color).toBe(customColor)
    })

    it('handles theme changes correctly', () => {
      const { getByTestId, rerender } = render(<Loading />)

      // Initial light theme
      let activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe('#000000')

      // Change to dark theme
      mockUseTheme.mockReturnValue({
        ...mockTheme,
        isDark: true,
        colors: {
          ...mockTheme.colors,
          text: '#FFFFFF',
        },
      } as any)

      rerender(<Loading />)
      activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe('#FFFFFF')
    })
  })

  describe('Edge Cases', () => {
    it('handles missing theme context gracefully', () => {
      mockUseTheme.mockReturnValue({
        colors: { text: '#000000' },
      } as any)

      const { getByTestId } = render(<Loading />)

      const activityIndicator = getByTestId('activity-indicator')
      expect(activityIndicator.props.color).toBe('#000000')
    })

    it('handles empty className', () => {
      const { getByTestId } = render(<Loading className="" />)

      const container = getByTestId('loading-container')
      expect(container.props.className).toContain('flex-1 justify-center items-center')
    })

    it('handles multiple className values', () => {
      const { getByTestId } = render(
        <Loading className="class1 class2 class3" overlay />
      )

      const container = getByTestId('loading-container')
      expect(container.props.className).toContain('class1 class2 class3')
      expect(container.props.className).toContain('absolute inset-0')
    })
  })
})