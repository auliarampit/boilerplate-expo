/**
 * Utility untuk error handling yang konsisten
 */

export interface ErrorResult {
  message: string
  code?: string
  details?: unknown
}

/**
 * Mengekstrak error message dengan fallback
 */
export const extractErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return fallbackMessage
}

/**
 * Membuat error result object yang konsisten
 */
export const createErrorResult = (
  error: unknown,
  fallbackMessage: string,
  code?: string
): ErrorResult => ({
  message: extractErrorMessage(error, fallbackMessage),
  code,
  details: error instanceof Error ? error.stack : error,
})

/**
 * Higher-order function untuk wrapping async operations dengan error handling
 */
export const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  fallbackMessage: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      const errorMessage = extractErrorMessage(error, fallbackMessage)
      throw new Error(errorMessage)
    }
  }
}

/**
 * Utility untuk logging error dengan format yang konsisten
 */
export const logError = (
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>
): void => {
  const errorMessage = extractErrorMessage(error, 'Unknown error occurred')
  
  console.error(`[${context}] ${errorMessage}`, {
    error,
    ...additionalInfo,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Utility untuk handling storage errors
 */
export const handleStorageError = (
  operation: string,
  error: unknown
): void => {
  logError(`Storage.${operation}`, error, { operation })
}

/**
 * Utility untuk handling API errors
 */
export const handleApiError = (
  endpoint: string,
  error: unknown,
  requestData?: unknown
): ErrorResult => {
  logError(`API.${endpoint}`, error, { endpoint, requestData })
  
  return createErrorResult(
    error,
    'Network request failed',
    'API_ERROR'
  )
}

/**
 * Utility untuk handling validation errors
 */
export const handleValidationError = (
  field: string,
  error: unknown
): ErrorResult => {
  return createErrorResult(
    error,
    `Validation failed for ${field}`,
    'VALIDATION_ERROR'
  )
}

/**
 * Utility untuk handling authentication errors
 */
export const handleAuthError = (
  operation: string,
  error: unknown
): ErrorResult => {
  logError(`Auth.${operation}`, error, { operation })
  
  // Determine specific auth error types
  const errorMessage = extractErrorMessage(error, 'Authentication failed')
  
  let code = 'AUTH_ERROR'
  if (errorMessage.toLowerCase().includes('unauthorized')) {
    code = 'UNAUTHORIZED'
  } else if (errorMessage.toLowerCase().includes('forbidden')) {
    code = 'FORBIDDEN'
  } else if (errorMessage.toLowerCase().includes('token')) {
    code = 'TOKEN_ERROR'
  }
  
  return createErrorResult(error, errorMessage, code)
}

/**
 * Utility untuk retry logic dengan exponential backoff
 */
export const withRetry = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) => {
  return async (...args: T): Promise<R> => {
    let lastError: unknown
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          break
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }
}