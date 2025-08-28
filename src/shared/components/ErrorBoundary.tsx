import React, { Component, ReactNode } from 'react'
import { View, Text } from 'react-native'
import * as Sentry from '@sentry/react-native'
import Button from './Button'
import { useTranslate } from '../../translate'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  onRetry: () => void
}

function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  const { t } = useTranslate()

  return (
    <View className='flex-1 justify-center items-center p-6 bg-white dark:bg-gray-900'>
      <View className='items-center space-y-4'>
        <Text className='text-6xl mb-4'>😵</Text>
        <Text className='text-xl font-semibold text-gray-900 dark:text-white text-center'>
          {t('errorBoundary.title')}
        </Text>
        <Text className='text-gray-600 dark:text-gray-400 text-center leading-6'>
          {t('errorBoundary.description')}
        </Text>
        <Button
          title={t('errorBoundary.retry')}
          onPress={onRetry}
          variant='primary'
        />
      </View>
    </View>
  )
}

export const ErrorBoundary = ErrorBoundaryClass
