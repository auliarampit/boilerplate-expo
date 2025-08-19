import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../shared/types/navigation';
import { AUTH_ROUTES, NAVIGATION_OPTIONS } from '../../shared/constants/navigation';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from './screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={AUTH_ROUTES.LOGIN}
      screenOptions={{
        headerShown: NAVIGATION_OPTIONS.HEADER_SHOWN,
      }}
    >
      <Stack.Screen 
        name={AUTH_ROUTES.LOGIN} 
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name={AUTH_ROUTES.REGISTER} 
        component={RegisterScreen}
        options={{ title: 'Register' }}
      />
      <Stack.Screen 
        name={AUTH_ROUTES.FORGOT_PASSWORD} 
        component={ForgotPasswordScreen}
        options={{ title: 'Forgot Password' }}
      />
    </Stack.Navigator>
  );
}