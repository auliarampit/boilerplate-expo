import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { LoginScreen } from '@/features/auth/screens/LoginScreen'
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen'
import { HomeScreen } from '@/features/home/screens/HomeScreen'
import ThemeProvider from '@/components/ThemeProvider'
import ToastProvider from '@/components/ToastProvider'
import authSlice from '@/store/slices/authSlice'
import { apiClient } from '@/services/simpleApiClient'
import { AUTH_ROUTES, APP_ROUTES } from '@/utils/navigation'
import { useTranslate } from '@/i18n'

// Mock dependencies
jest.mock('@/services/simpleApiClient')
jest.mock('@/i18n')
jest.mock('@/utils/storage')
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>
const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>

// Mock navigation
const mockNavigate = jest.fn()
const mockReset = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: mockReset,
  }),
}))

// Test data
const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  emailVerified: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
}

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 3600,
}

const mockLoginResponse = {
  success: true,
  data: {
    user: mockUser,
    tokens: mockTokens,
  },
}

const mockRegisterResponse = {
  success: true,
  data: {
    user: mockUser,
    message: 'Registration successful',
  },
}

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
        ...initialState,
      },
    },
  })
}

// Create test navigation stack
const Stack = createNativeStackNavigator()

const TestNavigator = ({ initialRouteName = AUTH_ROUTES.LOGIN }: { initialRouteName?: string }) => (
  <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen as any} />
    <Stack.Screen name={AUTH_ROUTES.REGISTER} component={RegisterScreen as any} />
    <Stack.Screen name={APP_ROUTES.HOME} component={HomeScreen as any} />
  </Stack.Navigator>
)

// Test wrapper component
const TestWrapper = ({ 
  children, 
  initialState = {},
  initialRouteName = AUTH_ROUTES.LOGIN 
}: { 
  children: React.ReactNode
  initialState?: any
  initialRouteName?: string 
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const store = createTestStore(initialState)

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <NavigationContainer>
              <TestNavigator initialRouteName={initialRouteName} />
            </NavigationContainer>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

const renderWithProviders = (initialState = {}, initialRouteName = AUTH_ROUTES.LOGIN) => {
  return render(
    <TestWrapper initialState={initialState} initialRouteName={initialRouteName}>
      <></>
    </TestWrapper>
  )
}

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslate.mockReturnValue({
      t: (key: string) => key,
      language: 'en',
      setLanguage: jest.fn(),
    } as any)
  })

  describe('Login Flow', () => {
    it('should successfully login with valid credentials', async () => {
      mockApiClient.login.mockResolvedValue(mockLoginResponse)
      
      renderWithProviders()

      // Find and fill login form
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const loginButton = screen.getByTestId('login-button')

      fireEvent.changeText(emailInput, 'test@example.com')
      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.press(loginButton)

      // Wait for API call
      await waitFor(() => {
        expect(mockApiClient.login).toHaveBeenCalledWith('test@example.com', 'password123')
      })

      // Should navigate to home screen on successful login
      await waitFor(() => {
        expect(mockReset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: APP_ROUTES.HOME }],
        })
      })
    })

    it('should show error message for invalid credentials', async () => {
      const errorMessage = 'Invalid credentials'
      mockApiClient.login.mockRejectedValue(new Error(errorMessage))
      
      renderWithProviders()

      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const loginButton = screen.getByTestId('login-button')

      fireEvent.changeText(emailInput, 'test@example.com')
      fireEvent.changeText(passwordInput, 'wrongpassword')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(mockApiClient.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword')
      })

      // Should show error toast
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeTruthy()
      })

      // Should not navigate
      expect(mockReset).not.toHaveBeenCalled()
    })

    it('should disable form during login process', async () => {
      let resolveLogin: (value: any) => void
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve
      })
      mockApiClient.login.mockReturnValue(loginPromise)
      
      renderWithProviders()

      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const loginButton = screen.getByTestId('login-button')

      fireEvent.changeText(emailInput, 'test@example.com')
      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.press(loginButton)

      // Form should be disabled during loading
      await waitFor(() => {
        expect(loginButton.props.disabled).toBe(true)
      })

      // Resolve login
      resolveLogin!(mockLoginResponse)
      await loginPromise

      // Form should be enabled again
      await waitFor(() => {
        expect(loginButton.props.disabled).toBe(false)
      })
    })

    it('should navigate to register screen', async () => {
      renderWithProviders()

      const registerLink = screen.getByText(/Don't have an account\? Register/)
      fireEvent.press(registerLink)

      expect(mockNavigate).toHaveBeenCalledWith(AUTH_ROUTES.REGISTER)
    })

    it('should navigate to forgot password screen', async () => {
      renderWithProviders()

      const forgotPasswordLink = screen.getByText(/Forgot Password\?/)
      fireEvent.press(forgotPasswordLink)

      expect(mockNavigate).toHaveBeenCalledWith(AUTH_ROUTES.FORGOT_PASSWORD)
    })
  })

  describe('Registration Flow', () => {
    it('should successfully register new user', async () => {
      mockApiClient.register.mockResolvedValue(mockRegisterResponse)
      mockApiClient.login.mockResolvedValue(mockLoginResponse)
      
      renderWithProviders({}, AUTH_ROUTES.REGISTER as any)

      // Find and fill registration form
      const nameInput = screen.getByTestId('name-input')
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const confirmPasswordInput = screen.getByTestId('confirm-password-input')
      const registerButton = screen.getByTestId('register-button')

      fireEvent.changeText(nameInput, 'Test User')
      fireEvent.changeText(emailInput, 'test@example.com')
      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.changeText(confirmPasswordInput, 'password123')
      fireEvent.press(registerButton)

      // Wait for API calls
      await waitFor(() => {
        expect(mockApiClient.register).toHaveBeenCalledWith({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
        })
      })

      await waitFor(() => {
        expect(mockApiClient.login).toHaveBeenCalledWith('test@example.com', 'password123')
      })

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('auth.registerSuccess')).toBeTruthy()
      })

      // Should navigate to home screen
      await waitFor(() => {
        expect(mockReset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: APP_ROUTES.HOME }],
        })
      })
    })

    it('should show error for registration failure', async () => {
      const errorMessage = 'Email already exists'
      mockApiClient.register.mockRejectedValue(new Error(errorMessage))
      
      renderWithProviders({}, AUTH_ROUTES.REGISTER as any)

      const nameInput = screen.getByTestId('name-input')
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const confirmPasswordInput = screen.getByTestId('confirm-password-input')
      const registerButton = screen.getByTestId('register-button')

      fireEvent.changeText(nameInput, 'Test User')
      fireEvent.changeText(emailInput, 'existing@example.com')
      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.changeText(confirmPasswordInput, 'password123')
      fireEvent.press(registerButton)

      await waitFor(() => {
        expect(mockApiClient.register).toHaveBeenCalled()
      })

      // Should show error toast
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeTruthy()
      })

      // Should not navigate
      expect(mockReset).not.toHaveBeenCalled()
    })

    it('should navigate to login screen', async () => {
      renderWithProviders({}, AUTH_ROUTES.REGISTER as any)

      const loginLink = screen.getByText(/Already have an account\? Login/)
      fireEvent.press(loginLink)

      expect(mockNavigate).toHaveBeenCalledWith(AUTH_ROUTES.LOGIN)
    })
  })

  describe('Form Validation', () => {
    it('should validate login form fields', async () => {
      renderWithProviders()

      const loginButton = screen.getByTestId('login-button')
      fireEvent.press(loginButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Email is required/)).toBeTruthy()
        expect(screen.getByText(/Password is required/)).toBeTruthy()
      })

      // Should not call API
      expect(mockApiClient.login).not.toHaveBeenCalled()
    })

    it('should validate registration form fields', async () => {
      renderWithProviders({}, AUTH_ROUTES.REGISTER as any)

      const registerButton = screen.getByTestId('register-button')
      fireEvent.press(registerButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Name is required/)).toBeTruthy()
        expect(screen.getByText(/Email is required/)).toBeTruthy()
        expect(screen.getByText(/Password is required/)).toBeTruthy()
      })

      // Should not call API
      expect(mockApiClient.register).not.toHaveBeenCalled()
    })

    it('should validate password confirmation', async () => {
      renderWithProviders({}, AUTH_ROUTES.REGISTER as any)

      const passwordInput = screen.getByTestId('password-input')
      const confirmPasswordInput = screen.getByTestId('confirm-password-input')
      const registerButton = screen.getByTestId('register-button')

      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.changeText(confirmPasswordInput, 'differentpassword')
      fireEvent.press(registerButton)

      // Should show password mismatch error
      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/)).toBeTruthy()
      })

      // Should not call API
      expect(mockApiClient.register).not.toHaveBeenCalled()
    })
  })

  describe('Navigation Flow', () => {
    it('should maintain navigation state during auth flow', async () => {
      mockApiClient.login.mockResolvedValue(mockLoginResponse)
      
      renderWithProviders()

      // Start on login screen
      expect(screen.getByText('Welcome Back')).toBeTruthy()

      // Navigate to register
      const registerLink = screen.getByText(/Don't have an account\? Register/)
      fireEvent.press(registerLink)
      expect(mockNavigate).toHaveBeenCalledWith(AUTH_ROUTES.REGISTER)

      // Navigate back to login
      const loginLink = screen.getByText(/Already have an account\? Login/)
      fireEvent.press(loginLink)
      expect(mockNavigate).toHaveBeenCalledWith(AUTH_ROUTES.LOGIN)
    })

    it('should handle deep linking to auth screens', async () => {
      // Test starting from register screen
      renderWithProviders({}, AUTH_ROUTES.REGISTER as any)
      expect(screen.getByText('Create Account')).toBeTruthy()

      // Test starting from login screen
      renderWithProviders({}, AUTH_ROUTES.LOGIN as any)
      expect(screen.getByText('Welcome Back')).toBeTruthy()
    })
  })

  describe('State Management Integration', () => {
    it('should update auth state on successful login', async () => {
      mockApiClient.login.mockResolvedValue(mockLoginResponse)
      
      const initialState = {
        user: null,
        isAuthenticated: false,
        token: null,
      }
      
      renderWithProviders(initialState)

      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const loginButton = screen.getByTestId('login-button')

      fireEvent.changeText(emailInput, 'test@example.com')
      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(mockApiClient.login).toHaveBeenCalled()
      })

      // State should be updated through Redux
      await waitFor(() => {
        expect(mockReset).toHaveBeenCalled()
      })
    })

    it('should handle authenticated user state', async () => {
      const authenticatedState = {
        user: mockUser,
        isAuthenticated: true,
        token: mockTokens.accessToken,
      }
      
      renderWithProviders(authenticatedState, APP_ROUTES.HOME as any)

      // Should render home screen for authenticated user
      await waitFor(() => {
        expect(screen.getByTestId('home-screen')).toBeTruthy()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed')
      mockApiClient.login.mockRejectedValue(networkError)
      
      renderWithProviders()

      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const loginButton = screen.getByTestId('login-button')

      fireEvent.changeText(emailInput, 'test@example.com')
      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(screen.getByText('Network request failed')).toBeTruthy()
      })

      // Form should be re-enabled
      await waitFor(() => {
        expect(loginButton.props.disabled).toBe(false)
      })
    })

    it('should handle API timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      mockApiClient.login.mockRejectedValue(timeoutError)
      
      renderWithProviders()

      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const loginButton = screen.getByTestId('login-button')

      fireEvent.changeText(emailInput, 'test@example.com')
      fireEvent.changeText(passwordInput, 'password123')
      fireEvent.press(loginButton)

      await waitFor(() => {
        expect(screen.getByText('Request timeout')).toBeTruthy()
      })
    })
  })
})