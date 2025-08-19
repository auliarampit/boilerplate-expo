import React from 'react';
import { RootNavigator } from './RootNavigator';

export function Navigation() {
  return <RootNavigator />;
}

export { RootNavigator, AuthProvider, useAuth } from './RootNavigator';
export { AuthNavigator } from '../features/auth';
export { AppNavigator } from './AppNavigator';
export * from '../shared/types/navigation';
export * from '../shared/constants/navigation';

export default Navigation;