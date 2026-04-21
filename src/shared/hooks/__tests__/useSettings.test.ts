import { act, renderHook } from '@testing-library/react-native'
import { useSettings } from '../useSettings'

jest.mock('@/shared/components/ThemeProvider')
jest.mock('@/shared/components/ToastProvider')
jest.mock('@/translate')

const mockSetThemeMode = jest.fn()
const mockSetLanguage = jest.fn()
const mockShowToast = jest.fn()
const mockT = jest.fn((key: string) => `translated_${key}`)

const { useTheme } = require('@/shared/components/ThemeProvider')
const { useToast } = require('@/shared/components/ToastProvider')
const { useTranslate } = require('@/translate')

describe('useSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockT.mockImplementation((key: string) => `translated_${key}`)
    useTheme.mockReturnValue({ themeMode: 'light', setThemeMode: mockSetThemeMode })
    useToast.mockReturnValue({ showToast: mockShowToast })
    useTranslate.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage, t: mockT })
  })

  describe('initial state', () => {
    it('should return themeMode and language from context', () => {
      const { result } = renderHook(() => useSettings())

      expect(result.current.themeMode).toBe('light')
      expect(result.current.language).toBe('en')
      expect(typeof result.current.updateTheme).toBe('function')
      expect(typeof result.current.updateLanguage).toBe('function')
    })
  })

  describe('updateTheme', () => {
    it('should call setThemeMode and show success toast', () => {
      const { result } = renderHook(() => useSettings())

      act(() => { result.current.updateTheme('dark') })

      expect(mockSetThemeMode).toHaveBeenCalledWith('dark')
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'translated_settings.themeUpdateSuccess',
        type: 'success',
      })
    })

    it('should work for all theme modes', () => {
      const { result } = renderHook(() => useSettings())
      const themes = ['light', 'dark', 'system'] as const

      themes.forEach((theme) => {
        act(() => { result.current.updateTheme(theme) })
        expect(mockSetThemeMode).toHaveBeenCalledWith(theme)
      })
    })
  })

  describe('updateLanguage', () => {
    it('should call setLanguage and show success toast', async () => {
      mockSetLanguage.mockResolvedValue(undefined)
      const { result } = renderHook(() => useSettings())

      await act(async () => { await result.current.updateLanguage('id') })

      expect(mockSetLanguage).toHaveBeenCalledWith('id')
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'translated_settings.languageUpdateSuccess',
        type: 'success',
      })
    })
  })

  describe('memoization', () => {
    it('should memoize functions across re-renders', () => {
      const { result, rerender } = renderHook(() => useSettings())

      const firstUpdateTheme = result.current.updateTheme
      const firstUpdateLanguage = result.current.updateLanguage

      rerender({})

      expect(result.current.updateTheme).toBe(firstUpdateTheme)
      expect(result.current.updateLanguage).toBe(firstUpdateLanguage)
    })
  })
})
