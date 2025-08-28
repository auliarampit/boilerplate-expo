import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AppStackScreenProps } from '@/shared/types/navigation'
import { APP_ROUTES } from '@/shared/constants/navigation'
import { useTheme, SocialLoginButtons } from '@/shared/components'
import { getThemeClass } from '@/shared'

export const ProfileScreen = ({
  navigation,
}: AppStackScreenProps<'Profile'>) => {
  const { isDark } = useTheme()

  const navigateToHome = () => {
    navigation.navigate(APP_ROUTES.HOME)
  }

  const navigateToSettings = () => {
    navigation.navigate(APP_ROUTES.SETTINGS)
  }

  return (
    <View
      className={`flex-1 justify-center items-center p-5 ${getThemeClass(isDark, 'background.primary')}`}>
      <Text
        className={`text-2xl font-bold mb-3 text-center font-inter-bold ${getThemeClass(isDark, 'text.primary')}`}>
        Profile
      </Text>
      <Text
        className={`text-base mb-8 text-center font-inter ${getThemeClass(isDark, 'text.secondary')}`}>
        User profile information
      </Text>

      <TouchableOpacity
        className='bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700'
        onPress={navigateToHome}>
        <Text className='text-white text-base font-semibold font-inter-semibold'>
          Back to Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className='bg-blue-600 px-8 py-3 rounded-lg mb-4 min-w-[200px] items-center active:bg-blue-700'
        onPress={navigateToSettings}>
        <Text className='text-white text-base font-semibold font-inter-semibold'>
          Go to Settings
        </Text>
      </TouchableOpacity>

      <View className='mt-8 w-full max-w-sm'>
        <SocialLoginButtons />
      </View>
    </View>
  )
}
