import { useCallback, useState } from 'react'
import { extractErrorMessage } from '../utils/errorUtils'

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export interface UseAsyncStateReturn<T> {
  state: AsyncState<T>
  execute: (asyncFn: () => Promise<T>) => Promise<T>
  reset: () => void
  setData: (data: T | null) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

/**
 * Hook untuk mengelola async state dengan pattern yang konsisten
 */
export const useAsyncState = <T = unknown>(
  initialData: T | null = null
): UseAsyncStateReturn<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  })

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data, error: null }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }))
  }, [])

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }))
  }, [])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
    })
  }, [initialData])

  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const result = await asyncFn()
      setState(prev => ({ ...prev, data: result, isLoading: false, error: null }))
      return result
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'An error occurred')
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      throw error
    }
  }, [])

  return {
    state,
    execute,
    reset,
    setData,
    setError,
    setLoading,
  }
}

/**
 * Hook untuk loading state sederhana
 */
export const useLoadingState = (initialLoading: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading)

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    setIsLoading(true)
    try {
      const result = await asyncFn()
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    setIsLoading,
    withLoading,
  }
}

/**
 * Hook untuk error state sederhana
 */
export const useErrorState = () => {
  const [error, setErrorState] = useState<string | null>(null)

  const setError = useCallback((error: unknown, fallbackMessage: string = 'An error occurred') => {
    const errorMessage = extractErrorMessage(error, fallbackMessage)
    setErrorState(errorMessage)
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  return {
    error,
    setError,
    clearError,
    hasError: Boolean(error),
  }
}