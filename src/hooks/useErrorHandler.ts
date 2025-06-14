
import { toast } from 'sonner';

interface ErrorContext {
  operation: string;
  details?: Record<string, any>;
  shouldRetry?: boolean;
  retryFn?: () => Promise<any>;
}

export const useErrorHandler = () => {
  const handleError = (error: any, context: ErrorContext) => {
    console.error(`Error in ${context.operation}:`, error, context.details);
    
    let message = 'An unexpected error occurred';
    let actionButton = null;
    
    // Handle specific error types
    if (error?.message) {
      if (error.message.includes('JWT expired') || error.message.includes('Invalid authorization')) {
        message = 'Your session has expired. Please log in again.';
      } else if (error.message.includes('Row level security') || error.message.includes('permission')) {
        message = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate key')) {
        message = 'This item already exists.';
      } else if (error.message.includes('foreign key')) {
        message = 'Cannot complete operation due to related data.';
      } else if (error.message.includes('credentials not configured')) {
        message = 'API credentials not configured. Please check your settings.';
      } else if (error.message.includes('Insufficient credits')) {
        message = 'Insufficient credits. Please top up your account.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        message = 'Network error. Please check your connection and try again.';
      } else {
        message = error.message;
      }
    }
    
    // Add retry button if retry function is provided
    if (context.shouldRetry && context.retryFn) {
      actionButton = {
        label: 'Retry',
        onClick: context.retryFn
      };
    }
    
    toast.error(`${context.operation}: ${message}`, {
      action: actionButton,
      duration: 5000
    });
    
    // Log to audit if needed
    if (context.details?.userId) {
      console.log('Audit log:', {
        action: 'error_occurred',
        userId: context.details.userId,
        operation: context.operation,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleSuccess = (message: string, details?: Record<string, any>) => {
    toast.success(message);
    
    if (details?.userId) {
      console.log('Success log:', {
        action: 'operation_success',
        userId: details.userId,
        message,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleRetry = async (operation: () => Promise<any>, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  return {
    handleError,
    handleSuccess,
    handleRetry
  };
};
