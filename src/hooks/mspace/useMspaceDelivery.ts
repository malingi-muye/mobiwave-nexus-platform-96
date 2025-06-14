
import { useState } from 'react';
import { toast } from 'sonner';
import { useMspaceCredentials } from './useMspaceCredentials';

interface DeliveryReportPayload {
  username: string;
  messageId: string;
}

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
  const { getApiCredentials } = useMspaceCredentials();

  const getDeliveryReport = async (messageId: string): Promise<MspaceDeliveryMessage | null> => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const payload: DeliveryReportPayload = {
        username: credentials.username,
        messageId
      };

      const response = await fetch('https://api.mspace.co.ke/smsapi/v2/deliveryreport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': credentials.api_key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to get delivery report');
      }

      const data = await response.json() as MspaceDeliveryResponse;
      
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
