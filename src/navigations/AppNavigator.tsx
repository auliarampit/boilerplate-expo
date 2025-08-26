import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AppStackParamList } from '@/shared/types/navigation'
import { APP_ROUTES, NAVIGATION_OPTIONS } from '@/shared/constants/navigation'
import { HomeScreen } from '@/features/home'
import { ProfileScreen } from '@/features/profile'
import { SettingsScreen } from '@/features/settings'

const Stack = createNativeStackNavigator<AppStackParamList>()

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={APP_ROUTES.HOME}
      screenOptions={{
        headerShown: NAVIGATION_OPTIONS.HEADER_SHOWN,
      }}
    >
      <Stack.Screen 
        name={APP_ROUTES.HOME} 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen 
        name={APP_ROUTES.PROFILE} 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name={APP_ROUTES.SETTINGS} 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  )
}