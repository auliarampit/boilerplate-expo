import { useCallback } from 'react'
import { useTheme } from '@/shared/components/ThemeProvider'
import { useAppDispatch } from '@/shared/store/hooks'
import { showNotification } from '@/shared/store/slices/appSlice'
import { useTranslate } from '@/translate'

type ThemeMode = 'light' | 'dark' | 'system'
type Language = 'en' | 'id'

export const useSettings = () => {
  const dispatch = useAppDispatch()
  const { themeMode, setThemeMode } = useTheme()
  const { language, setLanguage: setLang, t } = useTranslate()

  const updateTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeMode(newTheme)
      dispatch(showNotification({ message: t('settings.themeUpdateSuccess'), type: 'success' }))
    },
    [dispatch, setThemeMode, t]
  )

  const updateLanguage = useCallback(
    async (newLanguage: Language) => {
      await setLang(newLanguage)
      dispatch(showNotification({ message: t('settings.languageUpdateSuccess'), type: 'success' }))
    },
    [dispatch, setLang, t]
  )

  return {
    themeMode,
    language,
    updateTheme,
    updateLanguage,
  }
}
