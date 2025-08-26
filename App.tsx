import React from 'react'
import { AppRegistry } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { RootNavigator } from './src/navigations/RootNavigator'
import { TranslateProvider } from './src/translate'

function App() {
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