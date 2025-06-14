
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useLoginSecurity() {
  const logSecurityEvent = async (eventType: string, severity: string = 'medium', details: any = {}) => {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_severity: severity,
        p_details: JSON.stringify(details)
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  return { logSecurityEvent };
}
