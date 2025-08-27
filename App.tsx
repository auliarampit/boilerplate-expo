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
import { RootNavigator } from './src/navigations/RootNavigator'
import { TranslateProvider } from './src/translate'
import './global.css'

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
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <TranslateProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </TranslateProvider>
  )
}

AppRegistry.registerComponent('main', () => App)

export default App
