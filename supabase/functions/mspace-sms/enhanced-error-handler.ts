
export interface EnhancedError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  httpStatus: number;
}

export class MspaceErrorHandler {
  static handleApiError(error: any, context: string): EnhancedError {
    console.error(`Mspace API Error in ${context}:`, error);

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        details: { originalError: error.message },
        retryable: true,
        httpStatus: 503
      };
    }

    // HTTP errors
    if (error.status) {
      switch (error.status) {
        case 401:
          return {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid API credentials',
            details: { status: error.status },
            retryable: false,
            httpStatus: 401
          };
        case 402:
          return {
            code: 'INSUFFICIENT_BALANCE',
            message: 'Insufficient SMS credits',
            details: { status: error.status },
            retryable: false,
            httpStatus: 402
          };
        case 429:
          return {
            code: 'RATE_LIMITED',
            message: 'API rate limit exceeded',
            details: { status: error.status },
            retryable: true,
            httpStatus: 429
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            code: 'SERVER_ERROR',
            message: 'Mspace server temporarily unavailable',
            details: { status: error.status },
            retryable: true,
            httpStatus: error.status
          };
        default:
          return {
            code: 'HTTP_ERROR',
            message: `HTTP ${error.status} error`,
            details: { status: error.status },
            retryable: error.status >= 500,
            httpStatus: error.status
          };
      }
    }

    // Mspace-specific API errors
    if (typeof error.message === 'string') {
      const message = error.message.toLowerCase();
      
      if (message.includes('invalid recipient') || message.includes('invalid phone')) {
        return {
          code: 'INVALID_RECIPIENT',
          message: 'Invalid phone number format',
          details: { originalMessage: error.message },
          retryable: false,
          httpStatus: 400
        };
      }
      
      if (message.includes('insufficient') || message.includes('balance')) {
        return {
          code: 'INSUFFICIENT_BALANCE',
          message: 'Insufficient SMS credits',
          details: { originalMessage: error.message },
          retryable: false,
          httpStatus: 402
        };
      }
      
      if (message.includes('timeout')) {
        return {
          code: 'TIMEOUT',
          message: 'Request timed out',
          details: { originalMessage: error.message },
          retryable: true,
          httpStatus: 408
        };
      }
    }

    // Default error
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: { originalError: error },
      retryable: false,
      httpStatus: 500
    };
  }

  static shouldRetry(error: EnhancedError, attemptCount: number, maxRetries: number): boolean {
    if (attemptCount >= maxRetries) return false;
    if (!error.retryable) return false;
    
    // Special retry logic for specific errors
    switch (error.code) {
      case 'RATE_LIMITED':
        return attemptCount < 2; // Only retry once for rate limits
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
        return attemptCount < maxRetries;
      case 'SERVER_ERROR':
        return attemptCount < Math.min(maxRetries, 2); // Limit server error retries
      default:
        return error.retryable && attemptCount < maxRetries;
    }
  }

  static getRetryDelay(error: EnhancedError, attemptCount: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 10000; // 10 seconds
    
    switch (error.code) {
      case 'RATE_LIMITED':
        return Math.min(5000 * Math.pow(2, attemptCount), maxDelay); // Exponential backoff for rate limits
      case 'SERVER_ERROR':
        return Math.min(baseDelay * Math.pow(1.5, attemptCount), maxDelay);
      default:
        return Math.min(baseDelay * Math.pow(2, attemptCount), maxDelay);
    }
  }
}
