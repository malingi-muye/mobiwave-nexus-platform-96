
import { supabase } from '@/integrations/supabase/client';

export const useAuditLogger = () => {
  const logSecurityEvent = async (
    userId: string, 
    action: string, 
    metadata?: Record<string, any>
  ) => {
    try {
      await supabase.rpc('log_audit_event', {
        p_action: action,
        p_table_name: 'security_events',
        p_record_id: null,
        p_old_data: null,
        p_new_data: metadata ? JSON.stringify(metadata) : null
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const logUserAction = async (
    action: string,
    tableName: string,
    recordId?: string,
    oldData?: any,
    newData?: any
  ) => {
    try {
      await supabase.rpc('log_audit_event', {
        p_action: action,
        p_table_name: tableName,
        p_record_id: recordId || null,
        p_old_data: oldData ? JSON.stringify(oldData) : null,
        p_new_data: newData ? JSON.stringify(newData) : null
      });
    } catch (error) {
      console.error('Failed to log user action:', error);
    }
  };

  return {
    logSecurityEvent,
    logUserAction
  };
};
