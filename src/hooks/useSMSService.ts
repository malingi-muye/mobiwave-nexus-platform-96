
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRealSMSService } from './useRealSMSService';

interface SendSMSParams {
  recipients: string[];
  message: string;
  senderId?: string;
  campaignId?: string;
}

interface BulkSMSParams extends SendSMSParams {
  campaignName: string;
}

export const useSMSService = () => {
  const realSMSService = useRealSMSService();
  
  return {
    sendSMS: realSMSService.sendSMS,
    sendBulkSMS: realSMSService.sendBulkSMS,
    checkBalance: realSMSService.checkBalance,
    isLoading: realSMSService.isLoading,
    getDeliveryReport: async (messageId: string) => {
      try {
        const { data: message } = await supabase
          .from('message_history')
          .select('*')
          .eq('id', messageId)
          .single();

        return message;
      } catch (error) {
        console.error('Error getting delivery report:', error);
        throw error;
      }
    }
  };
};
