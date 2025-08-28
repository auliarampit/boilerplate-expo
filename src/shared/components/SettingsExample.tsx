import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useSettings } from '@/shared/hooks/useSettings'
import { useTranslate } from '@/translate'

export const SettingsExample = () => {
  const { theme, language, updateTheme, updateLanguage } = useSettings()
  const { t } = useTranslate()

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    updateTheme(newTheme)
  }

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'id' : 'en'
    updateLanguage(newLanguage)
  }

  const getThemeButtonText = () => {
    return theme === 'light' ? t('settings.dark') : t('settings.light')
  }

  const getLanguageButtonText = () => {
    return language === 'en' ? 'Bahasa Indonesia' : 'English'
  }

  return (
    <View className='flex-1 justify-center items-center p-4 bg-white dark:bg-gray-900'>
      <Text className='text-2xl font-bold mb-8 text-gray-900 dark:text-white'>
        {t('settings.title')}
      </Text>
      
      <View className='w-full max-w-sm space-y-4'>
        <View className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg'>
          <Text className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
            {t('settings.theme')}: {theme}
          </Text>
          <TouchableOpacity
            onPress={handleThemeToggle}
            className='bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md'
          >
            <Text className='text-white font-medium text-center'>
              {getThemeButtonText()}
            </Text>
          </TouchableOpacity>
        </View>

        <View className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg'>
          <Text className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
            {t('settings.language')}: {language}
          </Text>
          <TouchableOpacity
            onPress={handleLanguageToggle}
            className='bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md'
          >
            <Text className='text-white font-medium text-center'>
              {getLanguageButtonText()}
            </Text>
          </TouchableOpacity>
        </View>

        <View className='mt-6'>
          <Text className='text-sm text-gray-600 dark:text-gray-400 text-center'>
            Settings are automatically saved and synced across the app
          </Text>
        </View>
      </View>
    </View>
  )
}