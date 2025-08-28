import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import SettingsManager, {
  ThemeType,
  LanguageType,
} from '@/shared/utils/settingsManager'
import { showNotification } from '@/shared/store/slices/appSlice'
import { useTranslate } from '@/translate'

export const useSettings = () => {
  const dispatch = useAppDispatch()
  const { theme, language } = useAppSelector((state) => state.app)
  const { t } = useTranslate()

  const updateTheme = useCallback(
    async (newTheme: ThemeType) => {
      try {
        await SettingsManager.updateTheme(newTheme)
        dispatch(
          showNotification({
            message: t('settings.themeUpdateSuccess'),
            type: 'success',
          })
        )
      } catch (error) {
        dispatch(
          showNotification({
            message: t('settings.themeUpdateFailed'),
            type: 'error',
          })
        )
      }
    },
    [dispatch]
  )

  const updateLanguage = useCallback(
    async (newLanguage: LanguageType) => {
      try {
        await SettingsManager.updateLanguage(newLanguage)
        dispatch(
          showNotification({
            message: t('settings.languageUpdateSuccess'),
            type: 'success',
          })
        )
      } catch (error) {
        dispatch(
          showNotification({
            message: t('settings.languageUpdateFailed'),
            type: 'error',
          })
        )
      }
    },
    [dispatch]
  )

  const loadSettings = useCallback(async () => {
    try {
      await SettingsManager.loadSettings()
    } catch (error) {
      dispatch(
        showNotification({
          message: t('settings.loadSettingsFailed'),
          type: 'error',
        })
      )
    }
  }, [dispatch])

  const clearSettings = useCallback(async () => {
    try {
      await SettingsManager.clearSettings()
      dispatch(
        showNotification({
          message: t('settings.clearSettingsSuccess'),
          type: 'success',
        })
      )
    } catch (error) {
      dispatch(
        showNotification({
          message: t('settings.clearSettingsFailed'),
          type: 'error',
        })
      )
    }
  }, [dispatch])

  return {
    theme,
    language,
    updateTheme,
    updateLanguage,
    loadSettings,
    clearSettings,
  }
}
