import {
  extractErrorMessage,
  createErrorResult,
  withErrorHandling,
  logError,
  handleStorageError,
  handleApiError,
  handleValidationError,
  handleAuthError,
  withRetry,
  ErrorResult
} from '../errorUtils';

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

describe('errorUtils', () => {
  beforeEach(() => {
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  describe('extractErrorMessage', () => {
    it('should extract message from Error instance', () => {
      const error = new Error('Test error message');
      const result = extractErrorMessage(error, 'Fallback message');
      expect(result).toBe('Test error message');
    });

    it('should return string error as is', () => {
      const error = 'String error message';
      const result = extractErrorMessage(error, 'Fallback message');
      expect(result).toBe('String error message');
    });

    it('should extract message from object with message property', () => {
      const error = { message: 'Object error message' };
      const result = extractErrorMessage(error, 'Fallback message');
      expect(result).toBe('Object error message');
    });

    it('should return fallback message for unknown error types', () => {
      const error = { someProperty: 'value' };
      const result = extractErrorMessage(error, 'Fallback message');
      expect(result).toBe('Fallback message');
    });

    it('should return fallback message for null/undefined', () => {
      expect(extractErrorMessage(null, 'Fallback')).toBe('Fallback');
      expect(extractErrorMessage(undefined, 'Fallback')).toBe('Fallback');
    });
  });

  describe('createErrorResult', () => {
    it('should create error result with Error instance', () => {
      const error = new Error('Test error');
      const result = createErrorResult(error, 'Fallback', 'TEST_CODE');
      
      expect(result.message).toBe('Test error');
      expect(result.code).toBe('TEST_CODE');
      expect(result.details).toBe(error.stack);
    });

    it('should create error result with string error', () => {
      const error = 'String error';
      const result = createErrorResult(error, 'Fallback', 'TEST_CODE');
      
      expect(result.message).toBe('String error');
      expect(result.code).toBe('TEST_CODE');
      expect(result.details).toBe(error);
    });

    it('should create error result without code', () => {
      const error = 'Test error';
      const result = createErrorResult(error, 'Fallback');
      
      expect(result.message).toBe('Test error');
      expect(result.code).toBeUndefined();
    });
  });

  describe('withErrorHandling', () => {
    it('should return result when function succeeds', async () => {
      const successFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = withErrorHandling(successFn, 'Operation failed');
      
      const result = await wrappedFn('arg1', 'arg2');
      
      expect(result).toBe('success');
      expect(successFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should handle errors and return error result', async () => {
      const errorFn = jest.fn().mockRejectedValue(new Error('Test error'));
      const wrappedFn = withErrorHandling(errorFn, 'Operation failed');
      
      const result = await wrappedFn();
      
      expect(result).toEqual({
        message: 'Test error',
        code: undefined,
        details: expect.any(String)
      });
    });

    it('should use fallback message when error has no message', async () => {
      const errorFn = jest.fn().mockRejectedValue({});
      const wrappedFn = withErrorHandling(errorFn, 'Operation failed');
      
      const result = await wrappedFn();
      
      expect(result).toEqual({
        message: 'Operation failed',
        code: undefined,
        details: {}
      });
    });
  });

  describe('logError', () => {
    it('should log error with context', () => {
      const error = new Error('Test error');
      logError('Test context', error);
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[Test context] Error:',
        'Test error',
        error
      );
    });

    it('should log error with additional info', () => {
      const error = new Error('Test error');
      const additionalInfo = { userId: '123', action: 'login' };
      
      logError('Test context', error, additionalInfo);
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[Test context] Error:',
        'Test error',
        error
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Additional info:',
        additionalInfo
      );
    });
  });

  describe('handleStorageError', () => {
    it('should log storage error', () => {
      const error = new Error('Storage error');
      handleStorageError('save', error);
      
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[Storage] save operation failed:',
        'Storage error'
      );
    });
  });

  describe('handleApiError', () => {
    it('should handle API error without request data', () => {
      const error = new Error('API error');
      const result = handleApiError('/api/test', error);
      
      expect(result).toEqual({
        message: 'API error',
        code: 'API_ERROR',
        details: expect.any(String)
      });
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[API] /api/test failed:',
        'API error',
        error
      );
    });

    it('should handle API error with request data', () => {
      const error = new Error('API error');
      const requestData = { userId: '123' };
      const result = handleApiError('/api/test', error, requestData);
      
      expect(result).toEqual({
        message: 'API error',
        code: 'API_ERROR',
        details: expect.any(String)
      });
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[API] /api/test failed:',
        'API error',
        error
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Request data:',
        requestData
      );
    });
  });

  describe('handleValidationError', () => {
    it('should handle validation error', () => {
      const error = new Error('Validation failed');
      const result = handleValidationError('email', error);
      
      expect(result).toEqual({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: expect.any(String)
      });
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[Validation] email validation failed:',
        'Validation failed'
      );
    });
  });

  describe('handleAuthError', () => {
    it('should handle authentication error', () => {
      const error = new Error('Auth failed');
      const result = handleAuthError('login', error);
      
      expect(result).toEqual({
        message: 'Auth failed',
        code: 'AUTH_ERROR',
        details: expect.any(String)
      });
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[Auth] login failed:',
        'Auth failed',
        error
      );
    });

    it('should handle token expired error', () => {
      const error = new Error('Token expired');
      const result = handleAuthError('refresh', error);
      
      expect(result.code).toBe('TOKEN_EXPIRED');
    });

    it('should handle invalid credentials error', () => {
      const error = new Error('Invalid credentials');
      const result = handleAuthError('login', error);
      
      expect(result.code).toBe('INVALID_CREDENTIALS');
    });

    it('should handle unauthorized error', () => {
      const error = new Error('Unauthorized');
      const result = handleAuthError('access', error);
      
      expect(result.code).toBe('UNAUTHORIZED');
    });
  });

  describe('withRetry', () => {
    jest.useFakeTimers();

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('should return result on first success', async () => {
      const successFn = jest.fn().mockResolvedValue('success');
      const retryFn = withRetry(successFn, 3, 1000);
      
      const resultPromise = retryFn('arg1');
      const result = await resultPromise;
      
      expect(result).toBe('success');
      expect(successFn).toHaveBeenCalledTimes(1);
      expect(successFn).toHaveBeenCalledWith('arg1');
    });

    it('should retry on failure and eventually succeed', async () => {
      const retryFn = jest.fn()
        .mockRejectedValueOnce(new Error('Attempt 1'))
        .mockRejectedValueOnce(new Error('Attempt 2'))
        .mockResolvedValue('success');
      
      const wrappedFn = withRetry(retryFn, 3, 100);
      
      const resultPromise = wrappedFn();
      
      // Fast-forward timers for retries
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      jest.advanceTimersByTime(200);
      await Promise.resolve();
      
      const result = await resultPromise;
      
      expect(result).toBe('success');
      expect(retryFn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const failingFn = jest.fn().mockRejectedValue(new Error('Always fails'));
      const retryFn = withRetry(failingFn, 2, 100);
      
      const resultPromise = retryFn();
      
      // Fast-forward timers for all retries
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      jest.advanceTimersByTime(200);
      await Promise.resolve();
      
      await expect(resultPromise).rejects.toThrow('Always fails');
      expect(failingFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should use exponential backoff for delays', async () => {
      const failingFn = jest.fn().mockRejectedValue(new Error('Fails'));
      const retryFn = withRetry(failingFn, 3, 100);
      
      const resultPromise = retryFn();
      
      // Check that delays increase exponentially
      jest.advanceTimersByTime(100); // First retry after 100ms
      await Promise.resolve();
      jest.advanceTimersByTime(200); // Second retry after 200ms
      await Promise.resolve();
      jest.advanceTimersByTime(400); // Third retry after 400ms
      await Promise.resolve();
      
      await expect(resultPromise).rejects.toThrow('Fails');
    });
  });
});