import SettingsManager, { ThemeType, LanguageType } from '../settingsManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@/shared/store';
import { setTheme, setLanguage } from '@/shared/store/slices/appSlice';
import { STORAGE_KEYS } from '../../constants/storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Redux store
jest.mock('@/shared/store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

// Mock Redux actions
jest.mock('@/shared/store/slices/appSlice', () => ({
  setTheme: jest.fn(),
  setLanguage: jest.fn(),
}));

// Mock storage keys
jest.mock('../../constants/storage', () => ({
  STORAGE_KEYS: {
    THEME: 'theme',
    LANGUAGE: 'language',
  },
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockStore = store as jest.Mocked<typeof store>;
const mockSetTheme = setTheme as jest.MockedFunction<typeof setTheme>;
const mockSetLanguage = setLanguage as jest.MockedFunction<typeof setLanguage>;
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('SettingsManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('updateTheme', () => {
    it('should save theme to AsyncStorage and dispatch to store', async () => {
      const theme: ThemeType = 'dark';
      const mockAction = { type: 'app/setTheme', payload: theme };
      mockSetTheme.mockReturnValue(mockAction as any);
      mockAsyncStorage.setItem.mockResolvedValue();

      await SettingsManager.updateTheme(theme);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, theme);
      expect(mockSetTheme).toHaveBeenCalledWith(theme);
      expect(mockStore.dispatch).toHaveBeenCalledWith(mockAction);
    });

    it('should handle AsyncStorage error', async () => {
      const theme: ThemeType = 'light';
      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      await SettingsManager.updateTheme(theme);

      expect(mockConsoleError).toHaveBeenCalledWith('Failed to save theme:', error);
    });

    it('should work with all valid theme types', async () => {
      const themes: ThemeType[] = ['light', 'dark', 'system'];
      mockAsyncStorage.setItem.mockResolvedValue();

      for (const theme of themes) {
        await SettingsManager.updateTheme(theme);
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, theme);
      }
    });
  });

  describe('updateLanguage', () => {
    it('should save language to AsyncStorage and dispatch to store', async () => {
      const language: LanguageType = 'id';
      const mockAction = { type: 'app/setLanguage', payload: language };
      mockSetLanguage.mockReturnValue(mockAction as any);
      mockAsyncStorage.setItem.mockResolvedValue();

      await SettingsManager.updateLanguage(language);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.LANGUAGE, language);
      expect(mockSetLanguage).toHaveBeenCalledWith(language);
      expect(mockStore.dispatch).toHaveBeenCalledWith(mockAction);
    });

    it('should handle AsyncStorage error', async () => {
      const language: LanguageType = 'en';
      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      await SettingsManager.updateLanguage(language);

      expect(mockConsoleError).toHaveBeenCalledWith('Failed to save language:', error);
    });

    it('should work with all valid language types', async () => {
      const languages: LanguageType[] = ['en', 'id'];
      mockAsyncStorage.setItem.mockResolvedValue();

      for (const language of languages) {
        await SettingsManager.updateLanguage(language);
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.LANGUAGE, language);
      }
    });
  });

  describe('loadSettings', () => {
    it('should load valid theme and language from storage', async () => {
      const theme = 'dark';
      const language = 'id';
      const mockThemeAction = { type: 'app/setTheme', payload: theme };
      const mockLanguageAction = { type: 'app/setLanguage', payload: language };
      
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(theme)
        .mockResolvedValueOnce(language);
      mockSetTheme.mockReturnValue(mockThemeAction as any);
      mockSetLanguage.mockReturnValue(mockLanguageAction as any);

      await SettingsManager.loadSettings();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.LANGUAGE);
      expect(mockSetTheme).toHaveBeenCalledWith(theme);
      expect(mockSetLanguage).toHaveBeenCalledWith(language);
      expect(mockStore.dispatch).toHaveBeenCalledWith(mockThemeAction);
      expect(mockStore.dispatch).toHaveBeenCalledWith(mockLanguageAction);
    });

    it('should ignore invalid theme and language values', async () => {
      mockAsyncStorage.getItem
        .mockResolvedValueOnce('invalid-theme')
        .mockResolvedValueOnce('invalid-language');

      await SettingsManager.loadSettings();

      expect(mockSetTheme).not.toHaveBeenCalled();
      expect(mockSetLanguage).not.toHaveBeenCalled();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('should handle null values from storage', async () => {
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await SettingsManager.loadSettings();

      expect(mockSetTheme).not.toHaveBeenCalled();
      expect(mockSetLanguage).not.toHaveBeenCalled();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('should handle AsyncStorage error', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      await SettingsManager.loadSettings();

      expect(mockConsoleError).toHaveBeenCalledWith('Failed to load settings:', error);
    });

    it('should load only valid theme when language is invalid', async () => {
      const theme = 'light';
      const mockThemeAction = { type: 'app/setTheme', payload: theme };
      
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(theme)
        .mockResolvedValueOnce('invalid-language');
      mockSetTheme.mockReturnValue(mockThemeAction as any);

      await SettingsManager.loadSettings();

      expect(mockSetTheme).toHaveBeenCalledWith(theme);
      expect(mockSetLanguage).not.toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(mockThemeAction);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearSettings', () => {
    it('should remove theme and language from storage', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await SettingsManager.clearSettings();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.LANGUAGE);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledTimes(2);
    });

    it('should handle AsyncStorage error', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.removeItem.mockRejectedValue(error);

      await SettingsManager.clearSettings();

      expect(mockConsoleError).toHaveBeenCalledWith('Failed to clear settings:', error);
    });
  });

  describe('getTheme', () => {
    it('should return valid theme from storage', async () => {
      const theme = 'dark';
      mockAsyncStorage.getItem.mockResolvedValue(theme);

      const result = await SettingsManager.getTheme();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
      expect(result).toBe(theme);
    });

    it('should return null for invalid theme', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-theme');

      const result = await SettingsManager.getTheme();

      expect(result).toBeNull();
    });

    it('should return null when storage returns null', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await SettingsManager.getTheme();

      expect(result).toBeNull();
    });

    it('should handle AsyncStorage error', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      const result = await SettingsManager.getTheme();

      expect(mockConsoleError).toHaveBeenCalledWith('Failed to get theme:', error);
      expect(result).toBeNull();
    });

    it('should validate all theme types correctly', async () => {
      const validThemes: ThemeType[] = ['light', 'dark', 'system'];
      
      for (const theme of validThemes) {
        mockAsyncStorage.getItem.mockResolvedValue(theme);
        const result = await SettingsManager.getTheme();
        expect(result).toBe(theme);
      }
    });
  });

  describe('getLanguage', () => {
    it('should return valid language from storage', async () => {
      const language = 'id';
      mockAsyncStorage.getItem.mockResolvedValue(language);

      const result = await SettingsManager.getLanguage();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.LANGUAGE);
      expect(result).toBe(language);
    });

    it('should return null for invalid language', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-language');

      const result = await SettingsManager.getLanguage();

      expect(result).toBeNull();
    });

    it('should return null when storage returns null', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await SettingsManager.getLanguage();

      expect(result).toBeNull();
    });

    it('should handle AsyncStorage error', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      const result = await SettingsManager.getLanguage();

      expect(mockConsoleError).toHaveBeenCalledWith('Failed to get language:', error);
      expect(result).toBeNull();
    });

    it('should validate all language types correctly', async () => {
      const validLanguages: LanguageType[] = ['en', 'id'];
      
      for (const language of validLanguages) {
        mockAsyncStorage.getItem.mockResolvedValue(language);
        const result = await SettingsManager.getLanguage();
        expect(result).toBe(language);
      }
    });
  });
});