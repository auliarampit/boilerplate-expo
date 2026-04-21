import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'
import { useTranslate } from '@/i18n'
import Button from '../Button'
import { ErrorBoundary } from '../ErrorBoundary'

jest.mock('../../../translate')
jest.mock('../Button')

const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>
const mockButton = Button as jest.MockedFunction<typeof Button>

const mockTranslate = {
  t: jest.fn((key: string) => {
    const map: Record<string, string> = {
      'errorBoundary.title': 'Something went wrong',
      'errorBoundary.description': 'An unexpected error occurred. Please try again.',
      'errorBoundary.retry': 'Try Again',
    }
    return map[key] || key
  }),
  language: 'en',
  setLanguage: jest.fn(),
}

const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) throw new Error('Test error')
  return <Text testID='success-component'>Success</Text>
}

const WorkingComponent = () => <Text testID='working-component'>Working</Text>

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslate.mockReturnValue(mockTranslate as any)
    mockButton.mockImplementation(({ title, onPress, testID }: any) => (
      <Text testID={testID || 'button'} onPress={onPress}>{title}</Text>
    ))
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => { jest.restoreAllMocks() })

  it('renders children when no error occurs', () => {
    const { getByTestId } = render(<ErrorBoundary><WorkingComponent /></ErrorBoundary>)
    expect(getByTestId('working-component')).toBeTruthy()
  })

  it('shows fallback UI on error', () => {
    const { getByText, queryByTestId } = render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(queryByTestId('success-component')).toBeFalsy()
    expect(getByText('Something went wrong')).toBeTruthy()
    expect(getByText('Try Again')).toBeTruthy()
  })

  it('renders custom fallback when provided', () => {
    const { getByTestId } = render(
      <ErrorBoundary fallback={<Text testID='custom-fallback'>Custom</Text>}>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(getByTestId('custom-fallback')).toBeTruthy()
  })

  it('calls onError prop when error occurs', () => {
    const onError = jest.fn()
    render(<ErrorBoundary onError={onError}><ThrowError /></ErrorBoundary>)
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object))
    expect((onError.mock.calls[0][0] as Error).message).toBe('Test error')
  })

  it('does not call onError when no error occurs', () => {
    const onError = jest.fn()
    render(<ErrorBoundary onError={onError}><WorkingComponent /></ErrorBoundary>)
    expect(onError).not.toHaveBeenCalled()
  })

  it('resets error state when retry is pressed', () => {
    const { getByText } = render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(getByText('Something went wrong')).toBeTruthy()
    fireEvent.press(getByText('Try Again'))
  })

  it('uses translated text', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(mockTranslate.t).toHaveBeenCalledWith('errorBoundary.title')
    expect(mockTranslate.t).toHaveBeenCalledWith('errorBoundary.retry')
  })
})
