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
import { RootNavigator } from './src/navigations/RootNavigator'
import { ErrorBoundary, ThemeProvider } from './src/shared/components'
import { QueryProvider } from './src/shared/providers/QueryProvider'
import { store } from './src/shared/store'
import { TranslateProvider } from './src/translate'
// Environment variables are now accessed directly via process.env
// No complex validation needed - missing vars will be undefined

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  useEffect(() => {
    const initializeApp = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync()
      }
    }

    initializeApp()
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <Provider store={store}>
      <QueryProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <TranslateProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </TranslateProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryProvider>
    </Provider>
  )
}

AppRegistry.registerComponent('main', () => App)

export default App
