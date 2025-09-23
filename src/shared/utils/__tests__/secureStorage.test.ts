import { SecureStorage, SECURE_STORAGE_KEYS, getSecureStorageWithFallback } from '../secureStorage';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('SecureStorage', () => {
    describe('setItem', () => {
      it('should save item to secure storage', async () => {
        mockSecureStore.setItemAsync.mockResolvedValue();

        await SecureStorage.setItem('test-key', 'test-value');

        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', 'test-value');
      });

      it('should handle secure storage error', async () => {
        const error = new Error('Secure storage error');
        mockSecureStore.setItemAsync.mockRejectedValue(error);

        await expect(SecureStorage.setItem('test-key', 'test-value'))
          .rejects.toThrow('Failed to save secure data');

        expect(mockConsoleError).toHaveBeenCalledWith('SecureStorage setItem error:', error);
      });
    });

    describe('getItem', () => {
      it('should retrieve item from secure storage', async () => {
        const testValue = 'test-value';
        mockSecureStore.getItemAsync.mockResolvedValue(testValue);

        const result = await SecureStorage.getItem('test-key');

        expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
        expect(result).toBe(testValue);
      });

      it('should return null when item not found', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        const result = await SecureStorage.getItem('non-existent-key');

        expect(result).toBeNull();
      });

      it('should handle secure storage error and return null', async () => {
        const error = new Error('Secure storage error');
        mockSecureStore.getItemAsync.mockRejectedValue(error);

        const result = await SecureStorage.getItem('test-key');

        expect(mockConsoleError).toHaveBeenCalledWith('SecureStorage getItem error:', error);
        expect(result).toBeNull();
      });
    });

    describe('deleteItem', () => {
      it('should delete item from secure storage', async () => {
        mockSecureStore.deleteItemAsync.mockResolvedValue();

        await SecureStorage.deleteItem('test-key');

        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
      });

      it('should handle secure storage error silently', async () => {
        const error = new Error('Secure storage error');
        mockSecureStore.deleteItemAsync.mockRejectedValue(error);

        // Should not throw
        await SecureStorage.deleteItem('test-key');

        expect(mockConsoleError).toHaveBeenCalledWith('SecureStorage deleteItem error:', error);
      });
    });

    describe('isAvailable', () => {
      it('should return true when secure storage is available', async () => {
        mockSecureStore.setItemAsync.mockResolvedValue();
        mockSecureStore.getItemAsync.mockResolvedValue('test');
        mockSecureStore.deleteItemAsync.mockResolvedValue();

        const result = await SecureStorage.isAvailable();

        expect(result).toBe(true);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('@secure_storage_test', 'test');
        expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('@secure_storage_test');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('@secure_storage_test');
      });

      it('should return false when secure storage is not available', async () => {
        const error = new Error('Secure storage not available');
        mockSecureStore.setItemAsync.mockRejectedValue(error);

        const result = await SecureStorage.isAvailable();

        expect(result).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('SecureStorage availability check failed:', error);
      });

      it('should return false when get operation fails', async () => {
        mockSecureStore.setItemAsync.mockResolvedValue();
        mockSecureStore.getItemAsync.mockRejectedValue(new Error('Get failed'));

        const result = await SecureStorage.isAvailable();

        expect(result).toBe(false);
      });

      it('should return false when delete operation fails', async () => {
        mockSecureStore.setItemAsync.mockResolvedValue();
        mockSecureStore.getItemAsync.mockResolvedValue('test');
        mockSecureStore.deleteItemAsync.mockRejectedValue(new Error('Delete failed'));

        const result = await SecureStorage.isAvailable();

        expect(result).toBe(false);
      });
    });
  });

  describe('SECURE_STORAGE_KEYS', () => {
    it('should have all required keys', () => {
      expect(SECURE_STORAGE_KEYS.ACCESS_TOKEN).toBe('@secure_access_token');
      expect(SECURE_STORAGE_KEYS.REFRESH_TOKEN).toBe('@secure_refresh_token');
      expect(SECURE_STORAGE_KEYS.BIOMETRIC_CREDENTIALS).toBe('@secure_biometric_credentials');
      expect(SECURE_STORAGE_KEYS.ENCRYPTION_KEY).toBe('@secure_encryption_key');
      expect(SECURE_STORAGE_KEYS.PRIVATE_DATA).toBe('@secure_private_data');
    });

    it('should be readonly', () => {
      // TypeScript should prevent this, but we can test runtime behavior
      expect(() => {
        // @ts-ignore - Testing runtime immutability
        SECURE_STORAGE_KEYS.ACCESS_TOKEN = 'new-value';
      }).toThrow();
    });
  });

  describe('getSecureStorageWithFallback', () => {
    it('should return SecureStorage when available', async () => {
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue('test');
      mockSecureStore.deleteItemAsync.mockResolvedValue();

      const storage = await getSecureStorageWithFallback();

      expect(storage).toBe(SecureStorage);
    });

    it('should return AsyncStorage fallback when SecureStorage not available', async () => {
      mockSecureStore.setItemAsync.mockRejectedValue(new Error('Not available'));

      const storage = await getSecureStorageWithFallback();

      expect(storage).not.toBe(SecureStorage);
      expect(storage).toHaveProperty('setItem');
      expect(storage).toHaveProperty('getItem');
      expect(storage).toHaveProperty('deleteItem');
    });

    it('should test fallback storage functionality', async () => {
      mockSecureStore.setItemAsync.mockRejectedValue(new Error('Not available'));
      mockAsyncStorage.setItem.mockResolvedValue();
      mockAsyncStorage.getItem.mockResolvedValue('fallback-value');
      mockAsyncStorage.removeItem.mockResolvedValue();

      const storage = await getSecureStorageWithFallback();

      // Test setItem
      await storage.setItem('test-key', 'test-value');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');

      // Test getItem
      const result = await storage.getItem('test-key');
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe('fallback-value');

      // Test deleteItem
      await storage.deleteItem('test-key');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle AsyncStorage errors in fallback', async () => {
      mockSecureStore.setItemAsync.mockRejectedValue(new Error('Not available'));
      const asyncError = new Error('AsyncStorage error');
      mockAsyncStorage.setItem.mockRejectedValue(asyncError);
      mockAsyncStorage.getItem.mockRejectedValue(asyncError);
      mockAsyncStorage.removeItem.mockRejectedValue(asyncError);

      const storage = await getSecureStorageWithFallback();

      // Test setItem error handling
      await expect(storage.setItem('test-key', 'test-value'))
        .rejects.toThrow('Failed to save data to fallback storage');

      // Test getItem error handling
      const result = await storage.getItem('test-key');
      expect(result).toBeNull();

      // Test deleteItem error handling (should not throw)
      await storage.deleteItem('test-key');
      expect(mockConsoleError).toHaveBeenCalledWith('Fallback storage deleteItem error:', asyncError);
    });

    it('should cache the storage instance', async () => {
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue('test');
      mockSecureStore.deleteItemAsync.mockResolvedValue();

      const storage1 = await getSecureStorageWithFallback();
      const storage2 = await getSecureStorageWithFallback();

      expect(storage1).toBe(storage2);
      // Should only check availability once due to caching
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    });

    it('should handle mixed availability scenarios', async () => {
      // First call - SecureStorage not available
      mockSecureStore.setItemAsync.mockRejectedValueOnce(new Error('Not available'));
      const fallbackStorage = await getSecureStorageWithFallback();
      expect(fallbackStorage).not.toBe(SecureStorage);

      // Reset mocks for second call
      jest.clearAllMocks();
      
      // Second call should return cached fallback storage
      const cachedStorage = await getSecureStorageWithFallback();
      expect(cachedStorage).toBe(fallbackStorage);
      expect(mockSecureStore.setItemAsync).not.toHaveBeenCalled();
    });
  });
});