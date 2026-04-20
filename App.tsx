import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { NavigationContainer } from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import './global.css'
import { RootNavigator } from './src/navigations/RootNavigator'
import {
  ErrorBoundary,
  NetworkProvider,
  NotificationPermissionModal,
  NotificationProvider,
  ThemeProvider,
} from './src/shared/components'
import { useNotificationPermission } from './src/shared/hooks'
import { QueryProvider } from './src/shared/providers/QueryProvider'
import { store } from './src/shared/store'
import './src/translate/i18n'
// Environment variables are now accessed directly via process.env
// No complex validation needed - missing vars will be undefined

// Initialize Sentry
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN
if (sentryDsn && sentryDsn !== 'your_sentry_dsn_here') {
  Sentry.init({
    dsn: sentryDsn,
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
  })
} else if (__DEV__) {
  console.log('Sentry DSN not configured - error tracking disabled')
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  const {
    shouldShowModal,
    isLoading: isPermissionLoading,
    handlePermissionGranted,
    handlePermissionDenied,
  } = useNotificationPermission()

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded || isPermissionLoading) {
    return null
  }

  return (
    <Provider store={store}>
      <QueryProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <NetworkProvider>
              <NotificationProvider>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
                <NotificationPermissionModal
                  visible={shouldShowModal}
                  onPermissionGranted={handlePermissionGranted}
                  onPermissionDenied={handlePermissionDenied}
                />
              </NotificationProvider>
            </NetworkProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryProvider>
    </Provider>
  )
}

AppRegistry.registerComponent('main', () => App)

export default App
