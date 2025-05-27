
import { useCallback } from 'react';
import AuditLogger from '@/lib/audit-logger';
import Logger from '@/lib/logger';

export const useAuditLogger = () => {
  const auditLogger = AuditLogger.getInstance();
  const logger = Logger.getInstance();

  const logUserAction = useCallback(async (
    userId: string,
    action: string,
    options?: {
      resourceType?: string;
      resourceId?: string;
      metadata?: Record<string, any>;
      severity?: 'low' | 'medium' | 'high' | 'critical';
    }
  ) => {
    try {
      await auditLogger.logAction(userId, action, options);
      logger.info(`User action logged: ${action}`, { userId, ...options });
    } catch (error) {
      logger.error('Failed to log user action', { error, userId, action });
    }
  }, [auditLogger, logger]);

  const logSecurityEvent = useCallback(async (
    userId: string,
    action: string,
    metadata?: Record<string, any>
  ) => {
    await logUserAction(userId, action, {
      resourceType: 'security',
      metadata,
      severity: 'high'
    });
  }, [logUserAction]);

  const logDataAccess = useCallback(async (
    userId: string,
    resourceType: string,
    resourceId: string,
    action: 'read' | 'write' | 'delete'
  ) => {
    await logUserAction(userId, `data_${action}`, {
      resourceType,
      resourceId,
      severity: action === 'delete' ? 'medium' : 'low'
    });
  }, [logUserAction]);

  return {
    logUserAction,
    logSecurityEvent,
    logDataAccess,
    getLogs: auditLogger.getLogs.bind(auditLogger),
    getLogsByUser: auditLogger.getLogsByUser.bind(auditLogger),
    getLogsByAction: auditLogger.getLogsByAction.bind(auditLogger)
  };
};
