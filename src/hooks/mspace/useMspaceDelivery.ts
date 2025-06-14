
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MspaceDeliveryMessage {
  messageId: string;
  recipient: string;
  status: number;
  statusDescription: string;
}

interface MspaceDeliveryResponse {
  message: MspaceDeliveryMessage[];
}

export const useMspaceDelivery = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getDeliveryReport = async (messageId: string): Promise<MspaceDeliveryMessage | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mspace-delivery', {
        body: { messageId }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.message && Array.isArray(data.message) && data.message.length > 0) {
        return data.message[0];
      }
      
      return null;
    } catch (error: any) {
      console.error('Error getting delivery report:', error);
      toast.error(`Failed to get delivery report: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getDeliveryReport, isLoading };
};
