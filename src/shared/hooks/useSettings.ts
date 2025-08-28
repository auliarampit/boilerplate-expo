import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import SettingsManager, { ThemeType, LanguageType } from '@/shared/utils/settingsManager'
import { showNotification } from '@/shared/store/slices/appSlice'

export const useSettings = () => {
  const dispatch = useAppDispatch()
  const { theme, language } = useAppSelector((state) => state.app)

  const updateTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      await SettingsManager.updateTheme(newTheme)
      dispatch(showNotification({
        message: 'Theme updated successfully',
        type: 'success'
      }))
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update theme',
        type: 'error'
      }))
    }
  }, [dispatch])

  const updateLanguage = useCallback(async (newLanguage: LanguageType) => {
    try {
      await SettingsManager.updateLanguage(newLanguage)
      dispatch(showNotification({
        message: 'Language updated successfully',
        type: 'success'
      }))
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update language',
        type: 'error'
      }))
    }
  }, [dispatch])

  const loadSettings = useCallback(async () => {
    try {
      await SettingsManager.loadSettings()
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to load settings',
        type: 'error'
      }))
    }
  }, [dispatch])

  const clearSettings = useCallback(async () => {
    try {
      await SettingsManager.clearSettings()
      dispatch(showNotification({
        message: 'Settings cleared successfully',
        type: 'success'
      }))
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to clear settings',
        type: 'error'
      }))
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