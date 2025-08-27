import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AppStackScreenProps } from '@/shared/types/navigation'
import { APP_ROUTES } from '@/shared/constants/navigation'
import { useColorScheme, useTranslate } from '@/shared'

export function SettingsScreen({
  navigation,
}: AppStackScreenProps<'Settings'>) {
  const colorScheme = useColorScheme()
  const { t, language, setLanguage } = useTranslate()
  const isDark = colorScheme === 'dark'

  const navigateToHome = () => {
    navigation.navigate(APP_ROUTES.HOME)
  }

  const navigateToProfile = () => {
    navigation.navigate(APP_ROUTES.PROFILE)
  }

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout pressed')
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'id' ? 'en' : 'id'
    setLanguage(newLanguage)
  }

  return (
    <View
      className={`flex-1 justify-center items-center p-5 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <Text
        className={`text-2xl font-bold mb-3 text-center font-inter-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        {t('settings.title')}
      </Text>
      <Text
        className={`text-base mb-8 text-center font-inter ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
      >
        App settings and preferences
      </Text>

      <TouchableOpacity
        className="bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700"
        onPress={toggleLanguage}
      >
        <Text className="text-white text-base font-semibold font-inter-semibold">
          {t('settings.language')}:{' '}
          {language === 'id' ? 'Indonesia' : 'English'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700"
        onPress={navigateToHome}
      >
        <Text className="text-white text-base font-semibold font-inter-semibold">
          {t('navigation.home')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700"
        onPress={navigateToProfile}
      >
        <Text className="text-white text-base font-semibold font-inter-semibold">
          {t('navigation.profile')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`px-8 py-3 rounded-lg mt-5 min-w-[200px] items-center border ${isDark ? 'border-white' : 'border-gray-900'} active:bg-gray-100 active:bg-opacity-10`}
        onPress={handleLogout}
      >
        <Text
          className={`text-base font-semibold font-inter-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {t('auth.logout')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
