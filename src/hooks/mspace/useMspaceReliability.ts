
import { useState } from 'react';
import { useMspaceErrorHandler } from './useMspaceErrorHandler';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const useMspaceReliability = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { handleMspaceError, shouldRetry, incrementRetry, resetRetry } = useMspaceErrorHandler();

  const defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  };

  const executeWithRetry = async <T>(
    operation: () => Promise<T>,
    operationName: string,
    config: Partial<RetryConfig> = {}
  ): Promise<T> => {
    const finalConfig = { ...defaultRetryConfig, ...config };
    let lastError: any;

    resetRetry();

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          setIsRetrying(true);
          const delay = Math.min(
            finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, attempt - 1),
            finalConfig.maxDelay
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const result = await operation();
        setIsRetrying(false);
        resetRetry();
        return result;

      } catch (error) {
        lastError = error;
        const mappedError = handleMspaceError(error, operationName);

        if (!shouldRetry(mappedError) || attempt === finalConfig.maxRetries) {
          setIsRetrying(false);
          throw error;
        }

        incrementRetry();
      }
    }

    setIsRetrying(false);
    throw lastError;
  };

  const validatePhoneNumber = (phone: string): { isValid: boolean; formatted?: string; error?: string } => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Check if it starts with +
    if (!cleaned.startsWith('+')) {
      return { isValid: false, error: 'Phone number must include country code (e.g., +254...)' };
    }

    // Remove the + for length checking
    const digits = cleaned.slice(1);

    // Check length (most international numbers are 10-15 digits)
    if (digits.length < 10 || digits.length > 15) {
      return { isValid: false, error: 'Phone number length is invalid' };
    }

    // Check for common patterns
    const commonPatterns = [
      /^254\d{9}$/, // Kenya
      /^1\d{10}$/,  // US/Canada
      /^44\d{10}$/, // UK
      /^91\d{10}$/, // India
    ];

    const isKnownPattern = commonPatterns.some(pattern => pattern.test(digits));
    
    return {
      isValid: true,
      formatted: cleaned,
      ...(isKnownPattern ? {} : { error: 'Phone number format not recognized but will attempt delivery' })
    };
  };

  const batchValidatePhones = (phones: string[]): { valid: string[]; invalid: { phone: string; error: string }[] } => {
    const valid: string[] = [];
    const invalid: { phone: string; error: string }[] = [];

    phones.forEach(phone => {
      const validation = validatePhoneNumber(phone);
      if (validation.isValid && validation.formatted) {
        valid.push(validation.formatted);
      } else {
        invalid.push({ phone, error: validation.error || 'Invalid format' });
      }
    });

    return { valid, invalid };
  };

  return {
    executeWithRetry,
    validatePhoneNumber,
    batchValidatePhones,
    isRetrying
  };
};
