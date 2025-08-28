import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AppStackParamList } from '@/shared/types/navigation'
import { APP_ROUTES, NAVIGATION_OPTIONS } from '@/shared/constants/navigation'
import { HomeScreen } from '@/features/home'
import { ProfileScreen } from '@/features/profile'
import { SettingsScreen } from '@/features/settings'
import { useTranslate } from '@/translate'

const Stack = createNativeStackNavigator<AppStackParamList>()

export function AppNavigator() {
  const { t } = useTranslate()

  return (
    <Stack.Navigator
      initialRouteName={APP_ROUTES.HOME}
      screenOptions={{
        headerShown: NAVIGATION_OPTIONS.HEADER_SHOWN,
      }}>
      <Stack.Screen
        name={APP_ROUTES.HOME}
        component={HomeScreen}
        options={{ title: t('navigation.home') }}
      />
      <Stack.Screen
        name={APP_ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ title: t('navigation.profile') }}
      />
      <Stack.Screen
        name={APP_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{ title: t('navigation.settings') }}
      />
    </Stack.Navigator>
  )
}
