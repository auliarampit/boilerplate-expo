import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AppStackScreenProps } from '@/shared/types/navigation'
import { APP_ROUTES } from '@/shared/constants/navigation'
import { useTranslate } from '@/translate'
import { useTheme, getThemeClass } from '@/shared'

export function HomeScreen({ navigation }: AppStackScreenProps<'Home'>) {
  const { t } = useTranslate()
  const { isDark } = useTheme()

  const navigateToProfile = () => {
    navigation.navigate(APP_ROUTES.PROFILE)
  }

  const navigateToSettings = () => {
    navigation.navigate(APP_ROUTES.SETTINGS)
  }

  return (
    <View
      className={`flex-1 justify-center items-center p-5 ${getThemeClass(isDark, 'background.primary')}`}>
      <Text
        className={`text-2xl font-bold mb-3 text-center font-inter-bold ${getThemeClass(isDark, 'text.primary')}`}>
        {t('home.title')}
      </Text>
      <Text
        className={`text-base mb-8 text-center font-inter ${getThemeClass(isDark, 'text.secondary')}`}>
        {t('home.welcome')}
      </Text>

      <TouchableOpacity
        className='bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700'
        onPress={navigateToProfile}>
        <Text className='text-white text-base font-semibold font-inter-semibold'>
          {t('navigation.profile')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className='bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700'
        onPress={navigateToSettings}>
        <Text className='text-white text-base font-semibold font-inter-semibold'>
          {t('navigation.settings')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
