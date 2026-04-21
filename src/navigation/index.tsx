import React from 'react'
import { RootNavigator } from './RootNavigator'

export function Navigation() {
  return <RootNavigator />
}

export * from '@/utils/navigation'
export * from '@/types/navigation'
export { AppNavigator } from './AppNavigator'
export { AuthNavigator } from './AuthNavigator'
export { RootNavigator } from './RootNavigator'

export default Navigation
