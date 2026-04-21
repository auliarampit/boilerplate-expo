import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import './global.css'
import { RootNavigator } from './src/navigation/RootNavigator'
import { ErrorBoundary, NetworkProvider, ThemeProvider } from './src/components'
import { QueryProvider } from './src/components/QueryProvider'
import { store } from './src/store'
import './src/i18n/i18n'
import { captureException, initSentry } from './src/plugins/sentry'
import {
  NotificationProvider,
  NotificationPermissionModal,
  useNotificationPermission,
} from './src/plugins/push-notifications'

initSentry()

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
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded || isPermissionLoading) return null

  return (
    <Provider store={store}>
      <QueryProvider>
        <ErrorBoundary onError={(error, info) => captureException(error, { react: info as Record<string, unknown> })}>
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
