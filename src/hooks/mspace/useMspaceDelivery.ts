
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

export interface DeliveryStatus {
  messageId: string;
  recipient: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  statusDescription: string;
  timestamp?: string;
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

  const getBatchDeliveryReports = async (messageIds: string[]): Promise<DeliveryStatus[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mspace-delivery', {
        body: { messageIds, batchMode: true }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !Array.isArray(data)) {
        return [];
      }

      return data.map((item: any) => {
        // Map the Mspace API response to our DeliveryStatus interface
        const statusMap: Record<number, 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'> = {
          1: 'pending',
          2: 'sent',
          3: 'delivered',
          4: 'failed',
          5: 'bounced'
        };

        return {
          messageId: item.messageId,
          recipient: item.recipient,
          status: statusMap[item.status] || 'pending',
          statusDescription: item.statusDescription,
          timestamp: new Date().toISOString()
        };
      });
    } catch (error: any) {
      console.error('Error getting batch delivery reports:', error);
      toast.error(`Failed to get batch delivery reports: ${error.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    getDeliveryReport, 
    getBatchDeliveryReports,
    isLoading 
  };
};
