import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { useTranslate } from '../../../translate';
import appSlice from '../../store/slices/appSlice';
import SettingsManager, { LanguageType, ThemeType } from '../../utils/settingsManager';
import { useSettings } from '../useSettings';

// Mock dependencies
jest.mock('../../utils/settingsManager');
jest.mock('../../../translate');

const mockSettingsManager = SettingsManager as jest.Mocked<typeof SettingsManager>;
const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>;

const mockT = jest.fn();

// Helper function to create store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      app: appSlice,
    },
    preloadedState: {
      app: {
        theme: 'light' as ThemeType,
        language: 'en' as LanguageType,
        isLoading: false,
        isOnline: true,
        notification: null,
        ...initialState,
      },
    },
  });
};

// Helper function to render hook with provider
const renderUseSettings = (initialState = {}) => {
  const store = createTestStore(initialState);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(Provider, { store, children })
  );
  return {
    ...renderHook(() => useSettings(), { wrapper }),
    store,
  };
};

describe('useSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslate.mockReturnValue({ t: mockT, language: 'en', setLanguage: jest.fn() });
    mockT.mockImplementation((key: string) => `translated_${key}`);
  });

  describe('initial state', () => {
    it('should return initial settings state', () => {
      const { result } = renderUseSettings();

      expect(result.current.theme).toBe('light');
      expect(result.current.language).toBe('en');
      expect(typeof result.current.updateTheme).toBe('function');
      expect(typeof result.current.updateLanguage).toBe('function');
      expect(typeof result.current.loadSettings).toBe('function');
      expect(typeof result.current.clearSettings).toBe('function');
    });

    it('should return custom initial state', () => {
      const customState = {
        theme: 'dark' as ThemeType,
        language: 'id' as LanguageType,
      };
      const { result } = renderUseSettings(customState);

      expect(result.current.theme).toBe('dark');
      expect(result.current.language).toBe('id');
    });
  });

  describe('updateTheme', () => {
    it('should update theme successfully', async () => {
      mockSettingsManager.updateTheme.mockResolvedValue();
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.updateTheme('dark');
      });

      expect(mockSettingsManager.updateTheme).toHaveBeenCalledWith('dark');
      expect(mockT).toHaveBeenCalledWith('settings.themeUpdateSuccess');
      
      // Check if success notification was dispatched
      const state = store.getState();
      expect(state.app.notification).toEqual({
        visible: true,
        message: 'translated_settings.themeUpdateSuccess',
        type: 'success',
      });
    });

    it('should handle theme update failure', async () => {
      const error = new Error('Theme update failed');
      mockSettingsManager.updateTheme.mockRejectedValue(error);
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.updateTheme('dark');
      });

      expect(mockSettingsManager.updateTheme).toHaveBeenCalledWith('dark');
      expect(mockT).toHaveBeenCalledWith('settings.themeUpdateFailed');
      
      // Check if error notification was dispatched
      const state = store.getState();
      expect(state.app.notification).toEqual({
        visible: true,
        message: 'translated_settings.themeUpdateFailed',
        type: 'error',
      });
    });

    it('should handle different theme types', async () => {
      mockSettingsManager.updateTheme.mockResolvedValue();
      const { result } = renderUseSettings();

      const themes: ThemeType[] = ['light', 'dark', 'system'];
      
      for (const theme of themes) {
        await act(async () => {
          await result.current.updateTheme(theme);
        });
        expect(mockSettingsManager.updateTheme).toHaveBeenCalledWith(theme);
      }
    });
  });

  describe('updateLanguage', () => {
    it('should update language successfully', async () => {
      mockSettingsManager.updateLanguage.mockResolvedValue();
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.updateLanguage('id');
      });

      expect(mockSettingsManager.updateLanguage).toHaveBeenCalledWith('id');
      expect(mockT).toHaveBeenCalledWith('settings.languageUpdateSuccess');
      
      // Check if success notification was dispatched
      const state = store.getState();
      expect(state.app.notification).toEqual({
        visible: true,
        message: 'translated_settings.languageUpdateSuccess',
        type: 'success',
      });
    });

    it('should handle language update failure', async () => {
      const error = new Error('Language update failed');
      mockSettingsManager.updateLanguage.mockRejectedValue(error);
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.updateLanguage('id');
      });

      expect(mockSettingsManager.updateLanguage).toHaveBeenCalledWith('id');
      expect(mockT).toHaveBeenCalledWith('settings.languageUpdateFailed');
      
      // Check if error notification was dispatched
      const state = store.getState();
      expect(state.app.notification).toEqual({
        visible: true,
        message: 'translated_settings.languageUpdateFailed',
        type: 'error',
      });
    });

    it('should handle different language types', async () => {
      mockSettingsManager.updateLanguage.mockResolvedValue();
      const { result } = renderUseSettings();

      const languages: LanguageType[] = ['en', 'id'];
      
      for (const language of languages) {
        await act(async () => {
          await result.current.updateLanguage(language);
        });
        expect(mockSettingsManager.updateLanguage).toHaveBeenCalledWith(language);
      }
    });
  });

  describe('loadSettings', () => {
    it('should load settings successfully', async () => {
      mockSettingsManager.loadSettings.mockResolvedValue(undefined);
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.loadSettings();
      });

      expect(mockSettingsManager.loadSettings).toHaveBeenCalled();
      
      // Should not show any notification on success
      const state = store.getState();
      expect(state.app.notification).toBeNull();
    });

    it('should handle load settings failure', async () => {
      const error = new Error('Load settings failed');
      mockSettingsManager.loadSettings.mockRejectedValue(error);
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.loadSettings();
      });

      expect(mockSettingsManager.loadSettings).toHaveBeenCalled();
      expect(mockT).toHaveBeenCalledWith('settings.loadSettingsFailed');
      
      // Check if error notification was dispatched
      const state = store.getState();
      expect(state.app.notification).toEqual({
        visible: true,
        message: 'translated_settings.loadSettingsFailed',
        type: 'error',
      });
    });
  });

  describe('clearSettings', () => {
    it('should clear settings successfully', async () => {
      mockSettingsManager.clearSettings.mockResolvedValue(undefined);
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.clearSettings();
      });

      expect(mockSettingsManager.clearSettings).toHaveBeenCalled();
      expect(mockT).toHaveBeenCalledWith('settings.clearSettingsSuccess');
      
      // Check if success notification was dispatched
      const state = store.getState();
      expect(state.app.notification).toEqual({
        visible: true,
        message: 'translated_settings.clearSettingsSuccess',
        type: 'success',
      });
    });

    it('should handle clear settings failure', async () => {
      const error = new Error('Clear settings failed');
      mockSettingsManager.clearSettings.mockRejectedValue(error);
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.clearSettings();
      });

      expect(mockSettingsManager.clearSettings).toHaveBeenCalled();
      expect(mockT).toHaveBeenCalledWith('settings.clearSettingsFailed');
      
      // Check if error notification was dispatched
      const state = store.getState();
      expect(state.app.notification).toEqual({
        visible: true,
        message: 'translated_settings.clearSettingsFailed',
        type: 'error',
      });
    });
  });

  describe('memoization', () => {
    it('should memoize functions', () => {
      const { result, rerender } = renderUseSettings();

      const firstUpdateTheme = result.current.updateTheme;
      const firstUpdateLanguage = result.current.updateLanguage;
      const firstLoadSettings = result.current.loadSettings;
      const firstClearSettings = result.current.clearSettings;

      rerender(undefined);

      expect(result.current.updateTheme).toBe(firstUpdateTheme);
      expect(result.current.updateLanguage).toBe(firstUpdateLanguage);
      expect(result.current.loadSettings).toBe(firstLoadSettings);
      expect(result.current.clearSettings).toBe(firstClearSettings);
    });
  });

  describe('state reactivity', () => {
    it('should react to theme changes in store', () => {
      const { result, store } = renderUseSettings();

      expect(result.current.theme).toBe('light');

      act(() => {
        store.dispatch({ type: 'app/setTheme', payload: 'dark' });
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should react to language changes in store', () => {
      const { result, store } = renderUseSettings();

      expect(result.current.language).toBe('en');

      act(() => {
        store.dispatch({ type: 'app/setLanguage', payload: 'id' });
      });

      expect(result.current.language).toBe('id');
    });
  });

  describe('error handling', () => {
    it('should handle multiple consecutive errors', async () => {
      const error = new Error('Settings error');
      mockSettingsManager.updateTheme.mockRejectedValue(error);
      mockSettingsManager.updateLanguage.mockRejectedValue(error);
      
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.updateTheme('dark');
        await result.current.updateLanguage('id');
      });

      // Should have error notification (last one wins)
      const state = store.getState();
      expect(state.app.notification?.type).toBe('error');
    });

    it('should handle mixed success and error operations', async () => {
      mockSettingsManager.updateTheme.mockResolvedValue();
      mockSettingsManager.updateLanguage.mockRejectedValue(new Error('Language error'));
      
      const { result, store } = renderUseSettings();

      await act(async () => {
        await result.current.updateTheme('dark');
        await result.current.updateLanguage('id');
      });

      // Should have error notification (last one wins)
      const state = store.getState();
      expect(state.app.notification?.type).toBe('error');
    });
  });
});