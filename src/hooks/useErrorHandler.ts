
import { toast } from 'sonner';

interface ErrorContext {
  operation: string;
  details?: Record<string, any>;
}

export const useErrorHandler = () => {
  const handleError = (error: any, context: ErrorContext) => {
    console.error(`Error in ${context.operation}:`, error, context.details);
    
    let message = 'An unexpected error occurred';
    
    // Handle specific error types
    if (error?.message) {
      if (error.message.includes('JWT expired')) {
        message = 'Your session has expired. Please log in again.';
      } else if (error.message.includes('Row level security')) {
        message = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate key')) {
        message = 'This item already exists.';
      } else if (error.message.includes('foreign key')) {
        message = 'Cannot complete operation due to related data.';
      } else {
        message = error.message;
      }
    }
    
    toast.error(`${context.operation}: ${message}`);
    
    // Log to audit if needed
    if (context.details?.userId) {
      // This would typically log to your audit system
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

  return {
    handleError,
    handleSuccess
  };
};
