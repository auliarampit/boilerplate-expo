import { useCallback } from 'react'
import { useTheme } from '@/shared/components/ThemeProvider'
import { useToast } from '@/shared/components/ToastProvider'
import { useTranslate } from '@/translate'

type ThemeMode = 'light' | 'dark' | 'system'
type Language = 'en' | 'id'

export const useSettings = () => {
  const { themeMode, setThemeMode } = useTheme()
  const { language, setLanguage: setLang, t } = useTranslate()
  const { showToast } = useToast()

  const updateTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeMode(newTheme)
      showToast({ message: t('settings.themeUpdateSuccess'), type: 'success' })
    },
    [setThemeMode, showToast, t]
  )

  const updateLanguage = useCallback(
    async (newLanguage: Language) => {
      await setLang(newLanguage)
      showToast({ message: t('settings.languageUpdateSuccess'), type: 'success' })
    },
    [setLang, showToast, t]
  )

  return {
    themeMode,
    language,
    updateTheme,
    updateLanguage,
  }
}
