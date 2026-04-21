import { useTranslation } from 'react-i18next'
import i18n from './i18n'

export type Language = 'en' | 'id'

export function useTranslate() {
  const { t, i18n: instance } = useTranslation()
  return {
    t,
    language: instance.language as Language,
    setLanguage: (lang: Language) => instance.changeLanguage(lang),
  }
}

export { i18n }
