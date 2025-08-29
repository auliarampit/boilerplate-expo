import { getFromStorage } from '@/shared/utils'
import enTranslations from './en.json'
import idTranslations from './id.json'
import { Language, TranslationKey, TranslationKeys } from './types'

const LANGUAGE_STORAGE_KEY = '@app_language'

const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  id: idTranslations,
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}

/**
 * Get translation outside of React components
 * This function reads the current language from storage and returns the translation
 */
export async function getTranslation(key: TranslationKey): Promise<string> {
  try {
    const savedLanguage = await getFromStorage<Language | null>(
      LANGUAGE_STORAGE_KEY,
      null
    )
    const language: Language = savedLanguage || 'en'
    return getNestedValue(translations[language], key)
  } catch (error) {
    console.error('Error getting translation:', error)
    return getNestedValue(translations['en'], key)
  }
}

/**
 * Synchronous translation function that uses a default language
 * Use this when you can't use async/await
 */
export function getTranslationSync(key: TranslationKey, language: Language = 'en'): string {
  return getNestedValue(translations[language], key)
}