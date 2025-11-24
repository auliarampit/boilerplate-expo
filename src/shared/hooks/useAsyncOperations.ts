import { useState, useCallback, useRef, useEffect } from 'react'
import { useAsyncState } from './useAsyncState'

/**
 * Hook untuk mengelola API calls dengan retry logic
 */
export const useApiCall = <T = unknown>() => {
  const { state, execute, reset } = useAsyncState<T>()
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const executeWithRetry = useCallback(async (
    apiCall: () => Promise<T>,
    maxRetryAttempts: number = maxRetries
  ): Promise<T> => {
    let attempts = 0
    
    const attemptCall = async (): Promise<T> => {
      try {
        const result = await execute(apiCall)
        setRetryCount(0)
        return result
      } catch (error) {
        attempts++
        setRetryCount(attempts)
        
        if (attempts < maxRetryAttempts) {
          // Exponential backoff
          const delay = Math.pow(2, attempts) * 1000
          await new Promise(resolve => setTimeout(resolve, delay))
          return attemptCall()
        }
        
        throw error
      }
    }
    
    return attemptCall()
  }, [execute, maxRetries])

  return {
    ...state,
    retryCount,
    executeWithRetry,
    reset: () => {
      reset()
      setRetryCount(0)
    },
  }
}

/**
 * Hook untuk debounced operations
 */
export const useDebounced = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPending, setIsPending] = useState(false)

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    setIsPending(true)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
      setIsPending(false)
    }, delay)
  }, [callback, delay])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      setIsPending(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    debouncedCallback,
    isPending,
    cancel,
  }
}

/**
 * Hook untuk throttled operations
 */
export const useThrottled = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
) => {
  const lastCallRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPending, setIsPending] = useState(false)

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallRef.current
    
    if (timeSinceLastCall >= delay) {
      lastCallRef.current = now
      callback(...args)
    } else {
      setIsPending(true)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now()
        callback(...args)
        setIsPending(false)
      }, delay - timeSinceLastCall)
    }
  }, [callback, delay])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      setIsPending(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    throttledCallback,
    isPending,
    cancel,
  }
}

/**
 * Hook untuk mengelola multiple async operations
 */
export const useMultipleAsyncOperations = () => {
  const [operations, setOperations] = useState<Record<string, {
    isLoading: boolean
    error: string | null
    data: unknown
  }>>({})

  const execute = useCallback(async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setOperations(prev => ({
      ...prev,
      [key]: {
        isLoading: true,
        error: null,
        data: prev[key]?.data || null,
      },
    }))

    try {
      const result = await asyncFn()
      setOperations(prev => ({
        ...prev,
        [key]: {
          isLoading: false,
          error: null,
          data: result,
        },
      }))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setOperations(prev => ({
        ...prev,
        [key]: {
          isLoading: false,
          error: errorMessage,
          data: prev[key]?.data || null,
        },
      }))
      throw error
    }
  }, [])

  const reset = useCallback((key?: string) => {
    if (key) {
      setOperations(prev => {
        const newOperations = { ...prev }
        delete newOperations[key]
        return newOperations
      })
    } else {
      setOperations({})
    }
  }, [])

  const getOperation = useCallback((key: string) => {
    return operations[key] || {
      isLoading: false,
      error: null,
      data: null,
    }
  }, [operations])

  return {
    operations,
    execute,
    reset,
    getOperation,
  }
}

/**
 * Hook untuk polling operations
 */
export const usePolling = <T>(
  asyncFn: () => Promise<T>,
  interval: number = 5000,
  immediate: boolean = true
) => {
  const { state, execute } = useAsyncState<T>()
  const [isPolling, setIsPolling] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startPolling = useCallback(() => {
    if (isPolling) return
    
    setIsPolling(true)
    
    if (immediate) {
      execute(asyncFn)
    }
    
    intervalRef.current = setInterval(() => {
      execute(asyncFn)
    }, interval)
  }, [asyncFn, interval, immediate, execute, isPolling])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    ...state,
    isPolling,
    startPolling,
    stopPolling,
  }
}