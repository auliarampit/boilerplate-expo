import { AppRegistry } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import * as Sentry from '@sentry/react-native'
import { RootNavigator } from './src/navigations/RootNavigator'
import { TranslateProvider } from './src/translate'
import { ErrorBoundary, NetworkProvider, NotificationProvider, NotificationPermissionModal, ThemeProvider } from './src/shared/components'
import { useNotificationPermission } from './src/shared/hooks'
import './global.css'

// Initialize Sentry
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: __DEV__,
  environment: __DEV__ ? 'development' : 'production',
})

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
    <ErrorBoundary>
      <ThemeProvider>
        <NetworkProvider>
          <NotificationProvider>
            <TranslateProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
              <NotificationPermissionModal
                visible={shouldShowModal}
                onPermissionGranted={handlePermissionGranted}
                onPermissionDenied={handlePermissionDenied}
              />
            </TranslateProvider>
          </NotificationProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

AppRegistry.registerComponent('main', () => App)

export default App
