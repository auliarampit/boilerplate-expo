import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook } from '@testing-library/react-native'
import React from 'react'
import { Provider } from 'react-redux'
import appSlice from '../../store/slices/appSlice'
import { useSettings } from '../useSettings'

jest.mock('@/shared/components/ThemeProvider')
jest.mock('@/translate')

const mockSetThemeMode = jest.fn()
const mockSetLanguage = jest.fn()
const mockT = jest.fn((key: string) => `translated_${key}`)

const { useTheme } = require('@/shared/components/ThemeProvider')
const { useTranslate } = require('@/translate')

useTheme.mockReturnValue({ themeMode: 'light', setThemeMode: mockSetThemeMode })
useTranslate.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage, t: mockT })

const createTestStore = () =>
  configureStore({
    reducer: { app: appSlice },
    preloadedState: { app: { isLoading: false, isOnline: true, notification: null } },
  })

const renderUseSettings = () => {
  const store = createTestStore()
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children })
  return { ...renderHook(() => useSettings(), { wrapper }), store }
}

describe('useSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockT.mockImplementation((key: string) => `translated_${key}`)
    useTheme.mockReturnValue({ themeMode: 'light', setThemeMode: mockSetThemeMode })
    useTranslate.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage, t: mockT })
  })

  describe('initial state', () => {
    it('should return themeMode and language from context', () => {
      const { result } = renderUseSettings()

      expect(result.current.themeMode).toBe('light')
      expect(result.current.language).toBe('en')
      expect(typeof result.current.updateTheme).toBe('function')
      expect(typeof result.current.updateLanguage).toBe('function')
    })

    it('should reflect dark theme from context', () => {
      useTheme.mockReturnValue({ themeMode: 'dark', setThemeMode: mockSetThemeMode })
      const { result } = renderUseSettings()
      expect(result.current.themeMode).toBe('dark')
    })
  })

  describe('updateTheme', () => {
    it('should call setThemeMode and dispatch success notification', () => {
      const { result, store } = renderUseSettings()

      act(() => { result.current.updateTheme('dark') })

      expect(mockSetThemeMode).toHaveBeenCalledWith('dark')
      expect(store.getState().app.notification).toEqual({
        visible: true,
        message: 'translated_settings.themeUpdateSuccess',
        type: 'success',
      })
    })

    it('should work for all theme modes', () => {
      const { result } = renderUseSettings()
      const themes = ['light', 'dark', 'system'] as const

      themes.forEach((theme) => {
        act(() => { result.current.updateTheme(theme) })
        expect(mockSetThemeMode).toHaveBeenCalledWith(theme)
      })
    })
  })

  describe('updateLanguage', () => {
    it('should call setLanguage and dispatch success notification', async () => {
      mockSetLanguage.mockResolvedValue(undefined)
      const { result, store } = renderUseSettings()

      await act(async () => { await result.current.updateLanguage('id') })

      expect(mockSetLanguage).toHaveBeenCalledWith('id')
      expect(store.getState().app.notification).toEqual({
        visible: true,
        message: 'translated_settings.languageUpdateSuccess',
        type: 'success',
      })
    })

    it('should work for all language codes', async () => {
      mockSetLanguage.mockResolvedValue(undefined)
      const { result } = renderUseSettings()
      const languages = ['en', 'id'] as const

      for (const lang of languages) {
        await act(async () => { await result.current.updateLanguage(lang) })
        expect(mockSetLanguage).toHaveBeenCalledWith(lang)
      }
    })
  })

  describe('memoization', () => {
    it('should memoize functions across re-renders', () => {
      const { result, rerender } = renderUseSettings()

      const firstUpdateTheme = result.current.updateTheme
      const firstUpdateLanguage = result.current.updateLanguage

      rerender(undefined)

      expect(result.current.updateTheme).toBe(firstUpdateTheme)
      expect(result.current.updateLanguage).toBe(firstUpdateLanguage)
    })
  })
})
