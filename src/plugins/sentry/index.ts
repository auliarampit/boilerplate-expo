import * as Sentry from '@sentry/react-native'

export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN
  if (!dsn || dsn === 'your_sentry_dsn_here') return
  Sentry.init({
    dsn,
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
  })
}

export function captureException(error: Error, context?: Record<string, Record<string, unknown>>) {
  Sentry.captureException(error, { contexts: context })
}
