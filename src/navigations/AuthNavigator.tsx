import { ForgotPasswordScreen, LoginScreen, RegisterScreen } from '@/features'
import { AUTH_ROUTES, NAVIGATION_OPTIONS } from '@/shared'
import { AuthStackParamList } from '@/shared/types/navigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslate } from '@/translate'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  const { t } = useTranslate()

  return (
    <Stack.Navigator
      initialRouteName={AUTH_ROUTES.LOGIN}
      screenOptions={{
        headerShown: NAVIGATION_OPTIONS.HEADER_SHOWN,
      }}>
      <Stack.Screen
        name={AUTH_ROUTES.LOGIN}
        component={LoginScreen}
        options={{ title: t('auth.login') }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.REGISTER}
        component={RegisterScreen}
        options={{ title: t('auth.register') }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{ title: t('auth.forgotPassword') }}
      />
    </Stack.Navigator>
  )
}
