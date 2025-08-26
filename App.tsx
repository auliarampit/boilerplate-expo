import React from 'react'
import { AppRegistry } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { RootNavigator } from './src/navigations/RootNavigator'

function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

AppRegistry.registerComponent('main', () => App)

export default App