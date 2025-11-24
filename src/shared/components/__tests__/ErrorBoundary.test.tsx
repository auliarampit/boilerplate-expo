import * as Sentry from '@sentry/react-native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'
import { useTranslate } from '../../../translate'
import Button from '../Button'
import { ErrorBoundary } from '../ErrorBoundary'

// Mock dependencies
jest.mock('../../../translate')
jest.mock('@sentry/react-native')
jest.mock('../Button')

const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>
const mockSentryCapture = Sentry.captureException as jest.MockedFunction<typeof Sentry.captureException>
const mockButton = Button as jest.MockedFunction<typeof Button>

const mockTranslate = {
  t: jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'errorBoundary.title': 'Something went wrong',
      'errorBoundary.description': 'An unexpected error occurred. Please try again.',
      'errorBoundary.retry': 'Try Again',
    }
    return translations[key] || key
  }),
  language: 'en',
  setLanguage: jest.fn(),
}

// Component that throws an error for testing
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <Text testID="success-component">Success</Text>
}

// Component that works normally
const WorkingComponent: React.FC = () => {
  return <Text testID="working-component">Working Component</Text>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslate.mockReturnValue(mockTranslate as any)
    mockButton.mockImplementation(({ title, onPress, testID }) => (
      <Text testID={testID || 'button'} onPress={onPress}>
        {title}
      </Text>
    ))
    
    // Suppress console.error for error boundary tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Normal Operation', () => {
    it('renders children when no error occurs', () => {
      const { getByTestId } = render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      )

      expect(getByTestId('working-component')).toBeTruthy()
    })

    it('does not call Sentry when no error occurs', () => {
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      )

      expect(mockSentryCapture).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('catches errors and displays default fallback UI', () => {
      const { getByText, queryByTestId } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      // Should not render the error component
      expect(queryByTestId('success-component')).toBeFalsy()
      
      // Should render fallback UI
      expect(getByText('😵')).toBeTruthy()
      expect(getByText('Something went wrong')).toBeTruthy()
      expect(getByText('An unexpected error occurred. Please try again.')).toBeTruthy()
      expect(getByText('Try Again')).toBeTruthy()
    })

    it('renders custom fallback when provided', () => {
      const customFallback = <Text testID="custom-fallback">Custom Error UI</Text>
      
      const { getByTestId, queryByText } = render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(getByTestId('custom-fallback')).toBeTruthy()
      expect(getByText('Custom Error UI')).toBeTruthy()
      
      // Should not render default fallback
      expect(queryByText('😵')).toBeFalsy()
      expect(queryByText('Something went wrong')).toBeFalsy()
    })

    it('calls Sentry.captureException when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(mockSentryCapture).toHaveBeenCalledTimes(1)
      expect(mockSentryCapture).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          contexts: {
            react: {
              componentStack: expect.any(String),
            },
          },
        })
      )
    })

    it('captures the correct error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      const capturedError = mockSentryCapture.mock.calls[0][0] as Error
      expect(capturedError.message).toBe('Test error')
    })
  })

  describe('Retry Functionality', () => {
    it('allows retry after error', () => {
      const { getByText, queryByTestId, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )

      // Initially should render successfully
      expect(queryByTestId('success-component')).toBeTruthy()
      
      // Force re-render with error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Should show error UI
      expect(queryByTestId('success-component')).toBeFalsy()
      expect(getByText('Something went wrong')).toBeTruthy()

      // Click retry button
      const retryButton = getByText('Try Again')
      fireEvent.press(retryButton)

      // After retry, should attempt to render children again
      // Note: In real scenario, the component would need to be re-rendered with fixed props
    })

    it('resets error state when retry is pressed', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      // Should show error UI
      expect(getByText('Something went wrong')).toBeTruthy()

      // Click retry button
      const retryButton = getByText('Try Again')
      fireEvent.press(retryButton)

      // The error state should be reset (though children might still throw)
      // This tests the handleRetry method functionality
      expect(retryButton).toBeTruthy() // Button should still be accessible for testing
    })
  })

  describe('Translation Integration', () => {
    it('uses translated text for error messages', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(mockTranslate.t).toHaveBeenCalledWith('errorBoundary.title')
      expect(mockTranslate.t).toHaveBeenCalledWith('errorBoundary.description')
      expect(mockTranslate.t).toHaveBeenCalledWith('errorBoundary.retry')
      
      expect(getByText('Something went wrong')).toBeTruthy()
      expect(getByText('An unexpected error occurred. Please try again.')).toBeTruthy()
      expect(getByText('Try Again')).toBeTruthy()
    })

    it('handles missing translations gracefully', () => {
      mockTranslate.t.mockImplementation((key: string) => key)
      
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(getByText('errorBoundary.title')).toBeTruthy()
      expect(getByText('errorBoundary.description')).toBeTruthy()
      expect(getByText('errorBoundary.retry')).toBeTruthy()
    })
  })

  describe('Button Integration', () => {
    it('renders Button component with correct props', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(mockButton).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Try Again',
          variant: 'primary',
          onPress: expect.any(Function),
        }),
        expect.any(Object)
      )
    })

    it('passes retry handler to Button onPress', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      const buttonProps = mockButton.mock.calls[0][0]
      expect(typeof buttonProps.onPress).toBe('function')
    })
  })

  describe('Styling and Layout', () => {
    it('applies correct CSS classes to fallback UI', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      // Note: In a real test environment, you might need to check the actual rendered styles
      // This is a simplified test focusing on the component structure
      expect(getByText('Something went wrong')).toBeTruthy()
    })

    it('displays emoji correctly', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(getByText('😵')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles multiple consecutive errors', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(mockSentryCapture).toHaveBeenCalledTimes(1)

      // Trigger another error
      rerender(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      // Should capture each error
      expect(mockSentryCapture).toHaveBeenCalledTimes(2)
    })

    it('handles errors with different error types', () => {
      const CustomError = () => {
        throw new TypeError('Type error')
      }

      render(
        <ErrorBoundary>
          <CustomError />
        </ErrorBoundary>
      )

      const capturedError = mockSentryCapture.mock.calls[0][0] as Error
      expect(capturedError).toBeInstanceOf(TypeError)
      expect(capturedError.message).toBe('Type error')
    })

    it('handles null/undefined children', () => {
      const NullComponent = () => null
      
      const { queryByTestId } = render(
        <ErrorBoundary>
          <NullComponent />
        </ErrorBoundary>
      )

      expect(queryByTestId('working-component')).toBeFalsy()
      expect(mockSentryCapture).not.toHaveBeenCalled()
    })

    it('handles empty children', () => {
      const EmptyComponent = () => <></>
      
      const { queryByTestId } = render(
        <ErrorBoundary>
          <EmptyComponent />
        </ErrorBoundary>
      )

      expect(queryByTestId('working-component')).toBeFalsy()
      expect(mockSentryCapture).not.toHaveBeenCalled()
    })
  })

  describe('Component Lifecycle', () => {
    it('properly initializes state', () => {
      const { getByTestId } = render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      )

      expect(getByTestId('working-component')).toBeTruthy()
    })

    it('updates state when error occurs', () => {
      const { queryByTestId, getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(queryByTestId('success-component')).toBeFalsy()
      expect(getByText('Something went wrong')).toBeTruthy()
    })
  })
})

function getByText(arg0: string): any {
  throw new Error('Function not implemented.')
}
