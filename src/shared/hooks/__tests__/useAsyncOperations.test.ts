import { renderHook, act, waitFor } from '@testing-library/react-native'
import {
  useApiCall,
  useDebounced,
  useThrottled,
  useMultipleAsyncOperations,
  usePolling,
} from '../useAsyncOperations'
import { useAsyncState } from '../useAsyncState'

// Mock useAsyncState
jest.mock('../useAsyncState')
const mockUseAsyncState = useAsyncState as jest.MockedFunction<typeof useAsyncState>

// Mock timers
jest.useFakeTimers()

describe('useAsyncOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.useFakeTimers()
  })

  describe('useApiCall', () => {
    const mockExecute = jest.fn()
    const mockReset = jest.fn()
    const mockSetData = jest.fn()
    const mockSetError = jest.fn()
    const mockSetLoading = jest.fn()
    const mockState = {
      data: null,
      isLoading: false,
      error: null,
    }

    beforeEach(() => {
      mockUseAsyncState.mockReturnValue({
        state: mockState,
        execute: mockExecute,
        reset: mockReset,
        setData: mockSetData,
        setError: mockSetError,
        setLoading: mockSetLoading,
      })
    })

    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useApiCall())

      expect(result.current.retryCount).toBe(0)
      expect(result.current.data).toBe(mockState.data)
      expect(result.current.isLoading).toBe(mockState.isLoading)
      expect(result.current.error).toBe(mockState.error)
    })

    it('should execute API call successfully', async () => {
      const mockApiCall = jest.fn().mockResolvedValue('success')
      mockExecute.mockResolvedValue('success')

      const { result } = renderHook(() => useApiCall())

      await act(async () => {
        const response = await result.current.executeWithRetry(mockApiCall)
        expect(response).toBe('success')
      })

      expect(mockExecute).toHaveBeenCalledWith(mockApiCall)
      expect(result.current.retryCount).toBe(0)
    })

    it('should retry on failure and succeed', async () => {
      const mockApiCall = jest.fn()
      mockExecute
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce('success')

      const { result } = renderHook(() => useApiCall())

      await act(async () => {
        jest.advanceTimersByTime(2000) // First retry delay
        const response = await result.current.executeWithRetry(mockApiCall, 2)
        expect(response).toBe('success')
      })

      expect(mockExecute).toHaveBeenCalledTimes(2)
    })

    it('should fail after max retries', async () => {
      const mockApiCall = jest.fn()
      const error = new Error('Persistent error')
      mockExecute.mockRejectedValue(error)

      const { result } = renderHook(() => useApiCall())

      await act(async () => {
        try {
          await result.current.executeWithRetry(mockApiCall, 2)
        } catch (e) {
          expect(e).toBe(error)
        }
      })

      expect(result.current.retryCount).toBe(2)
    })

    it('should reset state and retry count', () => {
      const { result } = renderHook(() => useApiCall())

      act(() => {
        result.current.reset()
      })

      expect(mockReset).toHaveBeenCalled()
      expect(result.current.retryCount).toBe(0)
    })
  })

  describe('useDebounced', () => {
    it('should debounce callback execution', () => {
      const mockCallback = jest.fn()
      const { result } = renderHook(() => useDebounced(mockCallback, 300))

      act(() => {
        result.current.debouncedCallback('arg1')
        result.current.debouncedCallback('arg2')
        result.current.debouncedCallback('arg3')
      })

      expect(mockCallback).not.toHaveBeenCalled()
      expect(result.current.isPending).toBe(true)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith('arg3')
      expect(result.current.isPending).toBe(false)
    })

    it('should cancel debounced callback', () => {
      const mockCallback = jest.fn()
      const { result } = renderHook(() => useDebounced(mockCallback, 300))

      act(() => {
        result.current.debouncedCallback('arg1')
      })

      expect(result.current.isPending).toBe(true)

      act(() => {
        result.current.cancel()
      })

      expect(result.current.isPending).toBe(false)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should cleanup timeout on unmount', () => {
      const mockCallback = jest.fn()
      const { result, unmount } = renderHook(() => useDebounced(mockCallback, 300))

      act(() => {
        result.current.debouncedCallback('arg1')
      })

      unmount()

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('useThrottled', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(0)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should throttle callback execution', () => {
      const mockCallback = jest.fn()
      const { result } = renderHook(() => useThrottled(mockCallback, 300))

      act(() => {
        result.current.throttledCallback('arg1')
      })

      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith('arg1')

      // Immediate subsequent calls should be throttled
      act(() => {
        result.current.throttledCallback('arg2')
        result.current.throttledCallback('arg3')
      })

      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(result.current.isPending).toBe(true)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(mockCallback).toHaveBeenCalledTimes(2)
      expect(mockCallback).toHaveBeenLastCalledWith('arg3')
      expect(result.current.isPending).toBe(false)
    })

    it('should cancel throttled callback', () => {
      const mockCallback = jest.fn()
      const { result } = renderHook(() => useThrottled(mockCallback, 300))

      act(() => {
        result.current.throttledCallback('arg1')
        result.current.throttledCallback('arg2')
      })

      expect(result.current.isPending).toBe(true)

      act(() => {
        result.current.cancel()
      })

      expect(result.current.isPending).toBe(false)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(mockCallback).toHaveBeenCalledTimes(1) // Only the first immediate call
    })
  })

  describe('useMultipleAsyncOperations', () => {
    it('should initialize with empty operations', () => {
      const { result } = renderHook(() => useMultipleAsyncOperations())

      expect(result.current.operations).toEqual({})
    })

    it('should execute async operation successfully', async () => {
      const mockAsyncFn = jest.fn().mockResolvedValue('success')
      const { result } = renderHook(() => useMultipleAsyncOperations())

      await act(async () => {
        const response = await result.current.execute('test-key', mockAsyncFn)
        expect(response).toBe('success')
      })

      expect(result.current.operations['test-key']).toEqual({
        isLoading: false,
        error: null,
        data: 'success',
      })
    })

    it('should handle async operation error', async () => {
      const error = new Error('Test error')
      const mockAsyncFn = jest.fn().mockRejectedValue(error)
      const { result } = renderHook(() => useMultipleAsyncOperations())

      await act(async () => {
        try {
          await result.current.execute('test-key', mockAsyncFn)
        } catch (e) {
          expect(e).toBe(error)
        }
      })

      expect(result.current.operations['test-key']).toEqual({
        isLoading: false,
        error: 'Test error',
        data: null,
      })
    })

    it('should get operation state', () => {
      const { result } = renderHook(() => useMultipleAsyncOperations())

      const operation = result.current.getOperation('non-existent')
      expect(operation).toEqual({
        isLoading: false,
        error: null,
        data: null,
      })
    })

    it('should reset specific operation', async () => {
      const mockAsyncFn = jest.fn().mockResolvedValue('success')
      const { result } = renderHook(() => useMultipleAsyncOperations())

      await act(async () => {
        await result.current.execute('test-key', mockAsyncFn)
      })

      act(() => {
        result.current.reset('test-key')
      })

      expect(result.current.operations['test-key']).toBeUndefined()
    })

    it('should reset all operations', async () => {
      const mockAsyncFn = jest.fn().mockResolvedValue('success')
      const { result } = renderHook(() => useMultipleAsyncOperations())

      await act(async () => {
        await result.current.execute('test-key-1', mockAsyncFn)
        await result.current.execute('test-key-2', mockAsyncFn)
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.operations).toEqual({})
    })
  })

  describe('usePolling', () => {
    const mockExecute = jest.fn()
    const mockState = {
      data: null,
      isLoading: false,
      error: null,
    }

    beforeEach(() => {
      mockUseAsyncState.mockReturnValue({
        state: mockState,
        execute: mockExecute,
        reset: jest.fn(),
        setData: jest.fn(),
        setError: jest.fn(),
        setLoading: jest.fn(),
      })
    })

    it('should initialize with correct default values', () => {
      const mockAsyncFn = jest.fn()
      const { result } = renderHook(() => usePolling(mockAsyncFn))

      expect(result.current.isPolling).toBe(false)
      expect(result.current.data).toBe(mockState.data)
      expect(result.current.isLoading).toBe(mockState.isLoading)
      expect(result.current.error).toBe(mockState.error)
    })

    it('should start polling with immediate execution', () => {
      const mockAsyncFn = jest.fn()
      const { result } = renderHook(() => usePolling(mockAsyncFn, 1000, true))

      act(() => {
        result.current.startPolling()
      })

      expect(result.current.isPolling).toBe(true)
      expect(mockExecute).toHaveBeenCalledWith(mockAsyncFn)

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(mockExecute).toHaveBeenCalledTimes(2)
    })

    it('should start polling without immediate execution', () => {
      const mockAsyncFn = jest.fn()
      const { result } = renderHook(() => usePolling(mockAsyncFn, 1000, false))

      act(() => {
        result.current.startPolling()
      })

      expect(result.current.isPolling).toBe(true)
      expect(mockExecute).not.toHaveBeenCalled()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(mockExecute).toHaveBeenCalledTimes(1)
    })

    it('should stop polling', () => {
      const mockAsyncFn = jest.fn()
      const { result } = renderHook(() => usePolling(mockAsyncFn, 1000))

      act(() => {
        result.current.startPolling()
      })

      expect(result.current.isPolling).toBe(true)

      act(() => {
        result.current.stopPolling()
      })

      expect(result.current.isPolling).toBe(false)

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Should not execute after stopping
      expect(mockExecute).toHaveBeenCalledTimes(1) // Only the immediate call
    })

    it('should not start polling if already polling', () => {
      const mockAsyncFn = jest.fn()
      const { result } = renderHook(() => usePolling(mockAsyncFn, 1000))

      act(() => {
        result.current.startPolling()
        result.current.startPolling() // Second call should be ignored
      })

      expect(mockExecute).toHaveBeenCalledTimes(1)
    })

    it('should cleanup interval on unmount', () => {
      const mockAsyncFn = jest.fn()
      const { result, unmount } = renderHook(() => usePolling(mockAsyncFn, 1000))

      act(() => {
        result.current.startPolling()
      })

      unmount()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Should not execute after unmount
      expect(mockExecute).toHaveBeenCalledTimes(1) // Only the immediate call
    })
  })
})