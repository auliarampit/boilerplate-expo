import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import id from './id.json'

const LANGUAGE_KEY = '@app_language'

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async (callback: (lang: string) => void) => {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY)
    if (stored === 'en' || stored === 'id') {
      callback(stored)
      return
    }
    const deviceLang = getLocales()[0]?.languageCode
    callback(deviceLang === 'id' ? 'id' : 'en')
  },
  cacheUserLanguage: async (lang: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang)
  },
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'id'],
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
