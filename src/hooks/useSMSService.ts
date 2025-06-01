
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SMSMessage {
  id: string;
  recipient: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  cost: number;
  created_at: string;
}

interface SendSMSRequest {
  recipients: string[];
  message: string;
  sender_id?: string;
}

export const useSMSService = () => {
  const sendSMS = useMutation({
    mutationFn: async (request: SendSMSRequest) => {
      const { data, error } = await supabase.functions.invoke('mspace-sms', {
        body: { action: 'send_sms', ...request }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const successCount = data.results?.filter((r: any) => r.success).length || 0;
      toast.success(`${successCount} SMS sent successfully. Cost: $${data.cost?.toFixed(2)}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send SMS');
    }
  });

  const getSMSHistory = useQuery({
    queryKey: ['sms-history'],
    queryFn: async (): Promise<SMSMessage[]> => {
      const { data, error } = await supabase
        .from('sms_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    }
  });

  return {
    sendSMS,
    getSMSHistory,
  };
};
