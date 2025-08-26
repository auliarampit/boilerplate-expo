import React from 'react'
import { RootNavigator } from './RootNavigator'

export function Navigation() {
  return <RootNavigator />
}

export * from '../shared/constants/navigation'
export * from '../shared/types/navigation'
export { AppNavigator } from './AppNavigator'
export { AuthNavigator } from './AuthNavigator'
export { AuthProvider, RootNavigator, useAuth } from './RootNavigator'

export default Navigation