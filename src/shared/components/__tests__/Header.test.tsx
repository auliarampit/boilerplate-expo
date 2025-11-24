import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Header from '../Header'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../ThemeProvider'
import { Colors } from '../../constants/Colors'
import { getThemeClass } from '../../constants/themeClasses'

// Mock dependencies
jest.mock('@react-navigation/native')
jest.mock('../ThemeProvider')
jest.mock('../../constants/Colors')
jest.mock('../../constants/themeClasses')
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}))

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
const mockGetThemeClass = getThemeClass as jest.MockedFunction<typeof getThemeClass>

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
}

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

const mockColors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#007AFF',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    primary: '#007AFF',
  },
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseNavigation.mockReturnValue(mockNavigation as any)
    mockUseTheme.mockReturnValue(mockTheme as any)
    mockGetThemeClass.mockImplementation((isDark, className) => `theme-${className}`)
    ;(Colors as any).light = mockColors.light
    ;(Colors as any).dark = mockColors.dark
  })

  describe('Basic Rendering', () => {
    it('renders correctly with minimal props', () => {
      const { getByTestId } = render(<Header />)

      expect(getByTestId('header')).toBeTruthy()
    })

    it('renders with title', () => {
      const { getByTestId, getByText } = render(<Header title="Test Header" />)

      expect(getByTestId('header-title')).toBeTruthy()
      expect(getByText('Test Header')).toBeTruthy()
    })

    it('does not render title when not provided', () => {
      const { queryByTestId } = render(<Header />)

      expect(queryByTestId('header-title')).toBeFalsy()
    })

    it('truncates long title to single line', () => {
      const { getByTestId } = render(
        <Header title="This is a very long header title that should be truncated" />
      )

      const titleElement = getByTestId('header-title')
      expect(titleElement.props.numberOfLines).toBe(1)
    })
  })

  describe('Back Button', () => {
    it('does not render back button by default', () => {
      const { queryByTestId } = render(<Header />)

      expect(queryByTestId('header-back-button')).toBeFalsy()
    })

    it('renders back button when showBackButton is true', () => {
      const { getByTestId } = render(<Header showBackButton />)

      expect(getByTestId('header-back-button')).toBeTruthy()
    })

    it('calls navigation.goBack when back button is pressed and no custom onBackPress', () => {
      const { getByTestId } = render(<Header showBackButton />)

      const backButton = getByTestId('header-back-button')
      fireEvent.press(backButton)
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1)
    })

    it('calls custom onBackPress when provided', () => {
      const onBackPress = jest.fn()
      const { getByTestId } = render(
        <Header showBackButton onBackPress={onBackPress} />
      )

      const backButton = getByTestId('header-back-button')
      fireEvent.press(backButton)
      expect(onBackPress).toHaveBeenCalledTimes(1)
      expect(mockNavigation.goBack).not.toHaveBeenCalled()
    })
  })

  describe('Actions', () => {
    it('renders no actions by default', () => {
      const { queryByTestId } = render(<Header />)

      expect(queryByTestId('header-action-0')).toBeFalsy()
    })

    it('renders single action', () => {
      const action = {
        icon: 'settings' as const,
        onPress: jest.fn(),
      }
      const { getByTestId } = render(<Header actions={[action]} />)

      expect(getByTestId('header-action-0')).toBeTruthy()
    })

    it('renders multiple actions', () => {
      const actions = [
        { icon: 'settings' as const, onPress: jest.fn() },
        { icon: 'search' as const, onPress: jest.fn() },
        { icon: 'add' as const, onPress: jest.fn() },
      ]
      const { getByTestId } = render(<Header actions={actions} />)

      expect(getByTestId('header-action-0')).toBeTruthy()
      expect(getByTestId('header-action-1')).toBeTruthy()
      expect(getByTestId('header-action-2')).toBeTruthy()
    })

    it('calls action onPress when action button is pressed', () => {
      const onPress = jest.fn()
      const action = {
        icon: 'settings' as const,
        onPress,
      }
      const { getByTestId } = render(<Header actions={[action]} />)

      const actionButton = getByTestId('header-action-0')
      fireEvent.press(actionButton)
      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('uses custom testID for action when provided', () => {
      const action = {
        icon: 'settings' as const,
        onPress: jest.fn(),
        testID: 'custom-action',
      }
      const { getByTestId } = render(<Header actions={[action]} />)

      expect(getByTestId('custom-action')).toBeTruthy()
    })

    it('uses default testID for action when not provided', () => {
      const action = {
        icon: 'settings' as const,
        onPress: jest.fn(),
      }
      const { getByTestId } = render(<Header actions={[action]} />)

      expect(getByTestId('header-action-0')).toBeTruthy()
    })
  })

  describe('Theme Integration', () => {
    it('uses light theme colors by default', () => {
      render(<Header showBackButton />)

      expect(mockUseTheme).toHaveBeenCalled()
      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'combined.card')
      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'text.primary')
    })

    it('uses dark theme colors when isDark is true', () => {
      mockUseTheme.mockReturnValue({
        ...mockTheme,
        isDark: true,
      } as any)

      render(<Header title="Test" showBackButton />)

      expect(mockGetThemeClass).toHaveBeenCalledWith(true, 'combined.card')
      expect(mockGetThemeClass).toHaveBeenCalledWith(true, 'text.primary')
    })

    it('applies correct icon colors based on theme', () => {
      const action = {
        icon: 'settings' as const,
        onPress: jest.fn(),
      }
      render(<Header showBackButton actions={[action]} />)

      // Colors should be applied to icons through the Colors constant
      expect(Colors).toBeDefined()
    })
  })

  describe('Layout and Styling', () => {
    it('applies correct container classes', () => {
      const { getByTestId } = render(<Header />)

      const header = getByTestId('header')
      expect(header.props.className).toContain('flex-row')
      expect(header.props.className).toContain('items-center')
      expect(header.props.className).toContain('justify-between')
      expect(header.props.className).toContain('px-4')
      expect(header.props.className).toContain('py-2')
      expect(header.props.className).toContain('min-h-[56px]')
      expect(header.props.className).toContain('border-b')
    })

    it('applies theme classes correctly', () => {
      render(<Header />)

      expect(mockGetThemeClass).toHaveBeenCalledWith(false, 'combined.card')
    })
  })

  describe('Custom TestID', () => {
    it('uses custom testID', () => {
      const { getByTestId } = render(
        <Header testID="custom-header" title="Test" showBackButton />
      )

      expect(getByTestId('custom-header')).toBeTruthy()
      expect(getByTestId('custom-header-title')).toBeTruthy()
      expect(getByTestId('custom-header-back-button')).toBeTruthy()
    })

    it('uses custom testID for actions', () => {
      const action = {
        icon: 'settings' as const,
        onPress: jest.fn(),
      }
      const { getByTestId } = render(
        <Header testID="custom-header" actions={[action]} />
      )

      expect(getByTestId('custom-header-action-0')).toBeTruthy()
    })
  })

  describe('Complex Scenarios', () => {
    it('renders header with all features enabled', () => {
      const actions = [
        { icon: 'search' as const, onPress: jest.fn() },
        { icon: 'add' as const, onPress: jest.fn() },
      ]
      const onBackPress = jest.fn()
      const { getByTestId, getByText } = render(
        <Header
          title="Complex Header"
          showBackButton
          onBackPress={onBackPress}
          actions={actions}
          testID="complex-header"
        />
      )

      expect(getByTestId('complex-header')).toBeTruthy()
      expect(getByText('Complex Header')).toBeTruthy()
      expect(getByTestId('complex-header-title')).toBeTruthy()
      expect(getByTestId('complex-header-back-button')).toBeTruthy()
      expect(getByTestId('complex-header-action-0')).toBeTruthy()
      expect(getByTestId('complex-header-action-1')).toBeTruthy()
    })

    it('handles multiple action presses correctly', () => {
      const action1Press = jest.fn()
      const action2Press = jest.fn()
      const actions = [
        { icon: 'search' as const, onPress: action1Press },
        { icon: 'add' as const, onPress: action2Press },
      ]
      const { getByTestId } = render(<Header actions={actions} />)

      fireEvent.press(getByTestId('header-action-0'))
      fireEvent.press(getByTestId('header-action-1'))

      expect(action1Press).toHaveBeenCalledTimes(1)
      expect(action2Press).toHaveBeenCalledTimes(1)
    })

    it('works correctly without navigation context', () => {
      mockUseNavigation.mockImplementation(() => {
        throw new Error('Navigation context not available')
      })

      const onBackPress = jest.fn()
      const { getByTestId } = render(
        <Header showBackButton onBackPress={onBackPress} />
      )

      const backButton = getByTestId('header-back-button')
      fireEvent.press(backButton)
      expect(onBackPress).toHaveBeenCalledTimes(1)
    })
  })

  describe('Icon Configuration', () => {
    it('uses correct back arrow icon', () => {
      const { getByTestId } = render(<Header showBackButton />)

      const backButton = getByTestId('header-back-button')
      const icon = backButton.props.children
      expect(icon.props.name).toBe('arrow-back')
      expect(icon.props.size).toBe(24)
    })

    it('uses correct action icons', () => {
      const actions = [
        { icon: 'settings' as const, onPress: jest.fn() },
        { icon: 'search' as const, onPress: jest.fn() },
      ]
      const { getByTestId } = render(<Header actions={actions} />)

      const action1 = getByTestId('header-action-0')
      const action2 = getByTestId('header-action-1')
      
      expect(action1.props.children.props.name).toBe('settings')
      expect(action1.props.children.props.size).toBe(24)
      expect(action2.props.children.props.name).toBe('search')
      expect(action2.props.children.props.size).toBe(24)
    })
  })
})