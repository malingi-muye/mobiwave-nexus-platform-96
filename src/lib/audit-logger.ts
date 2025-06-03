
import { AuditLog } from '@/types/audit';

class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLog[] = [];

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async logAction(
    userId: string,
    action: string,
    options: {
      resourceType?: string;
      resourceId?: string;
      metadata?: Record<string, any>;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      user_id: userId,
      action,
      resource_type: options.resourceType || null,
      resource_id: options.resourceId || null,
      ip_address: options.ipAddress || this.getClientIP(),
      user_agent: options.userAgent || navigator.userAgent,
      details: options.metadata,
      severity: options.severity || 'low',
      status: 'success'
    };

    this.logs.push(auditLog);
    
    // Send to backend/database
    await this.persistLog(auditLog);
    
    // Send to monitoring if critical
    if (auditLog.severity === 'critical') {
      await this.sendAlert(auditLog);
    }

    console.log('Audit Log:', auditLog);
  }

  private async persistLog(log: AuditLog): Promise<void> {
    try {
      // In a real implementation, this would send to your backend
      const response = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      });
      
      if (!response.ok) {
        console.error('Failed to persist audit log:', response.statusText);
      }
    } catch (error) {
      console.error('Error persisting audit log:', error);
      // Store locally as fallback
      localStorage.setItem(`audit_log_${log.id}`, JSON.stringify(log));
    }
  }

  private async sendAlert(log: AuditLog): Promise<void> {
    // Send critical alerts to monitoring system
    console.warn('CRITICAL AUDIT EVENT:', log);
    
    // In production, integrate with alerting systems like PagerDuty, Slack, etc.
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'security_alert',
          severity: log.severity,
          message: `Critical action: ${log.action} by user ${log.user_id}`,
          details: log
        })
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getClientIP(): string {
    // In a real implementation, this would be handled by the backend
    return 'client-side-unknown';
  }

  getLogs(): AuditLog[] {
    return [...this.logs];
  }

  getLogsByUser(userId: string): AuditLog[] {
    return this.logs.filter(log => log.user_id === userId);
  }

  getLogsByAction(action: string): AuditLog[] {
    return this.logs.filter(log => log.action === action);
  }

  getLogsBySeverity(severity: string): AuditLog[] {
    return this.logs.filter(log => log.severity === severity);
  }
}

export default AuditLogger;
