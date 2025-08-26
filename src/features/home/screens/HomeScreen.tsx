import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AppStackScreenProps } from '@/shared/types/navigation'
import { APP_ROUTES } from '@/shared/constants/navigation'
import { useColorScheme, useTranslate } from '@/shared'

export function HomeScreen({ navigation }: AppStackScreenProps<'Home'>) {
  const colorScheme = useColorScheme()
  const { t } = useTranslate()
  const isDark = colorScheme === 'dark'

  const navigateToProfile = () => {
    navigation.navigate(APP_ROUTES.PROFILE)
  }

  const navigateToSettings = () => {
    navigation.navigate(APP_ROUTES.SETTINGS)
  }

  return (
    <View className={`flex-1 justify-center items-center p-5 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Text className={`text-2xl font-bold mb-3 text-center font-inter-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {t('home.title')}
      </Text>
      <Text className={`text-base mb-8 text-center font-inter ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {t('home.welcome')}
      </Text>
      
      <TouchableOpacity 
        className="bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700"
        onPress={navigateToProfile}
      >
        <Text className="text-white text-base font-semibold font-inter-semibold">
          {t('navigation.profile')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700"
        onPress={navigateToSettings}
      >
        <Text className="text-white text-base font-semibold font-inter-semibold">
          {t('navigation.settings')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}