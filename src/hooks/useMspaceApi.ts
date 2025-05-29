
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SMSRequest {
  recipients: string[];
  message: string;
  sender_id?: string;
  campaign_id?: string;
}

interface MspaceBalance {
  balance: number;
  currency: string;
}

export const useMspaceApi = () => {
  const sendSMS = useMutation({
    mutationFn: async (request: SMSRequest) => {
      const { data, error } = await supabase.functions.invoke('mspace-sms', {
        body: { action: 'send_sms', ...request }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const successCount = data.results?.filter((r: any) => r.success).length || 0;
      const failCount = data.results?.length - successCount || 0;
      
      if (successCount > 0) {
        toast.success(`${successCount} SMS sent successfully. Cost: $${data.cost?.toFixed(2)}`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} SMS failed to send`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send SMS');
    }
  });

  const checkBalance = useQuery({
    queryKey: ['mspace-balance'],
    queryFn: async (): Promise<MspaceBalance> => {
      const { data, error } = await supabase.functions.invoke('mspace-sms', {
        body: { action: 'check_balance' }
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const getDeliveryReports = useMutation({
    mutationFn: async (messageIds: string[]) => {
      const { data, error } = await supabase.functions.invoke('mspace-sms', {
        body: { action: 'get_delivery_reports', message_ids: messageIds }
      });

      if (error) throw error;
      return data;
    }
  });

  return {
    sendSMS,
    checkBalance,
    getDeliveryReports
  };
};
