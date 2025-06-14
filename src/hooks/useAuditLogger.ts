
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuditLogger() {
  const [isLogging, setIsLogging] = useState(false);

  const logAuditEvent = async (
    action: string,
    tableName?: string,
    recordId?: string,
    oldData?: any,
    newData?: any
  ) => {
    setIsLogging(true);
    try {
      const { error } = await supabase.rpc('log_audit_event', {
        p_action: action,
        p_table_name: tableName,
        p_record_id: recordId,
        p_old_data: oldData ? JSON.stringify(oldData) : null,
        p_new_data: newData ? JSON.stringify(newData) : null
      });

      if (error) {
        console.error('Audit logging failed:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const logSecurityEvent = async (
    userId: string,
    eventType: string,
    details: {
      resourceType?: string;
      resourceId?: string;
      metadata?: any;
      severity?: 'low' | 'medium' | 'high' | 'critical';
    } = {}
  ) => {
    setIsLogging(true);
    try {
      const { error } = await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_severity: details.severity || 'medium',
        p_details: JSON.stringify({
          user_id: userId,
          resource_type: details.resourceType,
          resource_id: details.resourceId,
          metadata: details.metadata
        })
      });

      if (error) {
        console.error('Security event logging failed:', error);
      }
    } catch (error) {
      console.error('Security event logging error:', error);
    } finally {
      setIsLogging(false);
    }
  };

  return {
    logAuditEvent,
    logSecurityEvent,
    isLogging
  };
}
