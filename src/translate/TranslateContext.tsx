import { getFromStorage, saveToStorage } from '@/shared/utils'
import { getLocales } from 'expo-localization'
import React, { createContext, useContext, useEffect, useState } from 'react'
import enTranslations from './en.json'
import idTranslations from './id.json'
import { Language, TranslateContextType, TranslationKey, TranslationKeys } from './types'

const LANGUAGE_STORAGE_KEY = '@app_language'

const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  id: idTranslations,
}

const TranslateContext = createContext<TranslateContextType | undefined>(undefined)

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}

function getDeviceLanguage(): Language {
  const locales = getLocales()
  const deviceLanguage = locales[0]?.languageCode
  
  if (deviceLanguage === 'id' || deviceLanguage === 'en') {
    return deviceLanguage
  }
  
  return 'en'
}

export function TranslateProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLanguage()
  }, [])

  const loadLanguage = async () => {
    try {
      const savedLanguage = await getFromStorage<Language | null>(LANGUAGE_STORAGE_KEY, null)
      if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage)
      } else {
        const deviceLanguage = getDeviceLanguage()
        setLanguageState(deviceLanguage)
        await saveToStorage(LANGUAGE_STORAGE_KEY, deviceLanguage)
      }
    } catch (error) {
      console.error('Error loading language:', error)
      setLanguageState('en')
    } finally {
      setIsLoading(false)
    }
  }

  const setLanguage = async (newLanguage: Language) => {
    try {
      await saveToStorage(LANGUAGE_STORAGE_KEY, newLanguage)
      setLanguageState(newLanguage)
    } catch (error) {
      console.error('Error saving language:', error)
    }
  }

  const t = (key: TranslationKey): string => {
    const translation = getNestedValue(translations[language], key)
    return translation
  }

  if (isLoading) {
    return null
  }

  const value: TranslateContextType = {
    language,
    setLanguage,
    t,
  }

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  )
}

export function useTranslate(): TranslateContextType {
  const context = useContext(TranslateContext)
  if (context === undefined) {
    throw new Error('useTranslate must be used within a TranslateProvider')
  }
  return context
}