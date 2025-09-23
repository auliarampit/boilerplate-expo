import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import SocialLoginButtons from '../SocialLoginButtons'
import useSocialAuth, { SocialAuthUser } from '../../hooks/useSocialAuth'
import { SocialAuthConfig } from '../../types/navigation'
import { useTranslate } from '../../../translate'
import { useTheme } from '../ThemeProvider'
import { useModalState, useFieldState } from '../../hooks/useCommonStates'

// Mock dependencies
jest.mock('../../hooks/useSocialAuth')
jest.mock('../../../translate')
jest.mock('../ThemeProvider')
jest.mock('../../hooks/useCommonStates')
jest.mock('../Button', () => {
  const MockButton = ({ title, onPress, testID, ...props }: any) => {
    const MockTouchable = require('react-native').TouchableOpacity
    const MockText = require('react-native').Text
    return (
      <MockTouchable testID={testID || 'button'} onPress={onPress} {...props}>
        <MockText>{title}</MockText>
      </MockTouchable>
    )
  }
  return MockButton
})
jest.mock('../Loading', () => {
  const MockLoading = () => {
    const MockText = require('react-native').Text
    return <MockText testID="loading">Loading...</MockText>
  }
  return MockLoading
})
jest.mock('../ConfirmationModal', () => {
  const MockModal = ({ visible, title, message, onConfirm, testID }: any) => {
    const MockView = require('react-native').View
    const MockText = require('react-native').Text
    const MockTouchable = require('react-native').TouchableOpacity
    
    if (!visible) return null
    
    return (
      <MockView testID={testID || 'confirmation-modal'}>
        <MockText testID="modal-title">{title}</MockText>
        <MockText testID="modal-message">{message}</MockText>
        <MockTouchable testID="modal-confirm" onPress={onConfirm}>
          <MockText>OK</MockText>
        </MockTouchable>
      </MockView>
    )
  }
  return MockModal
})
jest.mock('../../constants/themeClasses', () => ({
  getThemeClass: jest.fn((isDark: boolean, key: string) => `theme-${key}-${isDark ? 'dark' : 'light'}`),
}))

const mockUseSocialAuth = useSocialAuth as jest.MockedFunction<typeof useSocialAuth>
const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>
const mockUseModalState = useModalState as jest.MockedFunction<typeof useModalState>
const mockUseFieldState = useFieldState as jest.MockedFunction<typeof useFieldState>

const mockTranslate = {
  t: jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'socialAuth.title': 'Social Login',
      'socialAuth.signInWithGoogle': 'Sign in with Google',
      'socialAuth.signInWithApple': 'Sign in with Apple',
      'socialAuth.signInWithFacebook': 'Sign in with Facebook',
      'socialAuth.signOut': 'Sign Out',
      'socialAuth.signInFailed': 'Sign in failed',
      'socialAuth.signOutFailed': 'Sign out failed',
      'profile.unknownUser': 'Unknown User',
      'profile.noEmail': 'No Email',
      'common.error': 'Error',
      'common.ok': 'OK',
    }
    return translations[key] || key
  }),
}

const mockTheme = {
  isDark: false,
  colors: {
    text: '#000000',
    background: '#ffffff',
    primary: '#007AFF',
  },
  toggleTheme: jest.fn(),
}

const mockModalState = {
  isVisible: false,
  show: jest.fn(),
  hide: jest.fn(),
}

const mockFieldState = {
  value: '',
  setValue: jest.fn(),
  reset: jest.fn(),
}

const mockSocialAuthDefault = {
  user: null,
  isLoading: false,
  error: null,
  isGoogleAvailable: true,
  isAppleAvailable: true,
  isFacebookAvailable: true,
  signInWithGoogle: jest.fn(),
  signInWithApple: jest.fn(),
  signInWithFacebook: jest.fn(),
  signOut: jest.fn(),
}

const mockUser: SocialAuthUser = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  photo: 'https://example.com/photo.jpg',
  provider: 'google',
}

describe('SocialLoginButtons Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslate.mockReturnValue(mockTranslate as any)
    mockUseTheme.mockReturnValue(mockTheme as any)
    mockUseModalState.mockReturnValue(mockModalState as any)
    mockUseFieldState.mockReturnValue(mockFieldState as any)
    mockUseSocialAuth.mockReturnValue(mockSocialAuthDefault as any)
  })

  describe('Basic Rendering', () => {
    it('should render social login buttons when no user is logged in', () => {
      const { getByText } = render(<SocialLoginButtons />)
      
      expect(getByText('Social Login')).toBeTruthy()
      expect(getByText('Sign in with Google')).toBeTruthy()
      expect(getByText('Sign in with Apple')).toBeTruthy()
      expect(getByText('Sign in with Facebook')).toBeTruthy()
    })

    it('should not render title when showTitle is false', () => {
      const { queryByText } = render(<SocialLoginButtons showTitle={false} />)
      
      expect(queryByText('Social Login')).toBeNull()
      expect(queryByText('Sign in with Google')).toBeTruthy()
    })

    it('should render with custom button style', () => {
      const { getByText } = render(<SocialLoginButtons buttonStyle="secondary" />)
      
      expect(getByText('Sign in with Google')).toBeTruthy()
      // Button style is passed to Button component
    })

    it('should apply correct theme classes', () => {
      const { getByText } = render(<SocialLoginButtons />)
      const title = getByText('Social Login')
      
      expect(title.props.className).toContain('theme-text.primary-light')
    })

    it('should apply dark theme classes', () => {
      mockUseTheme.mockReturnValue({
        ...mockTheme,
        isDark: true,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      const title = getByText('Social Login')
      
      expect(title.props.className).toContain('theme-text.primary-dark')
    })
  })

  describe('Loading State', () => {
    it('should render loading component when isLoading is true', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        isLoading: true,
      } as any)

      const { getByTestId, getByText, queryByText } = render(<SocialLoginButtons />)
      
      expect(getByTestId('loading')).toBeTruthy()
      expect(getByText('Social Login')).toBeTruthy()
      expect(queryByText('Sign in with Google')).toBeNull()
    })

    it('should not render loading title when showTitle is false and loading', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        isLoading: true,
      } as any)

      const { getByTestId, queryByText } = render(<SocialLoginButtons showTitle={false} />)
      
      expect(getByTestId('loading')).toBeTruthy()
      expect(queryByText('Social Login')).toBeNull()
    })
  })

  describe('Error Display', () => {
    it('should display error message when error exists', () => {
      const errorMessage = 'Authentication failed'
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        error: errorMessage,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      expect(getByText(errorMessage)).toBeTruthy()
    })

    it('should not display error when no error exists', () => {
      const { queryByText } = render(<SocialLoginButtons />)
      
      // No error text should be present - check for common error patterns
      expect(queryByText(/failed/i)).toBeNull()
      expect(queryByText(/error/i)).toBeNull()
    })
  })

  describe('Provider Availability', () => {
    it('should only render available providers', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        isGoogleAvailable: true,
        isAppleAvailable: false,
        isFacebookAvailable: true,
      } as any)

      const { getByText, queryByText } = render(<SocialLoginButtons />)
      
      expect(getByText('Sign in with Google')).toBeTruthy()
      expect(queryByText('Sign in with Apple')).toBeNull()
      expect(getByText('Sign in with Facebook')).toBeTruthy()
    })

    it('should not render any buttons when no providers are available', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        isGoogleAvailable: false,
        isAppleAvailable: false,
        isFacebookAvailable: false,
      } as any)

      const { queryByText } = render(<SocialLoginButtons />)
      
      expect(queryByText('Sign in with Google')).toBeNull()
      expect(queryByText('Sign in with Apple')).toBeNull()
      expect(queryByText('Sign in with Facebook')).toBeNull()
    })
  })

  describe('User Authentication State', () => {
    it('should render user info and sign out button when user is logged in', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: mockUser,
      } as any)

      const { getByText, queryByText } = render(<SocialLoginButtons />)
      
      expect(getByText('Test User')).toBeTruthy()
      expect(getByText('test@example.com')).toBeTruthy()
      expect(getByText('google')).toBeTruthy()
      expect(getByText('Sign Out')).toBeTruthy()
      
      // Sign in buttons should not be visible
      expect(queryByText('Sign in with Google')).toBeNull()
      expect(queryByText('Sign in with Apple')).toBeNull()
      expect(queryByText('Sign in with Facebook')).toBeNull()
    })

    it('should handle user without name', () => {
      const userWithoutName = { ...mockUser, name: null }
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: userWithoutName,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      expect(getByText('Unknown User')).toBeTruthy()
    })

    it('should handle user without email', () => {
      const userWithoutEmail = { ...mockUser, email: null }
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: userWithoutEmail,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      expect(getByText('No Email')).toBeTruthy()
    })
  })

  describe('Sign In Interactions', () => {
    it('should call signInWithGoogle when Google button is pressed', async () => {
      const mockSignInWithGoogle = jest.fn().mockResolvedValue(mockUser)
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithGoogle: mockSignInWithGoogle,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByText('Sign in with Google'))
      
      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
      })
    })

    it('should call signInWithApple when Apple button is pressed', async () => {
      const mockSignInWithApple = jest.fn().mockResolvedValue(mockUser)
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithApple: mockSignInWithApple,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByText('Sign in with Apple'))
      
      await waitFor(() => {
        expect(mockSignInWithApple).toHaveBeenCalledTimes(1)
      })
    })

    it('should call signInWithFacebook when Facebook button is pressed', async () => {
      const mockSignInWithFacebook = jest.fn().mockResolvedValue(mockUser)
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithFacebook: mockSignInWithFacebook,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByText('Sign in with Facebook'))
      
      await waitFor(() => {
        expect(mockSignInWithFacebook).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onLoginSuccess when sign in is successful', async () => {
      const onLoginSuccess = jest.fn()
      const mockSignInWithGoogle = jest.fn().mockResolvedValue(mockUser)
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithGoogle: mockSignInWithGoogle,
      } as any)

      const { getByText } = render(
        <SocialLoginButtons onLoginSuccess={onLoginSuccess} />
      )
      
      fireEvent.press(getByText('Sign in with Google'))
      
      await waitFor(() => {
        expect(onLoginSuccess).toHaveBeenCalledWith(mockUser)
      })
    })
  })

  describe('Sign Out Interactions', () => {
    it('should call signOut when sign out button is pressed', async () => {
      const mockSignOut = jest.fn().mockResolvedValue(undefined)
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: mockUser,
        signOut: mockSignOut,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByText('Sign Out'))
      
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onLogout when sign out is successful', async () => {
      const onLogout = jest.fn()
      const mockSignOut = jest.fn().mockResolvedValue(undefined)
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: mockUser,
        signOut: mockSignOut,
      } as any)

      const { getByText } = render(
        <SocialLoginButtons onLogout={onLogout} />
      )
      
      fireEvent.press(getByText('Sign Out'))
      
      await waitFor(() => {
        expect(onLogout).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error modal when sign in fails and no onLoginError provided', async () => {
      const error = new Error('Sign in failed')
      const mockSignInWithGoogle = jest.fn().mockRejectedValue(error)
      const mockShow = jest.fn()
      const mockSetValue = jest.fn()
      
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithGoogle: mockSignInWithGoogle,
      } as any)
      
      mockUseModalState.mockReturnValue({
        ...mockModalState,
        show: mockShow,
      } as any)
      
      mockUseFieldState.mockReturnValue({
        ...mockFieldState,
        setValue: mockSetValue,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByText('Sign in with Google'))
      
      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith('Sign in failed')
        expect(mockShow).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onLoginError when sign in fails and onLoginError is provided', async () => {
      const error = new Error('Custom error')
      const onLoginError = jest.fn()
      const mockSignInWithGoogle = jest.fn().mockRejectedValue(error)
      
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithGoogle: mockSignInWithGoogle,
      } as any)

      const { getByText } = render(
        <SocialLoginButtons onLoginError={onLoginError} />
      )
      
      fireEvent.press(getByText('Sign in with Google'))
      
      await waitFor(() => {
        expect(onLoginError).toHaveBeenCalledWith('Custom error')
      })
    })

    it('should handle sign out error', async () => {
      const error = new Error('Sign out failed')
      const mockSignOut = jest.fn().mockRejectedValue(error)
      const mockShow = jest.fn()
      const mockSetValue = jest.fn()
      
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: mockUser,
        signOut: mockSignOut,
      } as any)
      
      mockUseModalState.mockReturnValue({
        ...mockModalState,
        show: mockShow,
      } as any)
      
      mockUseFieldState.mockReturnValue({
        ...mockFieldState,
        setValue: mockSetValue,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByText('Sign Out'))
      
      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith('Sign out failed')
        expect(mockShow).toHaveBeenCalledTimes(1)
      })
    })

    it('should use fallback error message for non-Error objects', async () => {
      const mockSignInWithGoogle = jest.fn().mockRejectedValue('string error')
      const mockShow = jest.fn()
      const mockSetValue = jest.fn()
      
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithGoogle: mockSignInWithGoogle,
      } as any)
      
      mockUseModalState.mockReturnValue({
        ...mockModalState,
        show: mockShow,
      } as any)
      
      mockUseFieldState.mockReturnValue({
        ...mockFieldState,
        setValue: mockSetValue,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByText('Sign in with Google'))
      
      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith('Sign in failed')
        expect(mockShow).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Error Modal', () => {
    it('should render error modal when visible', () => {
      mockUseModalState.mockReturnValue({
        ...mockModalState,
        isVisible: true,
      } as any)
      
      mockUseFieldState.mockReturnValue({
        ...mockFieldState,
        value: 'Test error message',
      } as any)

      const { getByTestId, getByText } = render(<SocialLoginButtons />)
      
      expect(getByTestId('confirmation-modal')).toBeTruthy()
      expect(getByText('Error')).toBeTruthy()
      expect(getByText('Test error message')).toBeTruthy()
    })

    it('should hide error modal when confirm is pressed', () => {
      const mockHide = jest.fn()
      
      mockUseModalState.mockReturnValue({
        ...mockModalState,
        isVisible: true,
        hide: mockHide,
      } as any)
      
      mockUseFieldState.mockReturnValue({
        ...mockFieldState,
        value: 'Test error',
      } as any)

      const { getByTestId } = render(<SocialLoginButtons />)
      
      fireEvent.press(getByTestId('modal-confirm'))
      
      expect(mockHide).toHaveBeenCalledTimes(1)
    })
  })

  describe('Configuration', () => {
    it('should pass config to useSocialAuth hook', () => {
      const config: SocialAuthConfig = {
        google: {
          webClientId: 'test-web-client-id',
        },
        facebook: {
          clientId: 'test-facebook-client-id',
        },
      }

      render(<SocialLoginButtons config={config} />)
      
      expect(mockUseSocialAuth).toHaveBeenCalledWith(config)
    })

    it('should handle config prop correctly', () => {
      const config = {
        google: {
          webClientId: 'test-web-client-id',
          iosClientId: 'test-ios-client-id',
        },
        facebook: {
          clientId: 'test-facebook-client-id',
        },
      }

      render(<SocialLoginButtons config={config} />)
      
      expect(mockUseSocialAuth).toHaveBeenCalledWith(config)
    })

    it('should work without config', () => {
      render(<SocialLoginButtons />)
      
      expect(mockUseSocialAuth).toHaveBeenCalledWith(undefined)
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle all callbacks together', async () => {
      const onLoginSuccess = jest.fn()
      const onLoginError = jest.fn()
      const onLogout = jest.fn()
      
      const mockSignInWithGoogle = jest.fn().mockResolvedValue(mockUser)
      const mockSignOut = jest.fn().mockResolvedValue(undefined)
      
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithGoogle: mockSignInWithGoogle,
        signOut: mockSignOut,
      } as any)

      const { getByText, rerender } = render(
        <SocialLoginButtons
          onLoginSuccess={onLoginSuccess}
          onLoginError={onLoginError}
          onLogout={onLogout}
        />
      )
      
      // Test sign in
      fireEvent.press(getByText('Sign in with Google'))
      
      await waitFor(() => {
        expect(onLoginSuccess).toHaveBeenCalledWith(mockUser)
      })
      
      // Simulate user logged in state
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: mockUser,
        signOut: mockSignOut,
      } as any)
      
      rerender(
        <SocialLoginButtons
          onLoginSuccess={onLoginSuccess}
          onLoginError={onLoginError}
          onLogout={onLogout}
        />
      )
      
      // Test sign out
      fireEvent.press(getByText('Sign Out'))
      
      await waitFor(() => {
        expect(onLogout).toHaveBeenCalledTimes(1)
      })
    })

    it('should handle mixed provider availability', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        isGoogleAvailable: true,
        isAppleAvailable: false,
        isFacebookAvailable: true,
      } as any)

      const { getByText, queryByText } = render(
        <SocialLoginButtons showTitle={false} buttonStyle="secondary" />
      )
      
      expect(queryByText('Social Login')).toBeNull()
      expect(getByText('Sign in with Google')).toBeTruthy()
      expect(queryByText('Sign in with Apple')).toBeNull()
      expect(getByText('Sign in with Facebook')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null user gracefully', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        user: null,
      } as any)

      const { getByText } = render(<SocialLoginButtons />)
      
      expect(getByText('Sign in with Google')).toBeTruthy()
    })

    it('should handle empty error message', () => {
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        error: '',
      } as any)

      const { queryByText } = render(<SocialLoginButtons />)
      
      // Empty error should not be displayed
      expect(queryByText('')).toBeNull()
    })

    it('should handle sign in returning null result', async () => {
      const onLoginSuccess = jest.fn()
      const mockSignInWithGoogle = jest.fn().mockResolvedValue(null)
      
      mockUseSocialAuth.mockReturnValue({
        ...mockSocialAuthDefault,
        signInWithGoogle: mockSignInWithGoogle,
      } as any)

      const { getByText } = render(
        <SocialLoginButtons onLoginSuccess={onLoginSuccess} />
      )
      
      fireEvent.press(getByText('Sign in with Google'))
      
      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
        expect(onLoginSuccess).not.toHaveBeenCalled()
      })
    })
  })
})